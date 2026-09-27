import requests
import sys

def verify():
    print("Testing API health endpoint to verify database connection...")
    try:
        response = requests.get('http://127.0.0.1:5000/api/health')
        if response.status_code == 200:
            print("✅ Success! API is healthy.")
            print(response.json())
        else:
            print(f"❌ Failed: API returned status {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Failed to connect to API: {e}")

if __name__ == '__main__':
    verify()
