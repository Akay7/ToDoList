from django.conf import settings

from rest_framework import status
from rest_framework.response import Response

from rest_auth.views import LoginView
from rest_auth.app_settings import (
    TokenSerializer,  UserDetailsSerializer, JWTSerializer, create_token
)
from rest_auth.utils import jwt_encode


class LoginDetailUserView(LoginView):
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