from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import TemplateView

from rest_framework.routers import DefaultRouter

from todo_item.views import TodoItemViewSet, TodoListViewSet

router = DefaultRouter()
router.register('todo_item', TodoItemViewSet)
router.register('todo_list', TodoListViewSet)

urlpatterns = [
    url(r'^api/web/', include(router.urls, namespace="api_web")),

    url(r'^admin/', admin.site.urls),
    url(r'^', TemplateView.as_view(template_name='index.html')),
]
