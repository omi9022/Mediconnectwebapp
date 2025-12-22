"""Startup script for MediConnect backend."""

import uvicorn
from decouple import config
from loguru import logger
import sys

# Configure logging
logger.remove()
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>",
    level="INFO"
)
logger.add(
    "logs/mediconnect_{time}.log",
    rotation="500 MB",
    retention="10 days",
    level="DEBUG"
)

def main():
    """Start the FastAPI server."""
    host = config('HOST', default='0.0.0.0')
    port = int(config('PORT', default=8000))
    debug = config('DEBUG', default='True') == 'True'
    
    logger.info("🏥 Starting MediConnect Backend Server...")
    logger.info(f"🌐 Host: {host}")
    logger.info(f"🔌 Port: {port}")
    logger.info(f"🐛 Debug Mode: {debug}")
    
    if debug:
        logger.warning("⚠️  Running in DEBUG mode - not for production!")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )

if __name__ == "__main__":
    main()
