# backend/app/routers/checkout.py
import os
import stripe
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.config import settings

stripe.api_key = settings.STRIPE_API_KEY

router = APIRouter()

# package codes -> Product IDs and Prices
# Stripe uses `prod_` IDs instead of `price_` IDs, so we use price_data for inline pricing.
PACKAGE_MAP = {
    "aibazifeonly": {"product": "prod_UL9O2D7XON9dL0", "amount": 1888},      # $18.88
    "aibazivip": {"product": "prod_UL9PRfWTtU4qYg", "amount": 2888},         # $28.88
    "aibaziotowc": {"product": "prod_UL9RRhkjQyZy5J", "amount": 4900},       # $49.00
    "aibaziprivate": {"product": "prod_UL9Q8Yn1ALXh9W", "amount": 19700},    # $197.00
}

# Success URL routing - where each package redirects after payment
SUCCESS_URLS = {
    "aibazifeonly": "https://bazi.chimanifestation.com/oto-wind-chimes",
    "aibazivip": "https://bazi.chimanifestation.com/oto-wind-chimes",
    "aibaziotowc": "https://bazi.chimanifestation.com/oto-private-consultation-dom",
    "aibaziprivate": "https://www.chimanifestation.com/bazi-summary", # End of funnel
}

CANCEL_URLS = {
    "aibazifeonly": "https://bazi.chimanifestation.com/closing",
    "aibazivip": "https://bazi.chimanifestation.com/closing",
    "aibaziotowc": "https://bazi.chimanifestation.com/oto-wind-chimes",
    "aibaziprivate": "https://bazi.chimanifestation.com/oto-private-consultation-dom",
}

class CreateSessionRequest(BaseModel):
    package_code: str
    email: str
    fbp: Optional[str] = None
    fbc: Optional[str] = None
    event_id: str
    user_agent: str

@router.post("/api/checkout/create-session")
async def create_session(req: CreateSessionRequest, request: Request):
    if req.package_code not in PACKAGE_MAP:
        raise HTTPException(status_code=400, detail="Unknown package_code")
        
    package_info = PACKAGE_MAP[req.package_code]

    # Capture client IP (handle proxy headers if behind a reverse proxy)
    client_ip = request.headers.get("x-forwarded-for", request.client.host)
    if client_ip:
        client_ip = client_ip.split(",")[0].strip()
    else:
        client_ip = ""

    try:
        session = stripe.checkout.Session.create(
            mode="payment",
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product": package_info["product"],
                    "unit_amount": package_info["amount"],
                },
                "quantity": 1
            }],
            customer_email=req.email,
            success_url=SUCCESS_URLS[req.package_code],
            cancel_url=CANCEL_URLS[req.package_code],
            metadata={
                "package_id": req.package_code,
                "fbp": req.fbp or "",
                "fbc": req.fbc or "",
                "event_id": req.event_id,
                "user_agent": req.user_agent[:500] if req.user_agent else "",
                "client_ip": client_ip,
                "customer_email": req.email,
            }
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
