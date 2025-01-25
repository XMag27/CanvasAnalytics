import os

class Config:
    DEBUG = False
    TESTING = False
    API_BASE_URL = os.getenv("API_BASE_URL", "https://localhost:7138")
    CANVAS_URL = os.getenv("CANVAS_URL", "http://canvas.docker")
    LTI_URL = os.getenv("LTI_URL", "https://valued-swan-apparently.ngrok-free.app")


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False
