from django.urls import path
from .views_auth import IdentifierTokenObtainView

urlpatterns = [
    path('login/', IdentifierTokenObtainView.as_view(), name='identifier_login'),
]
