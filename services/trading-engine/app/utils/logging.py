"""
Structured logging configuration
"""
import logging
import sys
import json
from datetime import datetime
from pythonjsonlogger import jsonlogger
import structlog
from typing import Any, Dict

from ..config import settings


class CustomJsonFormatter(jsonlogger.JsonFormatter):
    """
    Custom JSON formatter for structured logging
    """
    def add_fields(self, log_record, record, message_dict):
        super(CustomJsonFormatter, self).add_fields(log_record, record, message_dict)
        
        # Add timestamp
        log_record['timestamp'] = datetime.utcnow().isoformat()
        
        # Add service name
        log_record['service'] = 'trading-engine'
        
        # Add environment
        log_record['environment'] = settings.PYTHON_ENV
        
        # Add log level
        log_record['level'] = record.levelname
        
        # Add correlation ID if available
        if hasattr(record, 'correlation_id'):
            log_record['correlation_id'] = record.correlation_id


def setup_logging():
    """
    Configure structured logging for the application
    """
    # Configure structlog
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )
    
    # Get root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, settings.LOG_LEVEL))
    
    # Remove existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
    
    # Create console handler with JSON formatter
    console_handler = logging.StreamHandler(sys.stdout)
    
    if settings.LOG_FORMAT == "json":
        formatter = CustomJsonFormatter(
            '%(timestamp)s %(level)s %(name)s %(message)s'
        )
    else:
        # Fallback to simple format for development
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
    
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)
    
    # Suppress noisy loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    
    # Return structlog logger
    return structlog.get_logger()


class LoggerAdapter(logging.LoggerAdapter):
    """
    Custom logger adapter to add correlation ID to all logs
    """
    def process(self, msg, kwargs):
        if 'correlation_id' in self.extra:
            kwargs['extra'] = kwargs.get('extra', {})
            kwargs['extra']['correlation_id'] = self.extra['correlation_id']
        return msg, kwargs


def get_logger(name: str, correlation_id: str = None) -> logging.Logger:
    """
    Get a logger instance with optional correlation ID
    """
    logger = logging.getLogger(name)
    
    if correlation_id:
        return LoggerAdapter(logger, {'correlation_id': correlation_id})
    
    return logger


def log_error(logger: logging.Logger, error: Exception, context: Dict[str, Any] = None):
    """
    Log an error with context
    """
    error_dict = {
        'error_type': type(error).__name__,
        'error_message': str(error),
        'error_traceback': None
    }
    
    if context:
        error_dict.update(context)
    
    logger.error(
        f"Error occurred: {type(error).__name__}",
        extra=error_dict,
        exc_info=True
    )