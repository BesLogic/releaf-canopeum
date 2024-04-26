import secrets
from typing import cast

from django.contrib.auth import authenticate
from django.core.paginator import Paginator
from django.http import QueryDict
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from canopeum_backend.permissions import (
    CurrentUserPermission,
    DeleteCommentPermission,
    MegaAdminPermission,
    MegaAdminPermissionReadOnly,
)

from .models import (
    Announcement,
    Batch,
    Comment,
    Contact,
    Like,
    Post,
    RoleName,
    Site,
    Siteadmin,
    SiteFollower,
    User,
    UserInvitation,
    Widget,
)
from .serializers import (
    AdminUserSitesSerializer,
    AnnouncementSerializer,
    AssetSerializer,
    BatchAnalyticsSerializer,
    BatchSerializer,
    CommentSerializer,
    ContactSerializer,
    CreateCommentSerializer,
    CreateUserInvitationSerializer,
    LikeSerializer,
    LoginUserSerializer,
    PostPostSerializer,
    PostSerializer,
    RegisterUserSerializer,
    SiteAdminSerializer,
    SiteAdminUpdateRequestSerializer,
    SiteMapSerializer,
    SitePostSerializer,
    SiteSerializer,
    SiteSocialSerializer,
    SiteSummarySerializer,
    UpdateUserSerializer,
    UserInvitationSerializer,
    UserSerializer,
    UserTokenSerializer,
    WidgetSerializer,
)


class LoginAPIView(APIView):
    permission_classes = (AllowAny,)

    @extend_schema(request=LoginUserSerializer, responses=UserTokenSerializer, operation_id="authentication_login")
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = cast(User, authenticate(email=email, password=password))
        if user is not None:
            refresh = cast(RefreshToken, RefreshToken.for_user(user))

            refresh_serializer = TokenRefreshSerializer({"refresh": str(refresh), "access": str(refresh.access_token)})
            user_serializer = UserSerializer(user)
            serializer = UserTokenSerializer(data={"token": refresh_serializer.data, "user": user_serializer.data})
            serializer.is_valid()

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class RegisterAPIView(APIView):
    permission_classes = (AllowAny,)

    @extend_schema(
        request=RegisterUserSerializer, responses={201: UserTokenSerializer}, operation_id="authentication_register"
    )
    def post(self, request):
        # TODO(NicolasDontigny): Find out how to convert request body properties from camel case to lower snake case
        request.data["password_confirmation"] = request.data.get("passwordConfirmation")
        serializer = RegisterUserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.create_user()
            if user is not None:
                refresh = cast(RefreshToken, RefreshToken.for_user(user))

                refresh_serializer = TokenRefreshSerializer({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                })
                user_serializer = UserSerializer(user)
                serializer = UserTokenSerializer(data={"token": refresh_serializer.data, "user": user_serializer.data})
                serializer.is_valid()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(APIView):
    @extend_schema(responses=status.HTTP_200_OK, operation_id="authentication_logout")
    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)


