"""
Test script for BaZi MCP Server
================================
This script tests the MCP server API to verify it's working correctly.
"""

import json
import urllib.request
import urllib.error

# New REST API endpoint (much simpler than MCP protocol)
API_URL = "http://localhost:3000/api/bazi"

def test_mcp_server():
    """Test the MCP server with a sample BaZi request"""
    
    # Simple REST API request
    request_data = {
        "solarDatetime": "1990-05-15T14:30:00+05:00",  # Sample: May 15, 1990, 2:30 PM PKT
        "gender": 1  # Male
    }
    
    try:
        # Create request
        req = urllib.request.Request(
            API_URL,
            data=json.dumps(request_data).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        
        # Send request
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("✅ MCP Server Response:")
            print(json.dumps(result, indent=2, ensure_ascii=False))
            return result
            
    except urllib.error.URLError as e:
        print(f"❌ Connection Error: {e}")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    print("Testing BaZi MCP Server...")
    print(f"URL: {API_URL}")
    print("-" * 50)
    test_mcp_server()
