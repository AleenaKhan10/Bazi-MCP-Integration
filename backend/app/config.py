
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Application Settings
    
    It loads .env values
    """
    
    # ===========================================
    # Server Settings
    # ===========================================
    HOST: str = "0.0.0.0"  # Server IP (0.0.0.0 = all interfaces)
    PORT: int = 8000        # Server port
    DEBUG: bool = True      # Debug mode on/off
    
    # ===========================================
    MCP_SERVER_URL: str = "http://localhost:3000"
    
    ANTHROPIC_API_KEY: Optional[str] = None
    
    CLAUDE_MODEL: str = "claude-sonnet-4-5-20250929"
    
    # ===========================================
    # Pydantic Configuration
    # ===========================================
    class Config:
        # .env files values load
        env_file = ".env"
        
        # Case insensitive - "api_key" = "API_KEY"
        case_sensitive = False


# ===========================================
# Singleton Pattern
# ===========================================
settings = Settings()


# ===========================================
# Quick Test
# ===========================================
if __name__ == "__main__":
    """
    For testing: python config.py
    """
    print("📋 Current Settings:")
    print(f"   Host: {settings.HOST}")
    print(f"   Port: {settings.PORT}")
    print(f"   Debug: {settings.DEBUG}")
    print(f"   MCP Server: {settings.MCP_SERVER_URL}")
    print(f"   Claude API Key: {'✅ Set' if settings.ANTHROPIC_API_KEY else '❌ Not Set'}")
    print(f"   Claude Model: {settings.CLAUDE_MODEL}")
