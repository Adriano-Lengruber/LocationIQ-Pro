"""
Logging configuration for LocationIQ Pro
"""
import logging
import sys
from app.core.config import settings


def setup_logging():
    """Setup application logging"""
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL),
        format=settings.LOG_FORMAT,
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )


# Create application logger
logger = logging.getLogger("locationiq_pro")

# Setup logging on import
setup_logging()
