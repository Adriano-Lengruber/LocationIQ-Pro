#!/usr/bin/env python3
"""
Database Initialization Script

This script creates all database tables and optionally populates them with sample data.
"""

import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.core.database import engine, Base, create_tables
from app.models import location, real_estate, environmental, security

def init_database():
    """Initialize the database with all tables."""
    print("🗄️ Creating database tables...")
    
    try:
        # Import all models to ensure they're registered with Base
        # Just import the modules to register the classes
        import app.models.location
        import app.models.real_estate
        import app.models.environmental
        import app.models.security
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        
        # Verify tables were created
        print("📋 Created tables:")
        for table_name in Base.metadata.tables.keys():
            print(f"  - {table_name}")
            
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

def drop_database():
    """Drop all database tables."""
    print("🗑️ Dropping all database tables...")
    
    try:
        Base.metadata.drop_all(bind=engine)
        print("✅ Database tables dropped successfully!")
    except Exception as e:
        print(f"❌ Error dropping database: {e}")
        return False
    
    return True

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "drop":
        drop_database()
    else:
        init_database()
