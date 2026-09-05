"""Structured logging for Cyber Engineering & DFIR Toolkit."""

import logging
import sys

def get_logger(name: str = "cyber", level: int = logging.INFO) -> logging.Logger:
    """Return a configured logger with clean formatting."""
    logger = logging.getLogger(name)
    if not logger.handlers:
        logger.setLevel(level)
        handler = logging.StreamHandler(sys.stderr)
        formatter = logging.Formatter(
            fmt="[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    return logger