class SiteListAPIView(APIView):
    @extend_schema(responses=SiteSerializer(many=True), operation_id="site_all")
    def get(self, request):
        sites = Site.objects.all()
        serializer = SiteSerializer(sites, many=True)
        return Response(serializer.data)

    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(request=SiteSerializer, responses={201: SiteSerializer}, operation_id="site_create")
    def post(self, request):
        asset = AssetSerializer(data=request.data)
        if not asset.is_valid():
            return Response(data=asset.errors, status=status.HTTP_400_BAD_REQUEST)
        asset = asset.save()
        serializer = SitePostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(image=asset)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SiteDetailAPIView(APIView):
    permission_classes = (MegaAdminPermissionReadOnly,)

    @extend_schema(request=SiteSerializer, responses=SiteSerializer, operation_id="site_detail")
    def get(self, request, siteId):
        try:
            site = Site.objects.prefetch_related("image").get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = SiteSerializer(site)
        return Response(serializer.data)

    @extend_schema(request=SiteSerializer, responses=SiteSerializer, operation_id="site_update")
    def patch(self, request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = SiteSerializer(site, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(responses={status.HTTP_204_NO_CONTENT: None}, operation_id="site_delete")
    def delete(self, request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        site.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SiteSummaryListAPIView(APIView):
    @extend_schema(responses=SiteSummarySerializer(many=True), operation_id="site_summary_all")
    def get(self, request):
        sites = Site.objects.all()
        plant_count = 0
        survived_count = 0
        propagation_count = 0
        progress = 0
        serializer = SiteSummarySerializer(
            sites,
            many=True,
            context={
                "plant_count": plant_count,
                "survived_count": survived_count,
                "progress": progress,
                "propagation_count": propagation_count,
            },
        )
        return Response(serializer.data)


class SiteSummaryDetailAPIView(APIView):
    @extend_schema(responses=SiteSummarySerializer, operation_id="site_summary")
    def get(self, request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        plant_count = 0
        survived_count = 0
        propagation_count = 0
        progress = 0
        serializer = SiteSummarySerializer(
            site,
            context={
                "plant_count": plant_count,
                "survived_count": survived_count,
                "progress": progress,
                "propagation_count": propagation_count,
            },
        )
        return Response(serializer.data)


class SiteDetailAdminsAPIView(APIView):
    permission_classes = (MegaAdminPermission,)

    @extend_schema(
        request=SiteAdminUpdateRequestSerializer,
        responses=SiteAdminSerializer(many=True),
        operation_id="site_updateAdmins",
    )
    def patch(self, request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        existing_site_admins = Siteadmin.objects.filter(site=site)
        existing_admin_users = [admin.user for admin in existing_site_admins]

        admin_ids = request.data["ids"]
        updated_admin_users_list = User.objects.filter(id__in=admin_ids)

        for user in updated_admin_users_list:
            if user not in existing_admin_users and user.role.name == RoleName.SITEMANAGER:
                Siteadmin.objects.create(
                    user=user,
                    site=site,
                )

        for existing_user in existing_admin_users:
            if existing_user not in updated_admin_users_list:
                existing_site_admins.filter(user__id__exact=existing_user.pk).delete()  # type: ignore

        serializer = SiteAdminSerializer(Siteadmin.objects.filter(site=site), many=True)
        return Response(serializer.data)


class SiteFollowersAPIView(APIView):
    @extend_schema(responses={201: None}, operation_id="site_follow")
    def post(self, request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        site_follower, created = SiteFollower.objects.get_or_create(user=request.user, site=site)
        if created:
            site_follower.save()

            return Response(None, status=status.HTTP_201_CREATED)

        return Response("Current user is already following this site", status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(operation_id="site_unfollow")
    def delete(self, request, siteId):
        try:
            site_follower = SiteFollower.objects.get(site_id__exact=siteId, user=request.user)
        except SiteFollower.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        site_follower.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SiteFollowersCurrentUserAPIView(APIView):
    @extend_schema(responses={200: bool}, operation_id="site_isFollowing")
    def get(self, request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        site_followers = SiteFollower.objects.filter(site=site, user=request.user)
        is_following = site_followers.exists()
        return Response(is_following, status=status.HTTP_200_OK)


class AdminUserSitesAPIView(APIView):
    permission_classes = (MegaAdminPermission,)

    @extend_schema(
        responses=AdminUserSitesSerializer(many=True),
        operation_id="admin-user-sites_all",
    )
    def get(self, request):
        site_manager_users = User.objects.filter(role__name__iexact=RoleName.SITEMANAGER).order_by("username")
        serializer = AdminUserSitesSerializer(site_manager_users, many=True)
        return Response(serializer.data)


class SiteSocialDetailAPIView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    @extend_schema(request=SiteSocialSerializer, responses=SiteSocialSerializer, operation_id="site_social")
    def get(self, request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        batches = Batch.objects.filter(site=siteId)
        sponsors = [batch.sponsor for batch in batches]

        serializer = SiteSocialSerializer(site, context={"sponsors": sponsors})
        return Response(serializer.data)


class SiteSocialListAPIView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    @extend_schema(
        request=SiteSocialSerializer(many=True), responses=SiteSocialSerializer, operation_id="site_social_all"
    )
    def get(self, request):
        sites = Site.objects.all()
        serializer = SiteSocialSerializer(sites, many=True)
        return Response(serializer.data)


class SiteMapListAPIView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    @extend_schema(responses=SiteMapSerializer(many=True), operation_id="site_map")
    def get(self, request):
        sites = Site.objects.all()
        serializer = SiteMapSerializer(sites, many=True)
        return Response(serializer.data)


class PostListAPIView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    @extend_schema(
        responses=PostSerializer(many=True),
        operation_id="post_all",
        parameters=[
            OpenApiParameter(name="siteId", type=OpenApiTypes.INT, many=True, location=OpenApiParameter.QUERY),
            OpenApiParameter(name="page", type=OpenApiTypes.INT, required=False, location=OpenApiParameter.QUERY),
            OpenApiParameter(name="count", type=OpenApiTypes.INT, required=False, location=OpenApiParameter.QUERY),
        ],
    )
    def get(self, request):
        site_ids = request.GET.getlist("siteId")
        page = request.GET.get("page")
        count = request.GET.get("count")
        posts = Post.objects.filter(site__in=site_ids) if site_ids else Post.objects.all()
        sorted_posts = posts.order_by("-created_at")

        if isinstance(page, str) and page.isnumeric() and isinstance(count, str) and count.isnumeric():
            posts_paginator = Paginator(object_list=sorted_posts, per_page=int(count))
            page_posts = posts_paginator.page(int(page))
            serializer = PostSerializer(page_posts, many=True, context={"request": request})
            return Response(serializer.data)

        serializer = PostSerializer(sorted_posts, many=True, context={"request": request})
        return Response(serializer.data)

    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(
        # request={"multipart/form-data": PostPostSerializer}, TODO: Add serializer for multipart/form-data
        request={
            "multipart/form-data": {
                "type": "object",
                "properties": {
                    "site": {"type": "number"},
                    "body": {"type": "string"},
                    "media": {"type": "array", "items": {"type": "string", "format": "binary"}},
                },
            },
        },
        responses={201: PostSerializer},
        operation_id="post_create",
    )
    def post(self, request):
        assets = request.data.getlist("media")
        saved_assets = []
        for asset_item in assets:
            q = QueryDict("", mutable=True)
            q.update({"image": asset_item})
            asset = AssetSerializer(data=q)
            if not asset.is_valid():
                return Response(data=asset.errors, status=status.HTTP_400_BAD_REQUEST)
            asset.save()
            saved_assets.append(asset)
        serializer = PostPostSerializer(data=request.data)
        if serializer.is_valid():
            post = serializer.save()
            for asset_item in saved_assets:
                post.media.add(asset_item.instance)
            new_post = PostSerializer(post, context={"request": request})
            return Response(new_post.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDetailAPIView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    @extend_schema(responses=PostSerializer, operation_id="post_detail")
    def get(self, request, postId):
        try:
            post = Post.objects.get(pk=postId)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = PostSerializer(post, context={"request": request})
        return Response(serializer.data)


class CommentListAPIView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    @extend_schema(responses=CommentSerializer(many=True), operation_id="comment_all")
    def get(self, request, postId):
        comments = Comment.objects.filter(post=postId).order_by("-created_at")
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @extend_schema(request=CreateCommentSerializer, responses={201: CommentSerializer}, operation_id="comment_create")
    def post(self, request, postId):
        try:
            post = Post.objects.get(pk=postId)
            user = User.objects.get(pk=request.user.id)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = CommentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(post=post, user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentDetailAPIView(APIView):
    permission_classes = (DeleteCommentPermission,)

    @extend_schema(operation_id="comment_delete")
    def delete(self, request, postId, commentId):
        try:
            comment = Comment.objects.get(pk=commentId)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, comment)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AnnouncementDetailAPIView(APIView):
    @extend_schema(request=AnnouncementSerializer, responses=AnnouncementSerializer, operation_id="announcement_update")
    def patch(self, request, siteId):
        try:
            announcement = Announcement.objects.get(site=siteId)
        except Announcement.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = AnnouncementSerializer(announcement, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactDetailAPIView(APIView):
    @extend_schema(request=ContactSerializer, responses=ContactSerializer, operation_id="contact_update")
    def patch(self, request, pk):
        try:
            contact = Contact.objects.get(pk=pk)
        except Contact.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ContactSerializer(contact, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WidgetListAPIView(APIView):
    @extend_schema(request=WidgetSerializer, responses={201: WidgetSerializer}, operation_id="widget_create")
    def post(self, request):
        serializer = WidgetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WidgetDetailAPIView(APIView):
    @extend_schema(request=WidgetSerializer, responses=WidgetSerializer, operation_id="widget_update")
    def patch(self, request, pk):
        try:
            widget = Widget.objects.get(pk=pk)
        except Widget.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = WidgetSerializer(widget, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(operation_id="widget_delete")
    def delete(self, request, pk):
        try:
            widget = Widget.objects.get(pk=pk)
        except Widget.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        widget.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LikeListAPIView(APIView):
    @extend_schema(request="", responses={201: LikeSerializer}, operation_id="like_likePost")
    def post(self, request, postId):
        try:
            post = Post.objects.get(pk=postId)
            user = User.objects.get(pk=request.user.id)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = LikeSerializer(data={"post": post.pk, "user": user.pk})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(responses={201: LikeSerializer}, operation_id="like_delete")
    def delete(self, request, postId):
        try:
            post = Post.objects.get(pk=postId)
        except Post.DoesNotExist:
            return Response(status="sef")
        try:
            like = Like.objects.get(post=post, user=request.user)
        except Like.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        like.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BatchListAPIView(APIView):
    @extend_schema(responses=BatchAnalyticsSerializer(many=True), operation_id="batch_all")
    def get(self, request):
        batches = Batch.objects.all()
        serializer = BatchAnalyticsSerializer(batches, many=True)
        return Response(serializer.data)

    @extend_schema(request=BatchSerializer, responses={201: BatchSerializer}, operation_id="batch_create")
    def post(self, request):
        serializer = BatchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BatchDetailAPIView(APIView):
    @extend_schema(request=BatchSerializer, responses=BatchSerializer, operation_id="batch_update")
    def patch(self, request, batchId):
        try:
            batch = Batch.objects.get(pk=batchId)
        except Batch.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = BatchSerializer(batch, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(operation_id="batch_delete")
    def delete(self, request, batchId):
        try:
            batch = Batch.objects.get(pk=batchId)
        except Batch.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        batch.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserListAPIView(APIView):
    @extend_schema(responses=UserSerializer(many=True), operation_id="user_all")
    def get(self, request):
        users = User.objects.all().order_by("username")
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class SiteManagersListAPIView(APIView):
    permission_classes = (MegaAdminPermission,)

    @extend_schema(responses=UserSerializer(many=True), operation_id="user_allSiteManagers")
    def get(self, request):
        users = User.objects.filter(role__name__iexact=RoleName.SITEMANAGER).order_by("username")
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class UserDetailAPIView(APIView):
    permission_classes = (CurrentUserPermission,)

    @extend_schema(request=UserSerializer, responses=UserSerializer, operation_id="user_detail")
    def get(self, request, userId):
        try:
            user = User.objects.get(pk=userId)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, user)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    @extend_schema(request=UpdateUserSerializer, responses=UserSerializer, operation_id="user_update")
    def patch(self, request, userId):
        try:
            user = User.objects.get(pk=userId)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, user)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserCurrentUserAPIView(APIView):
    @extend_schema(responses=UserSerializer, operation_id="user_current")
    def post(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserInvitationListAPIView(APIView):
    permission_classes = (MegaAdminPermission,)

    @extend_schema(
        request=CreateUserInvitationSerializer,
        responses=UserInvitationSerializer,
        operation_id="user-invitation_create",
    )
    def post(self, request):
        site_ids = request.data.get("siteIds")
        if site_ids is None:
            return Response("SITE_IDS_INVALID", status=status.HTTP_400_BAD_REQUEST)
        email = request.data.get("email")
        if User.objects.filter(email=email).exists():
            return Response("EMAIL_TAKEN", status=status.HTTP_400_BAD_REQUEST)
        code = secrets.token_urlsafe(32)
        user_invitation = UserInvitation.objects.create(
            code=code,
            email=email,
        )
        sites_to_assign_to = Site.objects.filter(id__in=site_ids)
        user_invitation.assigned_to_sites.add(*sites_to_assign_to)
        user_invitation.save()
        serializer = UserInvitationSerializer(user_invitation)

        return Response(serializer.data)


class UserInvitationDetailAPIView(APIView):
    permission_classes = (AllowAny,)

    @extend_schema(
        responses=UserInvitationSerializer,
        operation_id="user-invitation_detail",
    )
    def get(self, request, code: str):
        try:
            user_invitation = UserInvitation.objects.get(code=code)
        except UserInvitation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserInvitationSerializer(user_invitation)
        return Response(serializer.data)


class TokenRefreshAPIView(APIView):
    @extend_schema(responses=RefreshToken, operation_id="token_refresh")
    def post(self, request):
        refresh = RefreshToken(request.data.get("refresh"))
        user = User.objects.get(pk=refresh["user_id"])
        refresh["role"] = user.role.name
        return Response({"refresh": str(refresh), "access": str(refresh.access_token)}, status=status.HTTP_200_OK)


class TokenObtainPairAPIView(APIView):
    @extend_schema(responses=UserSerializer, operation_id="token_obtain_pair")
    def post(self, request):
        user = cast(User, authenticate(username=request.data.get("username"), password=request.data.get("password")))
        if user is not None:
            refresh = cast(RefreshToken, RefreshToken.for_user(user))
            if user.role is not None:
                refresh["role"] = user.role.name
            return Response({"refresh": str(refresh), "access": str(refresh.access_token)}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
