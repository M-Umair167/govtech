import requests

def test_manual_auth():
    base_url = "http://localhost:8000/api/v1/auth"
    
    # User Data
    user_data = {
        "full_name": "Test User",
        "email": "test@gmail.com",
        "password": "test@123"
    }

    # 1. Signup
    print("Testing Signup...")
    try:
        resp = requests.post(f"{base_url}/signup", json=user_data)
        if resp.status_code == 200:
            print("Signup Successful:", resp.json())
        elif resp.status_code == 400 and "already exists" in resp.text:
             print("User already exists (Expected if run multiple times)")
        else:
            print("Signup Failed:", resp.status_code, resp.text)
    except Exception as e:
        print("Signup Request Error:", e)

    # 2. Login
    print("\nTesting Login...")
    login_data = {
        "email": "test@gmail.com",
        "password": "test@123"
    }
    try:
        resp = requests.post(f"{base_url}/token", json=login_data)
        if resp.status_code == 200:
            token = resp.json()
            print("Login Successful!")
            print("Access Token:", token['access_token'][:20] + "...")
        else:
            print("Login Failed:", resp.status_code, resp.text)
    except Exception as e:
         print("Login Request Error:", e)

if __name__ == "__main__":
    test_manual_auth()
