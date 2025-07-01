#!/usr/bin/env python3
"""
Test Database Integration

This script tests the database integration by creating sample data.
"""

import sys
import os
import requests
import json

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import SessionLocal
from app.services.database import create_location, get_locations

def test_database_direct():
    """Test database operations directly."""
    print("🧪 Testing database operations...")
    
    db = SessionLocal()
    try:
        # Create a test location
        location = create_location(
            db=db,
            address="Avenida Paulista, 1000",
            latitude=-23.5505,
            longitude=-46.6333
        )
        print(f"✅ Created location: {location.address} (ID: {location.id})")
        
        # Get all locations
        locations = get_locations(db=db)
        print(f"📍 Total locations in database: {len(locations)}")
        
        for loc in locations:
            print(f"  - {loc.address} ({loc.latitude}, {loc.longitude})")
            
    except Exception as e:
        print(f"❌ Database test failed: {e}")
    finally:
        db.close()

def test_api_endpoints():
    """Test API endpoints."""
    print("\n🌐 Testing API endpoints...")
    
    base_url = "http://localhost:8000/api/v1"
    
    try:
        # Test basic health check
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            print("✅ API is responding")
        else:
            print("❌ API health check failed")
            return
        
        # Test list locations
        response = requests.get(f"{base_url}/locations/list")
        if response.status_code == 200:
            locations = response.json()
            print(f"✅ Retrieved {len(locations)} locations from API")
            for loc in locations:
                print(f"  - {loc['address']}")
        else:
            print(f"❌ Failed to get locations: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API server")
    except Exception as e:
        print(f"❌ API test failed: {e}")

if __name__ == "__main__":
    test_database_direct()
    test_api_endpoints()
