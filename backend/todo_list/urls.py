from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import TemplateView

from rest_framework.routers import DefaultRouter
from rest_auth.views import (
    LogoutView, UserDetailsView, PasswordChangeView,
    PasswordResetView, PasswordResetConfirmView
)
from rest_auth.registration.views import VerifyEmailView

from todo_item.views import (
    TodoItemViewSet, TodoListViewSet, WatchViewSet, FavoriteViewSet,
)
from user_profile.views import LoginUserDetailView, RegisterUserDetailView

router = DefaultRouter()
router.register('todo_item', TodoItemViewSet)
router.register('todo_list', TodoListViewSet)
router.register('watch', WatchViewSet)
router.register('favorite', FavoriteViewSet)

auth_patterns = [
    # URLs that do not require a session or valid token
    url(r'^password/reset/$', PasswordResetView.as_view(),
        name='rest_password_reset'),
    url(r'^password/reset/confirm/$', PasswordResetConfirmView.as_view(),
        name='rest_password_reset_confirm'),
    url(r'^login/$', LoginUserDetailView.as_view(), name='rest_login'),
    # URLs that require a user to be logged in with a valid session / token.
    url(r'^logout/$', LogoutView.as_view(), name='rest_logout'),
    url(r'^user/$', UserDetailsView.as_view(), name='rest_user_details'),
    url(r'^password/change/$', PasswordChangeView.as_view(),
        name='rest_password_change'),

    url(r'^registration/$', RegisterUserDetailView.as_view(), name='rest_register'),
    url(r'^registration/verify-email/$', VerifyEmailView.as_view(), name='rest_verify_email'),
]

urlpatterns = [
    url(r'^api/web/', include(router.urls, namespace="api_web")),
    url(r'^api/web/', include(auth_patterns, namespace="rest_auth")),

    url(r'^admin/', admin.site.urls),
    url(r'^api-auth/', include('rest_framework.urls', namespace='drf-auth')),
    url(r'^', TemplateView.as_view(template_name='index.html')),

    # this needed just for send confirm emails
    url(r'^', include('django.contrib.auth.urls')),
    url(r'^registration/account-confirm-email/(?P<key>[-:\w]+)/$',
        TemplateView.as_view(),
        name='account_confirm_email'),
]
