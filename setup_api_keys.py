#!/usr/bin/env python3
"""
🔧 API Keys Setup Utility for LocationIQ Pro

This script automatically configures API keys from the central configuration file
and sets up the environment files for both backend and frontend.

Usage:
    python setup_api_keys.py
    python setup_api_keys.py --check
    python setup_api_keys.py --validate
"""

import os
import sys
import shutil
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import re


class APIKeysManager:
    """Manages API keys configuration for LocationIQ Pro"""
    
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.config_file = self.project_root / "api_keys_config.env"
        self.backend_env = self.project_root / "backend" / ".env"
        self.frontend_env = self.project_root / "frontend" / ".env.local"
        
        # Critical API keys needed for basic functionality
        self.critical_keys = [
            "GOOGLE_PLACES_API_KEY",
            "MAPBOX_API_KEY", 
            "OPENWEATHER_API_KEY"
        ]
        
        # Key mappings between central config and application configs
        self.backend_key_mappings = {
            "GOOGLE_PLACES_API_KEY": "GOOGLE_PLACES_API_KEY",
            "MAPBOX_API_KEY": "MAPBOX_ACCESS_TOKEN",
            "OPENWEATHER_API_KEY": "OPENWEATHER_API_KEY",
            "AIRVISUAL_API_KEY": "AIRVISUAL_API_KEY",
            "OPENAI_API_KEY": "OPENAI_API_KEY",
            "ANTHROPIC_API_KEY": "ANTHROPIC_API_KEY",
            "SENDGRID_API_KEY": "SENDGRID_API_KEY",
            "TWILIO_ACCOUNT_SID": "TWILIO_ACCOUNT_SID",
            "TWILIO_AUTH_TOKEN": "TWILIO_AUTH_TOKEN",
            "STRIPE_SECRET_KEY": "STRIPE_SECRET_KEY",
            "SENTRY_DSN": "SENTRY_DSN",
        }
        
        self.frontend_key_mappings = {
            "MAPBOX_API_KEY": "NEXT_PUBLIC_MAPBOX_TOKEN",
            "GOOGLE_ANALYTICS_ID": "NEXT_PUBLIC_GA_ID",
            "STRIPE_PUBLISHABLE_KEY": "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        }

    def load_config_file(self) -> Dict[str, str]:
        """Load API keys from the central configuration file"""
        if not self.config_file.exists():
            raise FileNotFoundError(
                f"❌ Central config file not found: {self.config_file}\n"
                f"Please ensure api_keys_config.env exists in the project root."
            )
        
        config = {}
        with open(self.config_file, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                
                # Skip comments and empty lines
                if not line or line.startswith('#'):
                    continue
                
                # Parse KEY=value format
                if '=' in line:
                    key, value = line.split('=', 1)
                    key = key.strip()
                    value = value.strip()
                    
                    # Skip placeholder values
                    if not value or value.startswith('your-') or value == 'placeholder':
                        continue
                        
                    config[key] = value
        
        return config

    def create_backend_env(self, api_keys: Dict[str, str]) -> bool:
        """Create backend .env file with API keys and other settings"""
        try:
            # Load template
            template_file = self.project_root / "backend" / ".env.example"
            if not template_file.exists():
                print(f"⚠️  Backend template not found: {template_file}")
                return False
            
            # Read template content
            with open(template_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace API key placeholders
            for central_key, backend_key in self.backend_key_mappings.items():
                if central_key in api_keys:
                    # Replace the placeholder line
                    pattern = f"{backend_key}=.*"
                    replacement = f"{backend_key}={api_keys[central_key]}"
                    content = re.sub(pattern, replacement, content)
            
            # Write backend .env file
            with open(self.backend_env, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✅ Created backend .env file: {self.backend_env}")
            return True
            
        except Exception as e:
            print(f"❌ Error creating backend .env: {e}")
            return False

    def create_frontend_env(self, api_keys: Dict[str, str]) -> bool:
        """Create frontend .env.local file with API keys"""
        try:
            content = [
                "# LocationIQ Pro - Frontend Environment Variables",
                "# Auto-generated from api_keys_config.env",
                "",
                "# API Configuration",
                "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000",
                "",
                "# App Configuration", 
                "NEXT_PUBLIC_APP_NAME=LocationIQ Pro",
                "NEXT_PUBLIC_APP_VERSION=1.0.0",
                ""
            ]
            
            # Add mapped API keys
            for central_key, frontend_key in self.frontend_key_mappings.items():
                if central_key in api_keys:
                    content.append(f"{frontend_key}={api_keys[central_key]}")
            
            # Write frontend .env.local file
            self.frontend_env.parent.mkdir(exist_ok=True)
            with open(self.frontend_env, 'w', encoding='utf-8') as f:
                f.write('\n'.join(content))
            
            print(f"✅ Created frontend .env.local file: {self.frontend_env}")
            return True
            
        except Exception as e:
            print(f"❌ Error creating frontend .env.local: {e}")
            return False

    def check_critical_keys(self, api_keys: Dict[str, str]) -> Tuple[List[str], List[str]]:
        """Check which critical keys are present/missing"""
        present = []
        missing = []
        
        for key in self.critical_keys:
            if key in api_keys:
                present.append(key)
            else:
                missing.append(key)
        
        return present, missing

    def validate_api_keys(self, api_keys: Dict[str, str]) -> Dict[str, bool]:
        """Validate API key formats (basic validation)"""
        validation_results = {}
        
        # Basic validation patterns
        patterns = {
            "GOOGLE_PLACES_API_KEY": r"^AIza[0-9A-Za-z_-]{35}$",
            "MAPBOX_API_KEY": r"^pk\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$",
            "OPENWEATHER_API_KEY": r"^[a-f0-9]{32}$",
            "OPENAI_API_KEY": r"^sk-[a-zA-Z0-9]{48}$",
        }
        
        for key, value in api_keys.items():
            if key in patterns:
                validation_results[key] = bool(re.match(patterns[key], value))
            else:
                validation_results[key] = True  # No pattern to validate against
        
        return validation_results

    def setup_api_keys(self) -> bool:
        """Main setup function"""
        print("🔧 LocationIQ Pro - API Keys Setup")
        print("=" * 50)
        
        try:
            # Load configuration
            print("📖 Loading API keys from central configuration...")
            api_keys = self.load_config_file()
            
            if not api_keys:
                print("⚠️  No valid API keys found in configuration file.")
                print("   Please edit api_keys_config.env and add your API keys.")
                return False
            
            print(f"📊 Found {len(api_keys)} configured API keys")
            
            # Check critical keys
            present, missing = self.check_critical_keys(api_keys)
            
            if missing:
                print(f"\n⚠️  Missing critical API keys: {', '.join(missing)}")
                print("   The application may not work properly without these keys.")
                print("   See api_keys_setup_guide.md for instructions.")
            
            if present:
                print(f"✅ Present critical API keys: {', '.join(present)}")
            
            # Create environment files
            print("\n🔧 Creating environment files...")
            backend_success = self.create_backend_env(api_keys)
            frontend_success = self.create_frontend_env(api_keys)
            
            if backend_success and frontend_success:
                print("\n✅ API keys setup completed successfully!")
                print("\n📝 Next steps:")
                print("   1. Start the backend: cd backend && python -m uvicorn app.main:app --reload")
                print("   2. Start the frontend: cd frontend && npm run dev")
                print("   3. Check application logs for any API key issues")
                return True
            else:
                print("\n❌ Setup completed with errors. Check the messages above.")
                return False
                
        except Exception as e:
            print(f"❌ Setup failed: {e}")
            return False

    def check_status(self) -> None:
        """Check current API keys status"""
        print("🔍 LocationIQ Pro - API Keys Status")
        print("=" * 50)
        
        try:
            api_keys = self.load_config_file()
            present, missing = self.check_critical_keys(api_keys)
            
            print(f"\n📊 Total configured keys: {len(api_keys)}")
            print(f"✅ Critical keys present: {len(present)}/{len(self.critical_keys)}")
            
            if present:
                print(f"\n✅ Present critical keys:")
                for key in present:
                    print(f"   - {key}")
            
            if missing:
                print(f"\n❌ Missing critical keys:")
                for key in missing:
                    print(f"   - {key}")
            
            # Check environment files
            print(f"\n📁 Environment files:")
            print(f"   Backend .env: {'✅ exists' if self.backend_env.exists() else '❌ missing'}")
            print(f"   Frontend .env.local: {'✅ exists' if self.frontend_env.exists() else '❌ missing'}")
            
        except FileNotFoundError:
            print("❌ Central configuration file not found.")
            print("   Please ensure api_keys_config.env exists in the project root.")
        except Exception as e:
            print(f"❌ Error checking status: {e}")

    def validate_keys(self) -> None:
        """Validate API key formats"""
        print("🔍 LocationIQ Pro - API Keys Validation")
        print("=" * 50)
        
        try:
            api_keys = self.load_config_file()
            validation_results = self.validate_api_keys(api_keys)
            
            valid_count = sum(validation_results.values())
            total_count = len(validation_results)
            
            print(f"\n📊 Validation results: {valid_count}/{total_count} keys valid")
            
            for key, is_valid in validation_results.items():
                status = "✅ valid" if is_valid else "❌ invalid format"
                print(f"   {key}: {status}")
            
            if valid_count < total_count:
                print(f"\n⚠️  Some API keys have invalid formats.")
                print("   Please check the api_keys_setup_guide.md for correct formats.")
            
        except Exception as e:
            print(f"❌ Validation failed: {e}")


def main():
    """Main CLI function"""
    parser = argparse.ArgumentParser(
        description="LocationIQ Pro API Keys Setup Utility",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python setup_api_keys.py              # Setup API keys
  python setup_api_keys.py --check      # Check status
  python setup_api_keys.py --validate   # Validate key formats
        """
    )
    
    parser.add_argument(
        "--check", 
        action="store_true",
        help="Check current API keys status"
    )
    
    parser.add_argument(
        "--validate",
        action="store_true", 
        help="Validate API key formats"
    )
    
    args = parser.parse_args()
    
    manager = APIKeysManager()
    
    if args.check:
        manager.check_status()
    elif args.validate:
        manager.validate_keys()
    else:
        success = manager.setup_api_keys()
        sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
