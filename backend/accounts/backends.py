from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class EmailOrUsernameModelBackend(ModelBackend):
    """
    Authenticate with either username or email (case-insensitive).
    Falls back to default ModelBackend behavior if not found.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        identifier = username or kwargs.get('identifier') or kwargs.get('email')
        if identifier is None or password is None:
            return None

        # Try username first (case-insensitive)
        try:
            user = UserModel.objects.get(username__iexact=identifier)
        except UserModel.DoesNotExist:
            # Try email
            try:
                user = UserModel.objects.get(email__iexact=identifier)
            except UserModel.DoesNotExist:
                return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None