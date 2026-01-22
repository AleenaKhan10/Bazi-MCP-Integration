"""
Rate Limiter Component
======================

Standalone rate limiting using SlowAPI.
Import 'limiter' from here to use in any router.

Usage:
    from app.core.limiter import limiter
    
    @router.get("/endpoint")
    @limiter.limit("10/hour")
    async def my_endpoint(request: Request):
        ...
"""

from slowapi import Limiter
from slowapi.util import get_remote_address


# Create limiter instance with IP-based rate limiting
limiter = Limiter(key_func=get_remote_address)
