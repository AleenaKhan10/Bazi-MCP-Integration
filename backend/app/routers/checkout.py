# backend/app/routers/checkout.py
import os
import stripe
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.config import settings

stripe.api_key = settings.STRIPE_API_KEY

router = APIRouter()

# package codes -> Stripe Price IDs + checkout mode
# VIP is a monthly recurring subscription (mode="subscription"); the others are one-time (mode="payment").
# Price IDs map directly to the Prices configured in the Stripe Dashboard.
PACKAGE_MAP = {
    "aibazifeonly":  {"price": "price_1TTYrcECidVHefax9OxMCCTD", "mode": "payment"},       # $18.88 one-time
    "aibazivip":     {"price": "price_1TTYrZECidVHefaxYGnLjVMV", "mode": "subscription"},  # $28.88 / month
    "aibaziotowc":   {"price": "price_1TTYrTECidVHefaxkviRBru1", "mode": "payment"},       # $49.00 one-time
    "aibaziprivate": {"price": "price_1TTYrXECidVHefaxyVVBWxFY", "mode": "payment"},       # $197.00 one-time
}

# Success URL routing - where each package redirects after payment
SUCCESS_URLS = {
    "aibazifeonly": "https://bazi.chimanifestation.com/oto-wind-chimes",
    "aibazivip": "https://bazi.chimanifestation.com/oto-wind-chimes",
    "aibaziotowc": "https://bazi.chimanifestation.com/oto-private-consultation-dom",
    "aibaziprivate": "https://calendly.com/ninewealthpalace/1-1-private-bazi-consultation",
}

CANCEL_URLS = {
    "aibazifeonly": "https://bazi.chimanifestation.com/closing",
    "aibazivip": "https://bazi.chimanifestation.com/closing",
    "aibaziotowc": "https://bazi.chimanifestation.com/oto-wind-chimes",
    "aibaziprivate": "https://bazi.chimanifestation.com/oto-private-consultation-dom",
}

# Packages that require physical shipping (others are digital-only)
PACKAGES_WITH_SHIPPING = {"aibaziotowc"}

# Stripe-supported country codes for international shipping
ALL_SHIPPING_COUNTRIES = [
    "AC", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AT", "AU", "AW", "AX", "AZ",
    "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS",
    "BT", "BV", "BW", "BY", "BZ", "CA", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO",
    "CR", "CV", "CW", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER",
    "ES", "ET", "FI", "FJ", "FK", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL",
    "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HN", "HR", "HT", "HU", "ID",
    "IE", "IL", "IM", "IN", "IO", "IQ", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI",
    "KM", "KN", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV",
    "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MK", "ML", "MM", "MN", "MO", "MQ", "MR", "MS", "MT",
    "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NG", "NI", "NL", "NO", "NP", "NR", "NU",
    "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PY", "QA",
    "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM",
    "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SZ", "TA", "TC", "TD", "TF", "TG", "TH", "TJ", "TK",
    "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "US", "UY", "UZ", "VA", "VC",
    "VE", "VG", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW", "ZZ"
]

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

    metadata = {
        "package_id": req.package_code,
        "fbp": req.fbp or "",
        "fbc": req.fbc or "",
        "event_id": req.event_id,
        "user_agent": req.user_agent[:500] if req.user_agent else "",
        "client_ip": client_ip,
        "customer_email": req.email,
    }

    session_params = {
        "mode": package_info["mode"],
        "payment_method_types": ["card"],
        "line_items": [{"price": package_info["price"], "quantity": 1}],
        "customer_email": req.email,
        "success_url": SUCCESS_URLS[req.package_code],
        "cancel_url": CANCEL_URLS[req.package_code],
        "phone_number_collection": {"enabled": True},
        "metadata": metadata,
    }

    # Mirror metadata onto the subscription object so it's available on
    # invoice.paid webhooks for recurring charges, not just the initial session.
    if package_info["mode"] == "subscription":
        session_params["subscription_data"] = {"metadata": metadata}

    # Wind Chimes is a physical product — collect shipping and charge $8 flat worldwide
    if req.package_code in PACKAGES_WITH_SHIPPING:
        session_params["shipping_address_collection"] = {
            "allowed_countries": ALL_SHIPPING_COUNTRIES
        }
        session_params["shipping_options"] = [
            {
                "shipping_rate_data": {
                    "type": "fixed_amount",
                    "fixed_amount": {"amount": 800, "currency": "usd"},
                    "display_name": "International Shipping",
                    "delivery_estimate": {
                        "minimum": {"unit": "business_day", "value": 7},
                        "maximum": {"unit": "business_day", "value": 18}
                    }
                }
            }
        ]

    try:
        session = stripe.checkout.Session.create(**session_params)
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
