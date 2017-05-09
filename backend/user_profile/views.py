from django.conf import settings
from django.utils.translation import ugettext_lazy as _

from rest_framework import status
from rest_framework.response import Response
from allauth.account import app_settings as allauth_settings
from allauth.account.utils import complete_signup
from rest_auth.views import LoginView
from rest_auth.registration.views import RegisterView
from rest_auth.app_settings import (
    TokenSerializer,  UserDetailsSerializer, JWTSerializer, create_token
)
from rest_auth.utils import jwt_encode


class LoginUserDetailView(LoginView):
    def get_response_serializer(self):
        if getattr(settings, 'REST_USE_JWT', False):
            response_serializer = JWTSerializer
        elif getattr(settings, 'REST_USE_TOKEN', True):
            response_serializer = TokenSerializer
        else:
            response_serializer = UserDetailsSerializer
        return response_serializer

    def login(self):
        self.user = self.serializer.validated_data['user']

        if getattr(settings, 'REST_USE_JWT', False):
            self.token = jwt_encode(self.user)
        elif getattr(settings, 'REST_USE_TOKEN', True):
            self.token = create_token(self.token_model, self.user,
                                      self.serializer)

        if getattr(settings, 'REST_SESSION_LOGIN', True):
            self.process_login()

    def get_response(self):
        serializer_class = self.get_response_serializer()

        if getattr(settings, 'REST_USE_JWT', False):
            data = {
                'user': self.user,
                'token': self.token
            }
            serializer = serializer_class(instance=data,
                                          context={'request': self.request})
        elif getattr(settings, 'REST_USE_TOKEN', True):
            serializer = serializer_class(instance=self.token,
                                          context={'request': self.request})
        else:
            serializer = serializer_class(instance=self.user,
                                          context={'request': self.request})

        return Response(serializer.data, status=status.HTTP_200_OK)


class RegisterUserDetailView(RegisterView):
    def get_response_data(self, user):
        if allauth_settings.EMAIL_VERIFICATION == \
                allauth_settings.EmailVerificationMethod.MANDATORY:
            return {"detail": _("Verification e-mail sent.")}

        if getattr(settings, 'REST_USE_JWT', False):
            data = {
                'user': user,
                'token': self.token
            }
            return JWTSerializer(data).data
        elif getattr(settings, 'REST_USE_TOKEN', True):
            return TokenSerializer(user.auth_token).data
        return UserDetailsSerializer(user).data

    def perform_create(self, serializer):
        user = serializer.save(self.request)
        if getattr(settings, 'REST_USE_JWT', False):
            self.token = jwt_encode(user)
        elif getattr(settings, 'REST_USE_TOKEN', True):
            create_token(self.token_model, user, serializer)

        complete_signup(self.request._request, user,
                        allauth_settings.EMAIL_VERIFICATION,
                        None)

        return user

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(self.get_response_data(user),
                        status=status.HTTP_201_CREATED,
                        headers=headers)