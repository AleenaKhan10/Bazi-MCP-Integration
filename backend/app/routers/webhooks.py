from fastapi import APIRouter, Request, HTTPException, BackgroundTasks, Header
import stripe
import logging
from typing import Optional

from app.config import settings
from app.services.automation import push_to_google_sheet, push_to_clickfunnels

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
        session = event.data.object
        
        # 1. Extract Tracking Identity Tags
        raw_client_ref = getattr(session, 'client_reference_id', None)
        payment_intent = getattr(session, 'payment_intent', 'unknown_intent')
        
        # Parse the combined client_reference_id (e.g. email___packageid)
        original_email = None
        client_reference_id = None
        
        if raw_client_ref and "___" in raw_client_ref:
            original_email_safe, client_reference_id = raw_client_ref.split("___", 1)
            # Restore the safe email back to its true form
            original_email = original_email_safe.replace('_at_', '@').replace('_dot_', '.').replace('_plus_', '+')
        else:
            client_reference_id = raw_client_ref
            
        # 2. Extract Customer Informational Data
        customer_details = getattr(session, 'customer_details', None)
        stripe_email = getattr(customer_details, 'email', '') if customer_details else ''
        name = getattr(customer_details, 'name', 'Unknown User') if customer_details else 'Unknown User'
        
        # Use original_email from tracking if available, otherwise fallback to stripe_email
        final_email = original_email if original_email else stripe_email
        
        # Extract DayMaster if you decide to pass it via session metadata
        metadata = getattr(session, 'metadata', None)
        day_master = getattr(metadata, 'dayMaster', '') if metadata else ''

        
        logger.info(f"💰 Successful Payment Received! Customer (Form): {final_email} (Stripe: {stripe_email}), Package ID: {client_reference_id}")
        
        if client_reference_id:
            # 3. Offload external API calls to background tasks so Stripe gets a quick 200 OK
            background_tasks.add_task(
                push_to_google_sheet,
                email=final_email,
                name=name,
                package_id=client_reference_id,
                payment_intent_id=payment_intent,
                day_master=day_master
            )
            
            background_tasks.add_task(
                push_to_clickfunnels,
                email=final_email,
                package_id=client_reference_id
            )
        else:
            logger.warning(f"Payment received for {final_email} but NO client_reference_id was attached. Manual intervention may be needed.")

    return {"status": "success"}
