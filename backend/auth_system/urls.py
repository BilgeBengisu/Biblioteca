from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.contrib import admin

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.social.urls')), # google auth
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
