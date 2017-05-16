from .base import *

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '6=%#d_!78l7wk9#@a(%s%4uht1llaad6&yfn5d&fyf4fx!xd+e'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = []  # FixMe: add allowed hosts

SITE_ID = 1


# Django channels
# https://channels.readthedocs.io/en/stable/

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "asgi_redis.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("localhost", 6379)],  # FixMe: check redis connection
        },
        "ROUTING": "todo_list.routing.channel_routing",
    },
}


SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
# SECURE_SSL_REDIRECT = True # Turned off because nGinx do that
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True