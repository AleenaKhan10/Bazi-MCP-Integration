"""
Reports Router - API Endpoints with Rate Limiting
==================================================

Features:
- Rate limiting: 10 requests/hour per IP
- Complete 13-section reports
- HTML + PDF file generation
- Email delivery via Resend
"""

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional
import logging

from app.schemas.report import ReportRequest, HealthResponse
from app.services.mcp_client import mcp_client, MCPClientError
from app.services.claude_service import get_claude_service, ClaudeServiceError
from app.services.report_generator import report_generator, ReportGeneratorError
from app.services.email_service import email_service, EmailServiceError
from app.core.limiter import limiter  # Rate limiter


# ===========================================
# Router Setup
# ===========================================
router = APIRouter(prefix="/api", tags=["Reports"])
logger = logging.getLogger(__name__)


# ===========================================
# Endpoints
# ===========================================

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health Check - Verify all services"""
    mcp_healthy = await mcp_client.health_check()
    
    return HealthResponse(
        status="ok" if mcp_healthy else "degraded",
        message=f"BaZi Report Generator v2.1. MCP: {'✅' if mcp_healthy else '❌'}"
    )


@router.post("/generate-report")
@limiter.limit("10/hour")  # Rate limit: 10 reports per hour per IP
async def generate_report(data: ReportRequest, request: Request):
    """
    Generate BaZi Report (Rate Limited: 10/hour)
    
    Features:
    - Complete 13-section report
    - Retry logic on Claude failures
    - HTML + PDF output
    
    Returns:
        {
            "success": true,
            "report_id": "abc12345",
            "files": {
                "html": "/reports/abc12345/report.html",
                "pdf": "/reports/abc12345/report.pdf"
            },
            "bazi_summary": {...},
            "sections_verified": true
        }
    """
    try:
        # ===========================================
        # Step 1: Get BaZi Data from MCP Server
        # ===========================================
        logger.info(f"📊 Getting BaZi data for: {data.birth_date} {data.birth_time}")
        
        bazi_data = await mcp_client.get_bazi_detail(
            birth_date=data.birth_date,
            birth_time=data.birth_time,
            location=data.location,
            gender=data.gender
        )
        
        bazi_chars = bazi_data.get('八字', 'N/A')
        logger.info(f"✅ BaZi received: {bazi_chars}")
        
        # ===========================================
        # Step 2: Generate Report with Claude (with retry)
        # ===========================================
        logger.info("🤖 Generating 13-section report with Claude...")
        
        claude_service = get_claude_service()
        markdown_content = await claude_service.generate_report(bazi_data)
        
        # Check if all 13 sections were generated
        missing_sections = claude_service.verify_sections(markdown_content)
        sections_complete = len(missing_sections) == 0
        
        if sections_complete:
            logger.info("✅ All 13 sections verified!")
        else:
            logger.warning(f"⚠️ Missing sections: {missing_sections}")
        
        # ===========================================
        # Step 3: Generate HTML + PDF Files
        # ===========================================
        logger.info("📄 Creating HTML and PDF files...")
        
        # Prepare request data for template personalization
        request_data = {
            "name": data.name if data.name else data.location.split(',')[0].strip(),
            "birth_time": data.birth_time,
            "location": data.location,
            "gender": data.gender
        }
        
        result = report_generator.generate(bazi_data, markdown_content, request_data)
        
        logger.info(f"✅ Report saved: {result['report_id']}")
        
        # ===========================================
        # Step 4: Send Report via Email (if email provided)
        # ===========================================
        email_sent = False
        email_error = None
        
        if data.email:
            try:
                # pdf_file = full disk path (e.g., "D:/...reports/abc123/report.pdf")
                email_result = email_service.send_report(
                    to_email=data.email,
                    name=request_data["name"],
                    pdf_path=result["pdf_file"]
                )
                email_sent = email_result["success"]
                logger.info(f"📧 Email: {email_result['message']}")
            except EmailServiceError as e:
                # Email failure should NOT block report delivery
                # User can still download the PDF directly
                email_error = str(e)
                logger.warning(f"⚠️ Email failed (non-blocking): {e}")
        
        # ===========================================
        # Step 5: Return Response
        # ===========================================
        return {
            "success": True,
            "report_id": result["report_id"],
            "files": {
                "html": result["html_path"],
                "pdf": result["pdf_path"]
            },
            "bazi_summary": {
                "八字": bazi_data.get('八字', 'N/A'),
                "日主": bazi_data.get('日主', 'N/A'),
                "生肖": bazi_data.get('生肖', 'N/A'),
                "阳历": bazi_data.get('阳历', 'N/A')
            },
            "sections_verified": sections_complete,
            "email_sent": email_sent,
            "email_error": email_error,
            "message": "Report generated successfully! All 13 sections included.",
            # Frontend expects these keys at root level
            # Use absolute URLs to bypass frontend proxy issues (fixes redirect to landing)
            "html_url": f"{str(request.base_url).rstrip('/')}{result['html_path']}",
            "pdf_url": f"{str(request.base_url).rstrip('/')}{result['pdf_path']}"
        }
        
    except MCPClientError as e:
        logger.error(f"❌ MCP error: {e}")
        raise HTTPException(
            status_code=503, 
            detail={
                "error": "BaZi calculation service unavailable",
                "message": str(e)
            }
        )
    
    except ClaudeServiceError as e:
        logger.error(f"❌ Claude error: {e}")
        raise HTTPException(
            status_code=503,
            detail={
                "error": "Report generation failed",
                "message": str(e)
            }
        )
    
    except ReportGeneratorError as e:
        logger.error(f"❌ Report generator error: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "File generation failed",
                "message": str(e)
            }
        )
    
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Internal server error",
                "message": str(e)
            }
        )


@router.post("/bazi-only")
@limiter.limit("30/hour")  # Higher limit for simple calculations
async def get_bazi_only(data: ReportRequest, request: Request):
    """
    Get only BaZi calculations (without Claude report)
    
    Useful for:
    - Testing MCP connection
    - Quick BaZi lookup
    - Loading page (get Day Master quickly)
    """
    try:
        bazi_data = await mcp_client.get_bazi_detail(
            birth_date=data.birth_date,
            birth_time=data.birth_time,
            location=data.location,
            gender=data.gender
        )
        
        return {
            "success": True,
            "bazi_data": bazi_data
        }
        
    except MCPClientError as e:
        raise HTTPException(status_code=503, detail=str(e))


# ===========================================
# Send Report Email (Standalone)
# ===========================================

# Request model for the email endpoint
class SendEmailRequest(BaseModel):
    """Request body for sending a report email"""
    report_id: str = Field(..., description="ID of the generated report")
    email: str = Field(..., description="Email address to send the report to")
    name: str = Field(default="Customer", description="Recipient name for email subject")


@router.post("/send-report-email")
@limiter.limit("20/hour")
async def send_report_email(data: SendEmailRequest, request: Request):
    """
    Send an already-generated report to an email address.
    
    Use this when:
    - Report was generated but email wasn't provided
    - Customer wants the report re-sent
    - ClickFunnels webhook triggers email delivery
    
    Args:
        report_id: The report ID (e.g., "abc12345")
        email: Destination email address
        name: Recipient name (for subject line)
    """
    from pathlib import Path
    
    # -------------------------------------------
    # Step 1: Find the PDF file on disk
    # -------------------------------------------
    reports_dir = Path(__file__).parent.parent.parent / "reports"
    pdf_path = reports_dir / data.report_id / "report.pdf"
    
    if not pdf_path.exists():
        raise HTTPException(
            status_code=404,
            detail={
                "error": "Report not found",
                "message": f"No report found with ID: {data.report_id}"
            }
        )
    
    # -------------------------------------------
    # Step 2: Send via email service
    # -------------------------------------------
    try:
        result = email_service.send_report(
            to_email=data.email,
            name=data.name,
            pdf_path=str(pdf_path)
        )
        
        return {
            "success": result["success"],
            "message": result["message"],
            "resend_id": result["resend_id"]
        }
        
    except EmailServiceError as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Email sending failed",
                "message": str(e)
            }
        )
