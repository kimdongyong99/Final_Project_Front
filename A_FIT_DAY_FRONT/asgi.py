

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "A_FIT_DAY_FRONT.settings")

application = get_asgi_application()
