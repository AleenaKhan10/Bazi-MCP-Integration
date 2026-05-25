# backend/app/services/meta_capi.py
import os
import time
import hashlib
import httpx

META_PIXEL_ID = os.getenv("META_PIXEL_ID")
META_ACCESS_TOKEN = os.getenv("META_CAPI_ACCESS_TOKEN")
META_TEST_EVENT_CODE = os.getenv("META_TEST_EVENT_CODE")  # Only during testing
SITE_URL = os.getenv("SITE_URL", "https://bazi.chimanifestation.com")

def _sha256(value: str) -> str:
    """Hashes a string with SHA256 as required by Meta CAPI for PII."""
    return hashlib.sha256(value.lower().strip().encode("utf-8")).hexdigest()

async def send_purchase_to_meta(session: dict):
    """
    Sends a Purchase event to Meta Conversions API.
    """
    if not META_PIXEL_ID or not META_ACCESS_TOKEN:
        print("[Meta CAPI] Missing Pixel ID or Access Token. Skipping CAPI request.")
        return

    metadata = session.get("metadata", {}) or {}
    email = (
        metadata.get("customer_email")
        or (session.get("customer_details") or {}).get("email")
    )

    if not email:
        print("[Meta CAPI] No email available for event - skipping")
        return

    user_data = {
        "em": [_sha256(email)],
        "client_ip_address": metadata.get("client_ip"),
        "client_user_agent": metadata.get("user_agent"),
    }

    if metadata.get("fbp"):
        user_data["fbp"] = metadata["fbp"]
    if metadata.get("fbc"):
        user_data["fbc"] = metadata["fbc"]

    # Remove any None/empty values (Meta is strict about this)
    user_data = {k: v for k, v in user_data.items() if v}

    payload = {
        "data": [{
            "event_name": "Purchase",
            "event_time": int(time.time()),
            "event_id": metadata.get("event_id"),
            "action_source": "website",
            "event_source_url": SITE_URL,
            "user_data": user_data,
            "custom_data": {
                "currency": (session.get("currency") or "usd").upper(),
                "value": (session.get("amount_total") or 0) / 100,
                "content_name": metadata.get("package_id"),
                "content_ids": [metadata.get("package_id")],
                "content_type": "product",
            }
        }]
    }

    if META_TEST_EVENT_CODE:
        payload["test_event_code"] = META_TEST_EVENT_CODE

    url = (
        f"https://graph.facebook.com/v19.0/{META_PIXEL_ID}/events"
        f"?access_token={META_ACCESS_TOKEN}"
    )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, json=payload)
            result = response.json()
            if response.status_code >= 400:
                print(f"[Meta CAPI] Error: {result}")
            else:
                print(f"[Meta CAPI] Success: {result}")
            return result
    except Exception as e:
        print(f"[Meta CAPI] Request failed: {e}")
