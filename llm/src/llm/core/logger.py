import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

# Configure paths
LOG_DIR = Path(__file__).resolve().parent.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)
LOG_FILE = LOG_DIR / "app.log"

# Create logger
logger = logging.getLogger("BananaGuardLLM")
logger.setLevel(logging.DEBUG)

# Prevent duplicate handlers when reloaded by uvicorn
if not logger.handlers:
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(
        logging.Formatter(
            "[%(asctime)s] [%(levelname)s] %(name)s: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
    )
    logger.addHandler(console_handler)

    # Optional rotating file handler
    file_handler = RotatingFileHandler(
        LOG_FILE, maxBytes=5_000_000, backupCount=5
    )
    file_handler.setFormatter(
        logging.Formatter(
            "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
        )
    )
    logger.addHandler(file_handler)
