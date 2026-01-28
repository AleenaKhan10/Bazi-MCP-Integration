"""
Geocoding Service - Dynamic Location → Timezone Conversion
============================================================
Uses Nominatim (FREE, unlimited) + TimezoneFinder (offline)

Features:
- No API key required
- Worldwide coverage
- Smart caching (avoids repeated API calls)
- Rate limiting protection (1 req/sec)
- Graceful fallback to UTC
"""

import time
import logging
from typing import Optional
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
from timezonefinder import TimezoneFinder

logger = logging.getLogger(__name__)


class GeocodingError(Exception):
    """Custom exception for geocoding failures"""
    pass


class GeocodingService:
    """
    Singleton service for converting any location to timezone.
    
    Uses Nominatim (OpenStreetMap) for geocoding and TimezoneFinder
    for offline timezone lookup from coordinates.
    """
    
    def __init__(self):
        # Nominatim requires user-agent identification
        self.geolocator = Nominatim(
            user_agent="bazi-destiny-report-generator-v1",
            timeout=10
        )
        
        # TimezoneFinder for offline coord → timezone lookup
        self.tf = TimezoneFinder()
        
        # In-memory cache (persists during server lifetime)
        self._cache: dict = {}
        
        # Rate limiting: track last request time
        self._last_request_time: float = 0
        self._min_request_interval: float = 1.1  # 1.1 seconds to be safe
        
        logger.info("🌍 GeocodingService initialized (Nominatim + TimezoneFinder)")
    
    def _normalize_location(self, location: str) -> str:
        """Normalize location string for cache key"""
        return location.lower().strip().replace("  ", " ")
    
    def _wait_for_rate_limit(self):
        """Ensure we don't exceed Nominatim's rate limit (1 req/sec)"""
        now = time.time()
        elapsed = now - self._last_request_time
        
        if elapsed < self._min_request_interval:
            wait_time = self._min_request_interval - elapsed
            logger.debug(f"⏳ Rate limiting: waiting {wait_time:.2f}s")
            time.sleep(wait_time)
        
        self._last_request_time = time.time()
    
    def get_timezone(self, location: str) -> dict:
        """
        Main method: Get timezone for any location worldwide.
        
        Args:
            location: Any location string (e.g., "Berlin, Germany", "Tokyo")
        
        Returns:
            dict: {
                "timezone": "Europe/Berlin",
                "latitude": 52.52,
                "longitude": 13.40,
                "display_name": "Berlin, Germany",
                "source": "cache" | "nominatim" | "fallback"
            }
        """
        cache_key = self._normalize_location(location)
        
        # Step 1: Check cache (instant)
        if cache_key in self._cache:
            cached = self._cache[cache_key]
            logger.info(f"📍 Cache hit: {location} → {cached['timezone']}")
            return {**cached, "source": "cache"}
        
        # Step 2: Geocode with Nominatim
        try:
            # Respect rate limit
            self._wait_for_rate_limit()
            
            logger.info(f"🔍 Geocoding: {location}")
            geo_result = self.geolocator.geocode(location)
            
            if geo_result:
                lat = geo_result.latitude
                lng = geo_result.longitude
                display_name = geo_result.address
                
                # Step 3: Get timezone from coordinates (offline, instant)
                timezone = self.tf.timezone_at(lat=lat, lng=lng)
                
                if timezone:
                    result = {
                        "timezone": timezone,
                        "latitude": lat,
                        "longitude": lng,
                        "display_name": display_name
                    }
                    
                    # Cache the result
                    self._cache[cache_key] = result
                    
                    logger.info(f"✅ Geocoded: {location} → {timezone} ({lat:.4f}, {lng:.4f})")
                    return {**result, "source": "nominatim"}
                else:
                    logger.warning(f"⚠️ No timezone found for coords: ({lat}, {lng})")
            else:
                logger.warning(f"⚠️ Nominatim returned no results for: {location}")
        
        except GeocoderTimedOut:
            logger.error(f"⏰ Geocoding timeout for: {location}")
        
        except GeocoderServiceError as e:
            logger.error(f"🚫 Geocoding service error: {e}")
        
        except Exception as e:
            logger.error(f"❌ Unexpected geocoding error: {e}")
        
        # Step 4: Fallback to UTC
        logger.warning(f"⚠️ Using UTC fallback for: {location}")
        fallback_result = {
            "timezone": "UTC",
            "latitude": 0.0,
            "longitude": 0.0,
            "display_name": location,
            "source": "fallback"
        }
        
        return fallback_result
    
    def get_timezone_string(self, location: str) -> str:
        """
        Simplified method: Just get the timezone string.
        
        Args:
            location: Any location string
            
        Returns:
            str: Timezone like "Asia/Karachi" or "UTC" on failure
        """
        result = self.get_timezone(location)
        return result["timezone"]
    
    def clear_cache(self):
        """Clear the location cache (useful for testing)"""
        self._cache.clear()
        logger.info("🗑️ Geocoding cache cleared")
    
    def get_cache_stats(self) -> dict:
        """Get cache statistics"""
        return {
            "cached_locations": len(self._cache),
            "locations": list(self._cache.keys())
        }


# Singleton instance
geocoding_service = GeocodingService()
