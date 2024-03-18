from django.contrib import admin
from django.urls import path
from . import views
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),

    # CRUD User
    path('users/', views.user_list, name='user-list'),
    path('users/<int:pk>/', views.user_detail, name='user-detail'),

    # Announcement
    path('announcements/', views.announcement_list, name='announcement-list'),
    path('announcements/<int:pk>/', views.announcement_detail, name='announcement-detail'),

    # Site
    path('sites/', views.site_list, name='site-list'),
    path('sites/<int:pk>/', views.site_detail, name='site-detail'),

    # Post
    path('posts/', views.post_list, name='post-list'),
    path('posts/<int:pk>/', views.post_detail, name='post-detail'),

    # Batch
    path('batches/', views.batch_list, name='batch-list'),
    path('batches/<int:pk>/', views.batch_detail, name='batch-detail'),

    # SWAGGER
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
