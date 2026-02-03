"""
MCP Client Service - BaZi Server Communication
===============================================

This service allow our FastAPI Backend to communicate with BaZi MCP Server.


httpx library?
- Async support
- Modern Python HTTP client

Service Pattern kyun?
- Separation of Concerns: API logic alag, business logic alag
- Testability: Easy to mock in tests
- Reusability: Multiple routes same service use kar sakti hain
"""

import httpx
from typing import Optional
from datetime import datetime
import pytz
from timezonefinder import TimezoneFinder

from app.config import settings


class MCPClientError(Exception):
    """Custom exception for MCP client errors"""
    pass


class MCPClient:
    """
    Client for communicating with BaZi MCP Server
    
    Usage:
        client = MCPClient()
        result = await client.get_bazi_detail("1990-05-15", "14:30", "Karachi", "male")
    """
    
    def __init__(self, base_url: Optional[str] = None):
        """
        Initialize MCP Client
        
        Args:
            base_url: MCP server URL (default from settings)
        """
        self.base_url = base_url or settings.MCP_SERVER_URL
        self.tf = TimezoneFinder()
    
    def _get_timezone_offset(self, location: str) -> str:
        """
        Get timezone offset for any location worldwide.
        
        🎓 NOW USES DYNAMIC GEOCODING:
        - Nominatim API for any location
        - Smart caching (no repeated API calls)
        - Falls back to UTC if geocoding fails
        
        Args:
            location: City, Country (e.g., "Berlin, Germany")
            
        Returns:
            Timezone offset string (e.g., "+05:00")
        """
        # Import here to avoid circular imports
        from app.services.geocoding_service import geocoding_service
        
        # Get timezone using dynamic geocoding
        result = geocoding_service.get_timezone(location)
        tz_name = result["timezone"]
        
        try:
            tz = pytz.timezone(tz_name)
            offset = datetime.now(tz).strftime('%z')
            # Format: +0500 → +05:00
            return f"{offset[:3]}:{offset[3:]}"
        except Exception:
            return "+00:00"  # UTC fallback
    
    def _format_datetime_iso(
        self, 
        birth_date: str, 
        birth_time: str, 
        location: str
    ) -> str:
        """
        Format birth date/time to ISO format with timezone
        
        Args:
            birth_date: YYYY-MM-DD
            birth_time: HH:MM
            location: City, Country
            
        Returns:
            ISO datetime string (e.g., "1990-05-15T14:30:00+05:00")
        """
        offset = self._get_timezone_offset(location)
        return f"{birth_date}T{birth_time}:00{offset}"
    
    async def get_bazi_detail(
        self,
        birth_date: str,
        birth_time: str,
        location: str,
        gender: str = "male"
    ) -> dict:
        """
        Get BaZi details from MCP Server
        
        🎓 LEARNING POINT:
        async/await pattern:
        - Non-blocking I/O
        - Server can handle multiple requests simultaneously
        - Essential for production web apps
        
        Args:
            birth_date: YYYY-MM-DD format
            birth_time: HH:MM format
            location: City, Country
            gender: "male" or "female"
            
        Returns:
            Dict containing BaZi calculation results
            
        Raises:
            MCPClientError: If server communication fails
        """
        # Format datetime for MCP server
        solar_datetime = self._format_datetime_iso(birth_date, birth_time, location)
        
        # Prepare request payload
        payload = {
            "solarDatetime": solar_datetime,
            "gender": 1 if gender == "male" else 0
        }
        
        # Make async HTTP request
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.post(
                    f"{self.base_url}/api/bazi",
                    json=payload
                )
                response.raise_for_status()
                
                data = response.json()
                
                if data.get("success"):
                    return data.get("data", {})
                else:
                    raise MCPClientError(data.get("error", "Unknown error"))
                    
            except httpx.HTTPStatusError as e:
                raise MCPClientError(f"MCP Server error: {e.response.status_code}")
            except httpx.RequestError as e:
                raise MCPClientError(f"Connection error: {str(e)}")
    
    async def health_check(self) -> bool:
        """
        Check if MCP server is running
        
        Returns:
            True if healthy, False otherwise
        """
        async with httpx.AsyncClient(timeout=5.0) as client:
            try:
                response = await client.get(f"{self.base_url}/health")
                return response.status_code == 200
            except Exception:
                return False


# ===========================================
# Singleton Instance
# ===========================================
# Application-wide client instance
mcp_client = MCPClient()


# ===========================================
# Quick Test
# ===========================================
if __name__ == "__main__":
    import asyncio
    
    async def test():
        print("Testing MCP Client...")
        client = MCPClient()
        
        # Health check
        healthy = await client.health_check()
        print(f"MCP Server healthy: {healthy}")
        
        if healthy:
            # Get BaZi
            result = await client.get_bazi_detail(
                birth_date="1990-05-15",
                birth_time="14:30",
                location="Karachi, Pakistan",
                gender="male"
            )
            print(f"BaZi Result: {result.get('八字', 'N/A')}")
    
    asyncio.run(test())
