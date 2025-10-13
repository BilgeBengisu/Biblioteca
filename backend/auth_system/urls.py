from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
import os

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('api/auth/', include('accounts.urls')),
    path('auth/', include('djoser.social.urls')), # google auth
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]

# TODO : In development, serve static files (including frontend build assets) from the
# build/ directory so requests to /assets/... return the correct files instead
# of being caught by the SPA catch-all.
if settings.DEBUG:
    urlpatterns = static('/assets/', document_root=os.path.join(settings.BASE_DIR, 'build', 'assets')) + urlpatterns
    urlpatterns = static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + urlpatterns
