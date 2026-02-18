"""
Email Service - Send BaZi Reports via Resend
=============================================


Flow:
  1. Report is generated → PDF saved to disk
  2. This service reads the PDF file
  3. Sends it as an attachment via Resend API
  4. Returns success/failure status

Logo Handling:
  The Chi Manifestation logo (logo.png) is loaded from the project
  root at startup, base64-encoded, and embedded in every email as
  a CID (Content-ID) inline image. This is the most reliable way
  to show images in emails — no external hosting needed.

Template Variables:
  {name} → Python f-string replaces this with the customer's
           first name at send time. This is how %FIRSTNAME%
           becomes "Ahmed" or "Sarah" dynamically.

Usage:
  email_service = get_email_service()
  result = email_service.send_report(
      to_email="customer@gmail.com",
      name="Ahmed",
      pdf_path="reports/abc123/report.pdf"
  )
"""

import resend
import logging
import base64
from pathlib import Path
from typing import Optional

from app.config import settings

# ===========================================
# Logger Setup
# ===========================================
logger = logging.getLogger(__name__)


# ===========================================
# Custom Exception
# ===========================================
class EmailServiceError(Exception):
    """Raised when email sending fails"""
    pass


# ===========================================
# Logo Loading (runs once at startup)
# ===========================================
# Find the logo file: project_root/logo.png
# Path resolution: this file is in backend/app/services/
# So we go up 3 levels to reach project root
_PROJECT_ROOT = Path(__file__).parent.parent.parent.parent  # → bazi-mcp/
_LOGO_PATH = _PROJECT_ROOT / "logo.png"

# Pre-load the logo as raw bytes (for CID inline attachment)
# CID (Content-ID) method:
#   - Logo is attached to the email as a hidden inline image
#   - HTML references it via: <img src="cid:chi-logo">
#   - Works in Gmail, Outlook, Apple Mail, Yahoo, etc.
#   - base64 data URI does NOT work (blocked by most email clients)
_LOGO_BYTES: bytes = b""
if _LOGO_PATH.exists():
    with open(_LOGO_PATH, "rb") as f:
        _LOGO_BYTES = f.read()
    logger.info(f"✅ Logo loaded from: {_LOGO_PATH} ({len(_LOGO_BYTES)} bytes)")
else:
    logger.warning(f"⚠️ Logo not found at: {_LOGO_PATH} — emails will have no logo")


# ===========================================
# Email Service Class
# ===========================================
class EmailService:
    """
    Handles sending BaZi report PDFs via Resend.
    
    How it works:
    - Reads the PDF from disk
    - Converts to base64 (Resend needs this format)
    - Builds HTML email with Chi Manifestation logo + manager's text
    - Sends via Resend API with the PDF attached
    
    The 'from' address must be verified in Resend dashboard.
    Until domain is verified, use Resend's test address.
    """
    
    def __init__(self):
        """
        Initialize Resend with API key from .env
        If no key is set, email sending will be disabled (not crash)
        """
        self.api_key = settings.RESEND_API_KEY
        self.enabled = bool(self.api_key)
        
        if self.enabled:
            # Set the API key globally for the resend library
            resend.api_key = self.api_key
            logger.info("✅ Email Service: Resend configured")
        else:
            logger.warning("⚠️ Email Service: RESEND_API_KEY not set - emails disabled")
        
        # ===========================================
        # Sender address configuration
        # ===========================================
        # IMPORTANT: This must match a verified domain in Resend
        # Domain verified! Using production address.
        self.from_address = "Chi Manifestation <support@chimanifestation.com>"
    
    
    def _build_html_body(self, name: str) -> str:
        """
        Build the HTML email body with the manager's exact text.
        
        HOW DYNAMIC NAMES WORK:
        ========================
        
        In our code, we use Python f-strings: {name}
        
        When this function is called with name="Ahmed":
          f"Dear {name}" → "Dear Ahmed"
          f"Prepared exclusively for {name}" → "Prepared exclusively for Ahmed"
        
        So %FIRSTNAME% in manager's template = {name} in our code.
        Python automatically replaces {name} with whatever string
        is passed to this function.
        
        LOGO EMBEDDING:
        ================
        The logo is embedded as a base64 data URI:
          <img src="data:image/png;base64,iVBOR..." />
        
        This works in most email clients (Gmail, Outlook, Apple Mail).
        No external server needed to host the image.
        
        Args:
            name: Customer's first name (replaces %FIRSTNAME%)
        
        Returns:
            Complete HTML string for the email body
        """
        
        # Build the logo image tag
        # Uses CID (Content-ID) reference: src="cid:chi-logo"
        # The actual image is attached separately in send_report()
        # This method works in Gmail, Outlook, Apple Mail, Yahoo
        if _LOGO_BYTES:
            logo_html = '''
                <img 
                    src="cid:chi-logo" 
                    alt="Chi Manifestation" 
                    width="200" 
                    style="display: block; margin: 0 auto 20px auto; max-width: 200px; height: auto;"
                />
            '''
        else:
            # Fallback: text-based logo if image file is missing
            logo_html = '''
                <h2 style="
                    font-family: Georgia, serif;
                    color: #d4a843;
                    font-size: 28px;
                    margin: 0 0 20px 0;
                ">Chi Manifestation</h2>
            '''
        
        # ===========================================
        # Manager's Exact Email Template
        # ===========================================
        # {name} = Python replaces this with customer's first name
        # No crystal ball emoji in heading (manager's request)
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f1eb;">
            
            <!-- Outer container (email background) -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f1eb; padding: 30px 0;">
                <tr>
                    <td align="center">
                        
                        <!-- Inner card (white content area) -->
                        <table width="600" cellpadding="0" cellspacing="0" style="
                            max-width: 600px;
                            width: 100%;
                            background-color: #ffffff;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                        ">
                            
                            <!-- ========== LOGO SECTION (centered) ========== -->
                            <tr>
                                <td style="
                                    text-align: center;
                                    padding: 40px 40px 10px 40px;
                                    background: linear-gradient(180deg, #faf8f3 0%, #ffffff 100%);
                                ">
                                    {logo_html}
                                </td>
                            </tr>
                            
                            <!-- ========== TITLE SECTION ========== -->
                            <!-- No crystal ball emoji — manager's request -->
                            <tr>
                                <td style="text-align: center; padding: 10px 40px 5px 40px;">
                                    <h1 style="
                                        font-family: Georgia, 'Times New Roman', serif;
                                        color: #2c2c2c;
                                        font-size: 26px;
                                        font-weight: 700;
                                        margin: 0;
                                        letter-spacing: 0.5px;
                                    ">Your BaZi Destiny Report</h1>
                                </td>
                            </tr>
                            
                            <!-- "Prepared exclusively for NAME" -->
                            <tr>
                                <td style="text-align: center; padding: 5px 40px 25px 40px;">
                                    <p style="
                                        font-family: Georgia, serif;
                                        color: #8b7d6b;
                                        font-size: 15px;
                                        font-style: italic;
                                        margin: 0;
                                    ">Prepared exclusively for {name}</p>
                                </td>
                            </tr>
                            
                            <!-- ========== DIVIDER ========== -->
                            <tr>
                                <td style="padding: 0 40px;">
                                    <hr style="border: none; border-top: 1px solid #e8e0d4; margin: 0;">
                                </td>
                            </tr>
                            
                            <!-- ========== BODY TEXT ========== -->
                            <tr>
                                <td style="padding: 25px 40px 15px 40px;">
                                    <!-- Dear FIRSTNAME, -->
                                    <p style="
                                        font-family: 'Helvetica Neue', Arial, sans-serif;
                                        color: #2c2c2c;
                                        font-size: 16px;
                                        line-height: 1.6;
                                        margin: 0 0 16px 0;
                                    ">Dear {name},</p>
                                    
                                    <!-- Main message -->
                                    <p style="
                                        font-family: 'Helvetica Neue', Arial, sans-serif;
                                        color: #4a4a4a;
                                        font-size: 15px;
                                        line-height: 1.7;
                                        margin: 0 0 16px 0;
                                    ">Your personalized BaZi Destiny Report is ready.</p>
                                    
                                    <!-- PDF instruction -->
                                    <p style="
                                        font-family: 'Helvetica Neue', Arial, sans-serif;
                                        color: #4a4a4a;
                                        font-size: 15px;
                                        line-height: 1.7;
                                        margin: 0 0 20px 0;
                                    ">Click the PDF file attachment below to get started.</p>
                                </td>
                            </tr>
                            
                            <!-- ========== IMPORTANT DISCLAIMER ========== -->
                            <tr>
                                <td style="padding: 0 40px 30px 40px;">
                                    <div style="
                                        background-color: #faf8f3;
                                        border-left: 4px solid #d4a843;
                                        border-radius: 4px;
                                        padding: 18px 20px;
                                    ">
                                        <p style="
                                            font-family: 'Helvetica Neue', Arial, sans-serif;
                                            color: #5a4e3a;
                                            font-size: 14px;
                                            line-height: 1.7;
                                            margin: 0;
                                        "><strong style="color: #2c2c2c;">IMPORTANT:</strong> These are powerful predictions of what's upcoming for you based on your BaZi, so <strong>DO NOT</strong> rush through the report. Take your time to read, understand, and plan your next action step based on the recommendations.</p>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- ========== FOOTER ========== -->
                            <tr>
                                <td style="
                                    text-align: center;
                                    padding: 20px 40px;
                                    background-color: #faf8f3;
                                    border-top: 1px solid #e8e0d4;
                                ">
                                    <p style="
                                        font-family: 'Helvetica Neue', Arial, sans-serif;
                                        color: #a09585;
                                        font-size: 12px;
                                        margin: 0;
                                        line-height: 1.6;
                                    ">
                                        &copy; 2026 Chi Manifestation<br>
                                        BaZi Destiny Analysis
                                    </p>
                                </td>
                            </tr>
                            
                        </table><!-- End inner card -->
                    </td>
                </tr>
            </table><!-- End outer container -->
            
        </body>
        </html>
        """
        
        return html
    
    
    def send_report(
        self,
        to_email: str,
        name: str,
        pdf_path: str,
        subject: Optional[str] = None
    ) -> dict:
        """
        Send a BaZi report PDF to the customer's email.
        
        Args:
            to_email: Customer's email address (e.g., "ahmed@gmail.com")
            name:     Customer's name (used in email body)
            pdf_path: Full path to the PDF file on disk
            subject:  Optional custom subject line
        
        Returns:
            dict with keys: success (bool), message (str), resend_id (str|None)
        
        Example:
            result = email_service.send_report(
                to_email="test@gmail.com",
                name="Ahmed",
                pdf_path="reports/abc123/report.pdf"
            )
            # result = {"success": True, "message": "Email sent!", "resend_id": "abc..."}
        """
        
        # -------------------------------------------
        # Guard: Check if email service is enabled
        # -------------------------------------------
        if not self.enabled:
            logger.warning("📧 Email skipped - Resend not configured")
            return {
                "success": False,
                "message": "Email service not configured (RESEND_API_KEY missing)",
                "resend_id": None
            }
        
        # -------------------------------------------
        # Guard: Check if PDF file exists
        # -------------------------------------------
        pdf_file = Path(pdf_path)
        if not pdf_file.exists():
            error_msg = f"PDF not found: {pdf_path}"
            logger.error(f"❌ {error_msg}")
            raise EmailServiceError(error_msg)
        
        try:
            # -------------------------------------------
            # Step 1: Read PDF file and encode to base64
            # -------------------------------------------
            # Resend expects file content as a base64 string
            # We read the raw bytes, then encode them
            logger.info(f"📧 Reading PDF: {pdf_path}")
            
            with open(pdf_file, "rb") as f:
                pdf_bytes = f.read()
            
            pdf_base64 = base64.b64encode(pdf_bytes).decode("utf-8")
            
            # Get file size for logging (in KB)
            file_size_kb = len(pdf_bytes) / 1024
            logger.info(f"📧 PDF size: {file_size_kb:.1f} KB")
            
            # -------------------------------------------
            # Step 2: Build the email subject
            # -------------------------------------------
            # NO crystal ball emoji — manager's request
            # Clean, professional subject line
            if not subject:
                subject = f"{name}'s BaZi Destiny Report"
            
            # -------------------------------------------
            # Step 3: Build HTML email body (manager's template)
            # -------------------------------------------
            html_body = self._build_html_body(name)
            
            # -------------------------------------------
            # Step 4: Send via Resend API
            # -------------------------------------------
            logger.info(f"📧 Sending report to: {to_email}")
            
            # Build attachments list
            attachments_list = [
                # 1. The PDF report (visible attachment, user can download)
                {
                    "filename": f"{name}_BaZi_Destiny_Report.pdf",
                    "content": list(pdf_bytes),
                    "content_type": "application/pdf"
                }
            ]
            
            # 2. Logo as CID inline image (hidden, shows inside email body)
            # content_id = "chi-logo" matches src="cid:chi-logo" in HTML
            if _LOGO_BYTES:
                attachments_list.append({
                    "filename": "logo.png",
                    "content": list(_LOGO_BYTES),
                    "content_type": "image/png",
                    "content_id": "chi-logo"
                })
                logger.info("📧 Logo attached as CID inline image")
            
            response = resend.Emails.send({
                "from": self.from_address,
                "to": [to_email],
                "subject": subject,
                "html": html_body,
                "attachments": attachments_list
            })
            
            # -------------------------------------------
            # Step 5: Handle response
            # -------------------------------------------
            # Resend returns {"id": "email_id_here"} on success
            resend_id = response.get("id") if isinstance(response, dict) else str(response)
            
            logger.info(f"✅ Email sent successfully! Resend ID: {resend_id}")
            
            return {
                "success": True,
                "message": f"Report sent to {to_email}",
                "resend_id": resend_id
            }
            
        except Exception as e:
            # -------------------------------------------
            # Handle any Resend API errors
            # -------------------------------------------
            error_msg = f"Failed to send email: {str(e)}"
            logger.error(f"❌ {error_msg}")
            raise EmailServiceError(error_msg)


# ===========================================
# Singleton Instance
# ===========================================
# Only create one instance of the service (saves memory)
# Import this wherever you need to send emails:
#   from app.services.email_service import email_service
email_service = EmailService()


# ===========================================
# Helper function (alternative import style)
# ===========================================
def get_email_service() -> EmailService:
    """
    Get the email service instance.
    
    Usage:
        from app.services.email_service import get_email_service
        service = get_email_service()
        service.send_report(...)
    """
    return email_service
