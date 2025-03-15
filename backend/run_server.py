#!/usr/bin/env python
"""
Run script for the Cover Letter Generator API server
"""

import os
import logging
from logging.handlers import RotatingFileHandler
import sys

def setup_logging():
    """Set up logging configuration"""
    # Create logs directory if it doesn't exist
    if not os.path.exists('logs'):
        os.makedirs('logs')
        
    # Configure logging
    log_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    log_file = 'logs/api_server.log'
    
    # Set up file handler with rotation
    file_handler = RotatingFileHandler(log_file, maxBytes=5*1024*1024, backupCount=3)
    file_handler.setFormatter(log_formatter)
    file_handler.setLevel(logging.INFO)
    
    # Set up console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(log_formatter)
    console_handler.setLevel(logging.INFO)
    
    # Get root logger and add handlers
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    root_logger.addHandler(file_handler)
    root_logger.addHandler(console_handler)
    
    return root_logger

def main():
    """Main function to run the server"""
    logger = setup_logging()
    
    try:
        logger.info("Starting Cover Letter Generator API server")
        
        # Check for required Python modules
        try:
            import flask
            import flask_cors
            import spacy
            import transformers
            logger.info("All required modules are installed")
        except ImportError as e:
            logger.error(f"Missing required module: {e}")
            logger.error("Please run: pip install -r requirements.txt")
            return 1
        
        # Check for spaCy models
        try:
            import spacy
            spacy.load("en_core_web_sm")
            logger.info("SpaCy model loaded successfully")
        except:
            logger.warning("SpaCy model not found. Attempting to download...")
            try:
                import subprocess
                subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
                logger.info("SpaCy model downloaded successfully")
            except Exception as e:
                logger.error(f"Failed to download spaCy model: {e}")
                logger.error("Please run: python -m spacy download en_core_web_sm")
        
        # Import app after checking requirements
        from app import app
        
        # Get port from environment or use default
        port = int(os.environ.get('PORT', 5000))
        
        # Check if debug mode is enabled
        debug = os.environ.get('DEBUG', 'False').lower() == 'true'
        
        # Start the server
        logger.info(f"Starting server on port {port} (debug={debug})")
        app.run(host='0.0.0.0', port=port, debug=debug)
        
        return 0
        
    except Exception as e:
        logger.exception(f"Unhandled exception: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 