"""
Schemas Module - Request/Response Models with Comprehensive Validation
=======================================================================

- Define Data's structure
- Pydantic models provides automatic validation
- It generates API Documentation
1. Protects from Invalid Data (e.g wrong data format)
2. Clear API Contract (Frontend knows what to send)
3. FastAPI automatically converts JSON
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
from datetime import date, datetime
import re


# ===========================================
# Request Models (Frontend → Backend)
# ===========================================

class ReportRequest(BaseModel):
    """
    Generate Report Request
    It validates data coming from frontend.
    If any field is missing or wrong type, it will raise an error.
    """
    
    # Birth date - required
    birth_date: str = Field(
        ...,  # ... means required
        description="Date of birth (YYYY-MM-DD format)",
        examples=["1990-05-15"],
        min_length=10,
        max_length=10
    )
    
    # Birth time - required
    birth_time: str = Field(
        ...,
        description="Time of birth (HH:MM format, 24-hour)",
        examples=["14:30"],
        min_length=5,
        max_length=5
    )
    
    # Location - required for timezone
    location: str = Field(
        ...,
        description="Birth location (City, Country)",
        examples=["Karachi, Pakistan"],
        min_length=3,
        max_length=100
    )
    
    # Gender - optional, default male
    gender: Literal["male", "female"] = Field(
        default="male",
        description="Gender for BaZi calculations"
    )
    
    # Output format
    output_format: Literal["html", "pdf", "both"] = Field(
        default="both",
        description="Desired output format"
    )
    
    # =======================================
    # Custom Validators
    # =======================================
    
    @field_validator('birth_date')
    @classmethod
    def validate_birth_date(cls, v: str) -> str:
        """Validate date format and range"""
        v = v.strip()
        
        # Check format with regex
        if not re.match(r'^\d{4}-\d{2}-\d{2}$', v):
            raise ValueError('Date must be in YYYY-MM-DD format')
        
        # Parse and validate the date
        try:
            parsed_date = datetime.strptime(v, '%Y-%m-%d').date()
        except ValueError:
            raise ValueError('Invalid date. Please check month and day values.')
        
        # Check not in the future
        if parsed_date > date.today():
            raise ValueError('Birth date cannot be in the future')
        
        # Check not before 1900
        if parsed_date.year < 1900:
            raise ValueError('Birth date must be after year 1900')
        
        return v
    
    @field_validator('location')
    @classmethod
    def validate_location(cls, v: str) -> str:
        """Validate and sanitize location"""
        # Strip whitespace
        v = v.strip()
        
        # Check minimum length
        if len(v) < 3:
            raise ValueError('Location must be at least 3 characters')
        
        # Check maximum length
        if len(v) > 100:
            raise ValueError('Location is too long (max 100 characters)')
        
        # Basic sanitization - remove any HTML tags
        v = re.sub(r'<[^>]*>', '', v)
        
        return v


class HealthResponse(BaseModel):
    """Health check response"""
    status: str = "ok"
    message: str = "BaZi Report Generator is running"


# ===========================================
# Response Models (Backend → Frontend)
# ===========================================

class BaziData(BaseModel):
    """
    BaZi calculation result from MCP Server
    """
    # Basic info
    eight_chars: Optional[str] = Field(None, alias="八字")
    day_master: Optional[str] = Field(None, alias="日主")
    zodiac: Optional[str] = Field(None, alias="生肖")
    
    # We'll store the full raw data too
    raw_data: dict = Field(default_factory=dict)
    
    class Config:
        # Allow both Chinese and English field names
        populate_by_name = True


class ReportResponse(BaseModel):
    """
    Generate Report Response
    
    Frontend's Data Structure
    """
    success: bool = Field(
        description="Whether report generation succeeded"
    )
    
    # Report content
    html_content: Optional[str] = Field(
        None,
        description="HTML formatted report"
    )
    
    pdf_url: Optional[str] = Field(
        None,
        description="URL to download PDF report"
    )
    
    # Original BaZi data (for debugging/display)
    bazi_data: Optional[dict] = Field(
        None,
        description="Raw BaZi calculation data"
    )
    
    # Error info
    error: Optional[str] = Field(
        None,
        description="Error message if failed"
    )


class ErrorResponse(BaseModel):
    """Standard error response"""
    success: bool = False
    error: str
    detail: Optional[str] = None
