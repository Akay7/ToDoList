from django.conf.urls import url, include
from django.contrib import admin

from rest_framework.routers import DefaultRouter

from todo_item.views import TodoItemViewSet

router = DefaultRouter()
router.register('todo_item', TodoItemViewSet)

urlpatterns = [
    url(r'^api/web/', include(router.urls, namespace="api_web")),

    url(r'^admin/', admin.site.urls),
]
