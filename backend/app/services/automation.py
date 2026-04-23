import logging
import httpx
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# The Google Apps Script deployed endpoint URL
GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxrr86xvF01fyP4m7tjbHiwJijGinpewQaD2Au-_3CMKt91Biqz9puc1hwhnGjXhtV0RQ/exec"

async def push_to_google_sheet(
    email: str,
    name: str,
    package_id: str,
    payment_intent_id: str,
    day_master: str = ""
) -> bool:
    """
    Sends customer data to the configured Google Apps Script endpoint to log the purchase securely.
    """
    payload = {
        "email": email,
        "name": name,
        "dayMaster": day_master,
        "package": package_id,
        "paymentId": payment_intent_id
    }
    
    logger.info(f"📤 Pushing data to Google Sheets for customer: {email} (Package: {package_id})")
    
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            response = await client.post(GOOGLE_SCRIPT_URL, json=payload)
            response.raise_for_status()
            logger.info(f"✅ Successfully wrote to Google Sheet. Response: {response.text}")
            return True
            
    except httpx.HTTPError as e:
        logger.error(f"❌ Failed to push data to Google Sheet: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"❌ Unexpected error in push_to_google_sheet: {str(e)}")
        return False

async def push_to_clickfunnels(email: str, package_id: str) -> bool:
    """
    Placeholder service for ClickFunnels 2.0 API integration.
    This will be implemented fully once the CF API key and Workspace rules are defined.
    """
    logger.info(f"🚧 ClickFunnels Push Requested for {email} but API is not fully configured yet.")
    return True
