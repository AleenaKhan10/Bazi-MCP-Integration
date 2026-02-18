import requests
import json

url = "http://localhost:8000/api/generate-report"
headers = {"Content-Type": "application/json"}
data = {
    "birth_date": "1990-01-01",
    "birth_time": "12:00",
    "location": "New York, USA",
    "gender": "male",
    "name": "Test User",
    "email": "test@example.com"
}

try:
    print(f"Sending POST to {url}...")
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        json_data = response.json()
        print("\n=== RESPONSE KEYS ===")
        print(json.dumps(list(json_data.keys()), indent=2))
        
        print("\n=== CHECKING FOR PDF_URL ===")
        if "pdf_url" in json_data:
            print(f"✅ pdf_url found: {json_data['pdf_url']}")
        else:
            print("❌ pdf_url NOT found!")
            
        if "html_url" in json_data:
            print(f"✅ html_url found: {json_data['html_url']}")
        else:
            print("❌ html_url NOT found!")
            
    else:
        print(f"❌ Error: {response.text}")

except Exception as e:
    print(f"❌ Exception: {e}")
