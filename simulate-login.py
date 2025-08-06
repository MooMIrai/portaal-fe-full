#!/usr/bin/env python3
import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:3000"
BACKEND_URL = "http://localhost:8081"
USERNAME = "mverde@taal.it"
PASSWORD = "Karazan$123"

print("=== Simulating Login Process ===")
print()

# Create session to maintain cookies
session = requests.Session()

# Step 1: Check if main page is accessible
print("1. Checking main page...")
try:
    response = session.get(BASE_URL)
    print(f"   ✓ Main page status: {response.status_code}")
except Exception as e:
    print(f"   ✗ Error accessing main page: {e}")
    sys.exit(1)

# Step 2: Try to login (assuming basic auth endpoint)
print("\n2. Attempting login...")
login_data = {
    "username": USERNAME,
    "password": PASSWORD
}

# Common login endpoints to try
login_endpoints = [
    f"{BACKEND_URL}/api/auth/login",
    f"{BACKEND_URL}/auth/login", 
    f"{BACKEND_URL}/login",
    f"{BASE_URL}/api/auth/login"
]

login_successful = False
for endpoint in login_endpoints:
    try:
        print(f"   Trying {endpoint}...")
        response = session.post(endpoint, json=login_data, timeout=5)
        if response.status_code == 200:
            print(f"   ✓ Login successful at {endpoint}")
            login_successful = True
            # Save any tokens
            if 'token' in response.json():
                session.headers['Authorization'] = f"Bearer {response.json()['token']}"
            break
        else:
            print(f"   - Response: {response.status_code}")
    except Exception as e:
        print(f"   - Failed: {type(e).__name__}")
        continue

if not login_successful:
    print("\n   ⚠ Could not find working login endpoint")
    print("   You'll need to login manually in the browser")

# Step 3: Check dashboard access
print("\n3. Checking dashboard access...")
try:
    response = session.get(f"{BASE_URL}/dashboard")
    print(f"   ✓ Dashboard page status: {response.status_code}")
    
    # Check if redirected to login
    if "login" in response.url.lower():
        print("   ⚠ Redirected to login page")
    else:
        print("   ✓ Dashboard accessible")
        
    # Check for error patterns
    if "error" in response.text.lower() or "failed" in response.text.lower():
        print("   ⚠ Found error keywords in response")
    else:
        print("   ✓ No obvious errors in response")
        
except Exception as e:
    print(f"   ✗ Error accessing dashboard: {e}")

print("\n=== Manual Testing Required ===")
print("Please test manually in your browser:")
print(f"1. Open {BASE_URL}")
print(f"2. Login with: {USERNAME} / {PASSWORD}")
print(f"3. Navigate to {BASE_URL}/dashboard")
print("\nCheck browser console for any React errors!")