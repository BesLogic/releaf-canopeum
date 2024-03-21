from django.contrib import admin
from django.urls import path
from . import views
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth
    path('auth/login/', views.LoginAPIView.as_view(), name='login'),
    path('auth/logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('auth/register/', views.RegisterAPIView.as_view(), name='register'),
    
    # CRUD User
    path('users/', views.UserListAPIView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetailAPIView.as_view(), name='user-detail'),

    # Announcement
    path('announcements/', views.AnnouncementListAPIView.as_view(), name='announcement-list'),
    path('announcements/<int:pk>/', views.AnnouncementDetailAPIView.as_view(), name='announcement-detail'),

    # Site
    path('sites/', views.SiteListAPIView.as_view(), name='site-list'),
    path('sites/<int:pk>/', views.SiteDetailAPIView.as_view(), name='site-detail'),

    # Post
    path('posts/', views.PostListAPIView.as_view(), name='post-list'),
    path('posts/<int:pk>/', views.PostDetailAPIView.as_view(), name='post-detail'),

    # Batch
    path('batches/', views.BatchListAPIView.as_view(), name='batch-list'),
    path('batches/<int:pk>/', views.BatchDetailAPIView.as_view(), name='batch-detail'),

    # Like
    path('likes/', views.LikeListAPIView.as_view(), name='like-list'),
    path('likes/<int:pk>/', views.LikeDetailAPIView.as_view(), name='like-detail'),

    # Comment
    path('comments/', views.CommentListAPIView.as_view(), name='comment-list'),
    path('comments/<int:pk>/', views.CommentDetailAPIView.as_view(), name='comment-detail'),

    # SWAGGER
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
