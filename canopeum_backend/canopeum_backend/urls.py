from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    # Auth
    path("auth/login/", views.LoginAPIView.as_view(), name="login"),
    path("auth/register/", views.RegisterAPIView.as_view(), name="register"),
    # Post
    path("social/posts/", views.PostListAPIView.as_view(), name="post-list"),
    path("social/posts/<int:postId>/", views.PostDetailAPIView.as_view(), name="post-detail"),
    # Comment
    path(
        "social/posts/<int:postId>/comments/",
        views.CommentListAPIView.as_view(),
        name="comment-list",
    ),
    path(
        "social/posts/<int:postId>/comments/<int:commentId>/",
        views.CommentDetailAPIView.as_view(),
        name="comment-detail",
    ),
    # Like
    path("social/posts/<int:postId>/likes/", views.LikeListAPIView.as_view(), name="like-list"),
    # Site
    path("social/sites/<int:siteId>/", views.SiteSocialDetailAPIView.as_view(), name="site-detail"),
    path(
        "social/sites/<int:siteId>/public-status",
        views.SiteSocialDetailPublicStatusAPIView.as_view(),
        name="site-detail",
    ),
    # Announcement
    path(
        "social/sites/<int:siteId>/announcements/",
        views.AnnouncementDetailAPIView.as_view(),
        name="announcement-detail",
    ),
    # Contact
    path(
        "social/contacts/<int:contactId>/",
        views.ContactDetailAPIView.as_view(),
        name="contact-detail",
    ),
    # Widget
    path(
        "social/sites/<int:siteId>/widgets/", views.WidgetListAPIView.as_view(), name="widget-list"
    ),
    path(
        "social/sites/<int:siteId>/widgets/<int:widgetId>/",
        views.WidgetDetailAPIView.as_view(),
        name="widget-detail",
    ),
    # Analytics
    path("analytics/tree-species", views.TreeSpeciesAPIView.as_view(), name="tree-species"),
    path("analytics/site-types", views.SiteTypesAPIView.as_view(), name="site-types"),
    path("analytics/fertilizers", views.FertilizerListAPIView.as_view(), name="fertilizer-list"),
    path("analytics/mulch-layers", views.MulchLayerListAPIView.as_view(), name="mulch-layer-list"),
    # Site
    path("analytics/sites/", views.SiteListAPIView.as_view(), name="site-list"),
    path("analytics/sites/<int:siteId>/", views.SiteDetailAPIView.as_view(), name="site-detail"),
    path(
        "analytics/sites/summary", views.SiteSummaryListAPIView.as_view(), name="site-summary-list"
    ),
    path(
        "analytics/sites/<int:siteId>/summary",
        views.SiteSummaryDetailAPIView.as_view(),
        name="site-summary-detail",
    ),
    path(
        "analytics/sites/<int:siteId>/admins",
        views.SiteDetailAdminsAPIView.as_view(),
        name="site-detail-admin-list",
    ),
    path(
        "analytics/sites/<int:siteId>/followers/",
        views.SiteFollowersAPIView.as_view(),
        name="site-followers-list",
    ),
    path(
        "analytics/sites/<int:siteId>/followers/current-user/",
        views.SiteFollowersCurrentUserAPIView.as_view(),
        name="site-followers-current-user",
    ),
    # Batches
    path("analytics/batches/", views.BatchListAPIView.as_view(), name="batch-list"),
    path(
        "analytics/batches/<int:batchId>/", views.BatchDetailAPIView.as_view(), name="batch-detail"
    ),
    # Map
    # Coordinate
    path("map/sites/", views.SiteMapListAPIView.as_view(), name="coordinate-list-sites"),
    # User
    path("users/", views.UserListAPIView.as_view(), name="user-list"),
    path(
        "users/forest-stewards",
        views.ForestStewardsListAPIView.as_view(),
        name="forest-stewards-list",
    ),
    path("users/<int:userId>/", views.UserDetailAPIView.as_view(), name="user-detail"),
    path("users/current_user/", views.UserCurrentUserAPIView.as_view(), name="current-user"),
    path(
        "user-invitations/", views.UserInvitationListAPIView.as_view(), name="user-invitation-list"
    ),
    path(
        "user-invitations/<str:code>",
        views.UserInvitationDetailAPIView.as_view(),
        name="user-invitation-list",
    ),
    # Site admins
    path(
        "site-admins/",
        views.SiteAdminsAPIView.as_view(),
        name="site_admin-list",
    ),
    # SWAGGER
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path("api/schema/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    # JWT
    path("auth/token/", TokenObtainPairView.as_view(), name="authentication_token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="authentication_token_refresh"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
