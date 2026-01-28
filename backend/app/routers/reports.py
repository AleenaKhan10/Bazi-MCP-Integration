"""
Reports Router - Single Endpoint with Rate Limiting
====================================================

Features:
- Rate limiting: 10 requests/hour per IP
- Complete 13-section reports
- HTML + PDF file generation
"""

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
import logging

from app.schemas.report import ReportRequest, HealthResponse
from app.services.mcp_client import mcp_client, MCPClientError
from app.services.claude_service import get_claude_service, ClaudeServiceError
from app.services.report_generator import report_generator, ReportGeneratorError
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
        markdown_content = claude_service.generate_report(bazi_data)
        
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
        # Step 4: Return Response
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
            "message": "Report generated successfully! All 13 sections included."
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
    - Debugging
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
