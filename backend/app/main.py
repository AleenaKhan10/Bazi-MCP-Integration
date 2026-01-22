"""
BaZi Report Generator - FastAPI Application
============================================

Features:
- Rate limiting with SlowAPI
- Static file serving for reports
- CORS middleware
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from pathlib import Path
import logging

from app.config import settings
from app.routers import reports
from app.core.limiter import limiter  # Import shared limiter instance

# ===========================================
# Logging Setup
# ===========================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# ===========================================
# Rate Limiter - Imported from core.limiter
# ===========================================
# limiter is imported from app.core.limiter

# ===========================================
# FastAPI Application
# ===========================================
app = FastAPI(
    title="BaZi Report Generator",
    description="""
    🔮 Generate personalized BaZi (Chinese Astrology) reports using AI.
    
    ## Features
    - BaZi calculations via MCP Server
    - AI-powered report generation with Claude (13 sections)
    - HTML and PDF output files
    - Rate limiting: 5 reports per hour
    
    ## Endpoints
    - **POST /api/generate-report**: Generate full report → HTML + PDF files
    - **POST /api/bazi-only**: Get raw BaZi calculations
    - **GET /api/health**: Health check
    - **GET /reports/{id}/report.html**: View HTML report
    - **GET /reports/{id}/report.pdf**: Download PDF report
    """,
    version="2.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ===========================================
# Add Rate Limiter to App
# ===========================================
app.state.limiter = limiter

# Custom rate limit error handler
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    """Return friendly message when rate limit is exceeded"""
    return JSONResponse(
        status_code=429,
        content={
            "error": "Rate limit exceeded",
            "message": "You've reached your limit of 5 reports per hour. Please try again later.",
            "detail": str(exc.detail)
        }
    )

# ===========================================
# CORS Middleware
# ===========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===========================================
# Static Files - Reports Directory
# ===========================================
reports_dir = Path(__file__).parent.parent / "reports"
reports_dir.mkdir(parents=True, exist_ok=True)

# Mount static file serving
app.mount("/reports", StaticFiles(directory=str(reports_dir)), name="reports")

# ===========================================
# Include Routers
# ===========================================
app.include_router(reports.router)

# ===========================================
# Root Endpoint
# ===========================================
@app.get("/")
async def root():
    """API Information"""
    return {
        "name": "BaZi Report Generator API",
        "version": "2.1.0",
        "features": [
            "13 sections report",
            "Retry logic on failures",
            "Rate limiting: 5/hour"
        ],
        "docs": "/docs",
        "health": "/api/health"
    }

# ===========================================
# Startup Event
# ===========================================
@app.on_event("startup")
async def startup_event():
    """Startup checks"""
    logger.info("🚀 Starting BaZi Report Generator v2.1...")
    logger.info(f"   📁 Reports: {reports_dir}")
    logger.info(f"   🔗 MCP: {settings.MCP_SERVER_URL}")
    logger.info(f"   🤖 Claude: {settings.CLAUDE_MODEL}")
    logger.info("   🚦 Rate Limit: 5 requests/hour per IP")
    
    # Check MCP server
    from app.services.mcp_client import mcp_client
    if await mcp_client.health_check():
        logger.info("   ✅ MCP Server: Connected")
    else:
        logger.warning("   ⚠️ MCP Server: Not reachable")
    
    # Check Claude API key
    if settings.ANTHROPIC_API_KEY:
        logger.info("   ✅ Claude API: Key configured")
    else:
        logger.warning("   ⚠️ Claude API: Key not set!")


# ===========================================
# Run Server
# ===========================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
