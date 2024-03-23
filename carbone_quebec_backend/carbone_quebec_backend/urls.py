from django.contrib import admin
from django.urls import path
from . import views
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),

    ### Auth
    path('auth/login/', views.LoginAPIView.as_view(), name='login'),
    path('auth/logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('auth/register/', views.RegisterAPIView.as_view(), name='register'),
    path('auth/current_user/', views.CurrentUserAPIView.as_view(), name='current-user'),
    
    ### Social

    # Post
    path('social/posts/', views.PostListAPIView.as_view(), name='post-list'),

    # Comment
    path('social/posts/<int:pk>/comments/', views.CommentListAPIView.as_view(), name='comment-list'),
    path('social/posts/<int:pk>/comments/<int:pk>/', views.CommentDetailAPIView.as_view(), name='comment-detail'),

    # Site
    path('social/sites/', views.SiteListAPIView.as_view(), name='site-list'),
    path('social/sites/<int:pk>/', views.SiteDetailAPIView.as_view(), name='site-detail'),

    # Announcement
    path('social/sites/<int:pk>/announcements/', views.AnnouncementListAPIView.as_view(), name='announcement-list'),
    path('social/sites/<int:pk>/announcements/<int:pk>/', views.AnnouncementDetailAPIView.as_view(), name='announcement-detail'),

    # Contact
    path('social/sites/<int:pk>/contacts/', views.ContactListAPIView.as_view(), name='contact-list'),
    path('social/sites/<int:pk>/contacts/<int:pk>/', views.ContactDetailAPIView.as_view(), name='contact-detail'),

    # Widget
    path('social/sites/<int:pk>/widgets/', views.WidgetListAPIView.as_view(), name='widget-list'),
    path('social/sites/<int:pk>/widgets/<int:pk>/', views.WidgetDetailAPIView.as_view(), name='widget-detail'),

    ### Analytics

    # Batch
    path('batches/', views.BatchListAPIView.as_view(), name='batch-list'),
    path('batches/<int:pk>/', views.BatchDetailAPIView.as_view(), name='batch-detail'),

    # Like
    path('likes/', views.LikeListAPIView.as_view(), name='like-list'),
    path('likes/<int:pk>/', views.LikeDetailAPIView.as_view(), name='like-detail'),


    # User
    path('users/', views.UserListAPIView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetailAPIView.as_view(), name='user-detail'),

    # SWAGGER
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
