from typing import cast

from django.contrib.auth.models import AbstractBaseUser
from rest_framework_simplejwt.tokens import RefreshToken


def get_tokens_for_user(user: AbstractBaseUser):
    refresh = cast(RefreshToken, RefreshToken.for_user(user))

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }
