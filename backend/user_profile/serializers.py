from rest_framework import serializers
from rest_auth.registration.serializers import RegisterSerializer
from allauth.account import app_settings as allauth_settings


class RegistrationAllowEmptyEmailSerializer(RegisterSerializer):
    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED,
                                   allow_blank=not allauth_settings.EMAIL_REQUIRED)