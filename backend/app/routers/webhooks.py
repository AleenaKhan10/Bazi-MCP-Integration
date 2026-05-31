from fastapi import APIRouter, Request, HTTPException, BackgroundTasks, Header
import stripe
import logging
from typing import Optional

from app.config import settings
from app.services.automation import push_to_google_sheet, push_to_clickfunnels
from app.services.meta_capi import send_purchase_to_meta

router = APIRouter(prefix="/api/webhooks", tags=["Webhooks"])
logger = logging.getLogger(__name__)

stripe.api_key = settings.STRIPE_API_KEY

@router.post("/stripe")
async def stripe_webhook(
    request: Request, 
    background_tasks: BackgroundTasks,
    stripe_signature: Optional[str] = Header(None, alias="Stripe-Signature")
):
    """
    Receives incoming webhook events natively from Stripe.
    Automatically filters for 'checkout.session.completed' to fulfill orders.
    """
    if not settings.STRIPE_WEBHOOK_SECRET:
        logger.error("Stripe Webhook Secret not configured in .env")
        raise HTTPException(status_code=500, detail="Server webhook configuration error")
        
    if not stripe_signature:
        logger.error("Missing Stripe-Signature header in webhook request")
        raise HTTPException(status_code=400, detail="Missing signature header")

    payload = await request.body()
    
    try:
        # Cryptographically verify the event was sent by Stripe
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        # Invalid payload
        logger.error(f"⚠️ Webhook error while parsing basic request. {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        logger.error(f"⚠️ Webhook signature verification failed. {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the checkout.session.completed event
    if event.type == 'checkout.session.completed':
        # Convert Stripe object to plain dict — StripeObject in SDK 15.x no longer
        # extends dict, so .get() raises AttributeError otherwise.
        session = event.data.object.to_dict()
        payment_intent = session.get('payment_intent', 'unknown_intent')

        # 1. NEW: Extract from Metadata (Stripe Checkout Sessions)
        metadata = session.get('metadata') or {}
        package_id = metadata.get("package_id")

        customer_details = session.get('customer_details') or {}
        email = metadata.get("customer_email") or customer_details.get('email') or session.get('customer_email', '')

        # 2. LEGACY FALLBACK: Extract from client_reference_id (Stripe Payment Links)
        # Remove this block 7 days after full cutover.
        if not package_id:
            raw_client_ref = session.get('client_reference_id')
            if raw_client_ref and "___" in raw_client_ref:
                original_email_safe, package_id = raw_client_ref.split("___", 1)
                if not email:
                    email = original_email_safe.replace('_at_', '@').replace('_dot_', '.').replace('_plus_', '+')
            else:
                package_id = raw_client_ref

        day_master = metadata.get('dayMaster', '')

        logger.info(f"💰 Successful Payment Received! Customer: {email}, Package ID: {package_id}")

        # Wind Chimes is a physical product — log shipping for manual fulfillment
        if package_id == "aibaziotowc":
            shipping_details = session.get("shipping_details") or session.get("shipping")
            if shipping_details:
                logger.info(f"[Wind Chimes Order] Customer email: {email}")
                logger.info(f"[Wind Chimes Order] Shipping details: {shipping_details}")
            else:
                logger.warning(f"[Wind Chimes Order] No shipping details on session for {email}")

        if package_id:
            # 3. Offload external API calls to background tasks so Stripe gets a quick 200 OK
            background_tasks.add_task(
                push_to_google_sheet,
                email=email,
                name="",
                package_id=package_id,
                payment_intent_id=payment_intent,
                day_master=day_master
            )
            
            background_tasks.add_task(
                push_to_clickfunnels,
                email=email,
                package_id=package_id
            )

            # 4. NEW: Meta CAPI call
            background_tasks.add_task(send_purchase_to_meta, session)
        else:
            logger.warning(f"Payment received for {email} but NO package_id was attached. Manual intervention may be needed.")

    return {"status": "success"}
