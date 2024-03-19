from django.contrib import admin
from django.urls import path
from . import views
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('auth/register/', views.register, name='register'),
    
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

    # Like
    path('likes/', views.like_list, name='like-list'),
    path('likes/<int:pk>/', views.like_detail, name='like-detail'),

    # Comment
    path('comments/', views.comment_list, name='comment-list'),
    path('comments/<int:pk>/', views.comment_detail, name='comment-detail'),

    # SWAGGER
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
