import json
import secrets
from typing import cast

from django.contrib.auth import authenticate
from django.core.paginator import Paginator
from django.db.models import Q
from django.http import QueryDict
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from canopeum_backend.permissions import (
    CurrentUserPermission,
    DeleteCommentPermission,
    MegaAdminOrSiteManagerPermission,
    MegaAdminPermission,
    MegaAdminPermissionReadOnly,
    PublicSiteReadPermission,
    SiteAdminPermission,
)

from .models import (
    Announcement,
    Batch,
    Batchfertilizer,
    Batchmulchlayer,
    BatchSeed,
    BatchSpecies,
    BatchSupportedSpecies,
    Comment,
    Contact,
    Coordinate,
    Fertilizertype,
    Like,
    Mulchlayertype,
    Post,
    Request,
    RoleName,
    Site,
    Siteadmin,
    SiteFollower,
    Sitetreespecies,
    Sitetype,
    Treetype,
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
    ChangePasswordSerializer,
    CommentSerializer,
    ContactSerializer,
    CreateCommentSerializer,
    CreateUserInvitationSerializer,
    FertilizerTypeSerializer,
    LikeSerializer,
    LoginUserSerializer,
    MulchLayerTypeSerializer,
    PostPaginationSerializer,
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
    SiteTypeSerializer,
    TreeTypeSerializer,
    UpdateSitePublicStatusSerializer,
    UpdateUserSerializer,
    UserInvitationSerializer,
    UserSerializer,
    UserTokenSerializer,
    WidgetSerializer,
)


def get_public_sites_unless_admin(user: User | None):
    if isinstance(user, User) and user.role.name == "MegaAdmin":
        sites = Site.objects.all()
    elif isinstance(user, User) and user.role.name == "SiteManager":
        admin_site_ids = [siteadmin.site.pk for siteadmin in Siteadmin.objects.filter(user=user)]
        sites = Site.objects.filter(Q(id__in=admin_site_ids) | Q(is_public=True))
    else:
        sites = Site.objects.filter(is_public=True)
    return sites


def get_admin_sites(user: User):
    if user.role.name == "MegaAdmin":
        return Site.objects.all()
    if isinstance(user, User) and user.role.name == "SiteManager":
        admin_site_ids = [siteadmin.site.pk for siteadmin in Siteadmin.objects.filter(user=user)]
        return Site.objects.filter(Q(id__in=admin_site_ids))

    return None


class LoginAPIView(APIView):
    permission_classes = (AllowAny,)

    @extend_schema(
        request=LoginUserSerializer,
        responses=UserTokenSerializer,
        operation_id="authentication_login",
    )
    def post(self, request: Request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = cast(User, authenticate(email=email, password=password))
        if user is not None:
            refresh = cast(RefreshToken, RefreshToken.for_user(user))

            refresh_serializer = TokenRefreshSerializer({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            })
            user_serializer = UserSerializer(user)
            serializer = UserTokenSerializer(
                data={"token": refresh_serializer.data, "user": user_serializer.data}
            )
            serializer.is_valid()

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class RegisterAPIView(APIView):
    permission_classes = (AllowAny,)

    @extend_schema(
        request=RegisterUserSerializer,
        responses={201: UserTokenSerializer},
        operation_id="authentication_register",
    )
    def post(self, request: Request):
        # TODO(NicolasDontigny): Find out how to convert request body properties
        # from camel case to lower snake case
        request.data["password_confirmation"] = request.data.get("passwordConfirmation")
        register_user_serializer = RegisterUserSerializer(data=request.data)

        if register_user_serializer.is_valid():
            user = register_user_serializer.create_user()
            if user is not None:
                refresh = cast(RefreshToken, RefreshToken.for_user(user))

                token_refresh_serializer = TokenRefreshSerializer({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                })
                user_serializer = UserSerializer(user)
                user_token_serializer = UserTokenSerializer(
                    data={"token": token_refresh_serializer.data, "user": user_serializer.data}
                )
                user_token_serializer.is_valid()
                return Response(user_token_serializer.data, status=status.HTTP_201_CREATED)
        return Response(register_user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TreeSpeciesAPIView(APIView):
    permission_classes = (MegaAdminOrSiteManagerPermission,)

    @extend_schema(responses=TreeTypeSerializer(many=True), operation_id="tree_species")
    def get(self, request: Request):
        tree_species = Treetype.objects.all()
        serializer = TreeTypeSerializer(tree_species, many=True)
        return Response(serializer.data)


class SiteTypesAPIView(APIView):
    @extend_schema(responses=SiteTypeSerializer(many=True), operation_id="site_types")
    def get(self, request: Request):
        tree_species = Sitetype.objects.all()
        serializer = SiteTypeSerializer(tree_species, many=True)
        return Response(serializer.data)


class FertilizerListAPIView(APIView):
    permission_classes = (MegaAdminOrSiteManagerPermission,)

    @extend_schema(
        responses=FertilizerTypeSerializer(many=True), operation_id="fertilizer_allTypes"
    )
    def get(self, request):
        fertilizer_types = Fertilizertype.objects.all()
        serializer = FertilizerTypeSerializer(fertilizer_types, many=True)
        return Response(serializer.data)


class MulchLayerListAPIView(APIView):
    permission_classes = (MegaAdminOrSiteManagerPermission,)

    @extend_schema(
        responses=MulchLayerTypeSerializer(many=True), operation_id="mulchLayer_allTypes"
    )
    def get(self, request):
        mulch_layer_types = Mulchlayertype.objects.all()
        serializer = MulchLayerTypeSerializer(mulch_layer_types, many=True)
        return Response(serializer.data)


class SiteListAPIView(APIView):
    permission_classes = (MegaAdminPermission,)

    @extend_schema(responses=SiteSerializer(many=True), operation_id="site_all")
    def get(self, request: Request):
        sites = get_public_sites_unless_admin(request.user)
        serializer = SiteSerializer(sites, many=True)
        return Response(serializer.data)

    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(
        # TODO: Add serializer for multipart/form-data
        # request={"multipart/form-data": SiteSerializer}
        request={
            "multipart/form-data": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "siteType": {"type": "number"},
                    "image": {"type": "string", "format": "binary"},
                    "latitude": {"type": "string"},
                    "longitude": {"type": "string"},
                    "description": {"type": "string"},
                    "size": {"type": "number"},
                    "species": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "number"},
                                "quantity": {"type": "number"},
                            },
                        },
                    },
                    "researchPartnership": {"type": "boolean"},
                    "visibleMap": {"type": "boolean"},
                },
            },
        },
        responses={201: SiteSerializer},
        operation_id="site_create",
    )
    def post(self, request: Request):
        asset = AssetSerializer(data=request.data)
        if not asset.is_valid():
            return Response(data=asset.errors, status=status.HTTP_400_BAD_REQUEST)
        image = asset.save()

        site_type = Sitetype.objects.get(pk=request.data["siteType"])

        coordinate = Coordinate.from_dms_lat_long(
            request.data["latitude"], request.data["longitude"]
        )

        announcement = Announcement.objects.create()
        contact = Contact.objects.create()

        serializer = SitePostSerializer(data=request.data)
        if serializer.is_valid():
            site = serializer.save(
                image=image,
                site_type=site_type,
                coordinate=coordinate,
                announcement=announcement,
                contact=contact,
                visitor_count=0,
                research_partnership=json.loads(request.data["researchPartnership"]),
                visible_map=json.loads(request.data["visibleMap"]),
            )
            # TODO: Are we sure about getlist ?
            # If this is correct, consider raising an issue upstream
            for tree_type_json in request.data.getlist("species"):  # type:ignore[attr-defined] # pyright: ignore[reportAttributeAccessIssue]
                tree_type_obj = json.loads(tree_type_json)
                tree_type = Treetype.objects.get(pk=tree_type_obj["id"])
                Sitetreespecies.objects.create(
                    site=site, tree_type=tree_type, quantity=tree_type_obj["quantity"]
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SiteDetailAPIView(APIView):
    permission_classes = (MegaAdminPermissionReadOnly, SiteAdminPermission)

    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(request=SiteSerializer, responses=SiteSerializer, operation_id="site_detail")
    def get(self, request: Request, siteId):
        try:
            site = Site.objects.prefetch_related("image").get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = SiteSerializer(site)
        return Response(serializer.data)

    @extend_schema(
        request={
            "multipart/form-data": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "siteType": {"type": "number"},
                    "image": {"type": "string", "format": "binary"},
                    "latitude": {"type": "string"},
                    "longitude": {"type": "string"},
                    "description": {"type": "string"},
                    "size": {"type": "number"},
                    "species": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "number"},
                                "quantity": {"type": "number"},
                            },
                        },
                    },
                    "researchPartnership": {"type": "boolean"},
                    "visibleMap": {"type": "boolean"},
                },
            },
        },
        responses=SiteSerializer,
        operation_id="site_update",
    )
    def patch(self, request: Request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        asset = AssetSerializer(data=request.data)
        if not asset.is_valid():
            return Response(data=asset.errors, status=status.HTTP_400_BAD_REQUEST)
        image = asset.save()

        site_type = Sitetype.objects.get(pk=request.data["siteType"])

        coordinate = Coordinate.from_dms_lat_long(
            request.data["latitude"], request.data["longitude"]
        )

        announcement = Announcement.objects.create()
        contact = Contact.objects.create()

        serializer = SiteSerializer(site, data=request.data, partial=True)
        if serializer.is_valid():
            site = serializer.save(
                image=image,
                site_type=site_type,
                coordinate=coordinate,
                announcement=announcement,
                contact=contact,
                visitor_count=0,
                research_partnership=json.loads(request.data["researchPartnership"]),
                visible_map=json.loads(request.data["visibleMap"]),
            )

            # TODO: Are we sure about getlist ?
            # If this is correct, consider raising an issue upstream
            for tree_type_json in request.data.getlist("species"):  # type:ignore[attr-defined] # pyright: ignore[reportAttributeAccessIssue]
                tree_type_obj = json.loads(tree_type_json)
                tree_type = Treetype.objects.get(pk=tree_type_obj["id"])
                Sitetreespecies.objects.create(
                    site=site, tree_type=tree_type, quantity=tree_type_obj["quantity"]
                )
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(responses={status.HTTP_204_NO_CONTENT: None}, operation_id="site_delete")
    def delete(self, request: Request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        site.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SiteSocialDetailPublicStatusAPIView(APIView):
    permission_classes = (SiteAdminPermission,)

    @extend_schema(
        request=UpdateSitePublicStatusSerializer,
        responses=UpdateSitePublicStatusSerializer,
        operation_id="site_social_updatePublicStatus",
    )
    def patch(self, request: Request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, site)

        new_is_public_status = request.data["isPublic"]
        if new_is_public_status is not bool:
            Response("is_public data is invalid", status=status.HTTP_400_BAD_REQUEST)

        site.is_public = new_is_public_status
        site.save()

        serializer = UpdateSitePublicStatusSerializer(data={"is_public": site.is_public})
        serializer.is_valid()

        return Response(serializer.data)


class SiteSummaryListAPIView(APIView):
    permission_classes = (MegaAdminOrSiteManagerPermission,)

    @extend_schema(responses=SiteSummarySerializer(many=True), operation_id="site_summary_all")
    def get(self, request: Request):
        # TODO(NicolasDontigny): Only get
        sites = get_admin_sites(request.user)
        if sites is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer = SiteSummarySerializer(
            sites,
            many=True,
        )
        return Response(serializer.data)


class SiteSummaryDetailAPIView(APIView):
    permission_classes = (SiteAdminPermission,)

    @extend_schema(responses=SiteSummarySerializer, operation_id="site_summary")
    def get(self, request: Request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, site)

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
    def patch(self, request: Request, siteId):
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
                existing_site_admins.filter(user__id__exact=existing_user.pk).delete()

        serializer = SiteAdminSerializer(Siteadmin.objects.filter(site=site), many=True)
        return Response(serializer.data)


class SiteFollowersAPIView(APIView):
    @extend_schema(responses={201: None}, operation_id="site_follow")
    def post(self, request: Request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        site_follower, created = SiteFollower.objects.get_or_create(user=request.user, site=site)
        if created:
            site_follower.save()

            return Response(None, status=status.HTTP_201_CREATED)

        return Response(
            "Current user is already following this site", status=status.HTTP_400_BAD_REQUEST
        )

    @extend_schema(operation_id="site_unfollow")
    def delete(self, request: Request, siteId):
        try:
            site_follower = SiteFollower.objects.get(site_id__exact=siteId, user=request.user)
        except SiteFollower.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        site_follower.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SiteFollowersCurrentUserAPIView(APIView):
    @extend_schema(responses={200: bool}, operation_id="site_isFollowing")
    def get(self, request: Request, siteId):
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
    def get(self, request: Request):
        site_manager_users = User.objects.filter(role__name__iexact=RoleName.SITEMANAGER).order_by(
            "username"
        )
        serializer = AdminUserSitesSerializer(site_manager_users, many=True)
        return Response(serializer.data)


class SiteSocialDetailAPIView(APIView):
    permission_classes = (PublicSiteReadPermission,)

    @extend_schema(
        request=SiteSocialSerializer, responses=SiteSocialSerializer, operation_id="site_social"
    )
    def get(self, request: Request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, site)

        batches = Batch.objects.filter(site=siteId)
        sponsors = [batch.sponsor for batch in batches]

        serializer = SiteSocialSerializer(site, context={"sponsors": sponsors})
        return Response(serializer.data)


class SiteMapListAPIView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    @extend_schema(responses=SiteMapSerializer(many=True), operation_id="site_map")
    def get(self, request: Request):
        sites = get_public_sites_unless_admin(request.user)
        serializer = SiteMapSerializer(sites, many=True)
        return Response(serializer.data)


# Incompatible "request" in base types
class PostListAPIView(APIView, PageNumberPagination):  # type:ignore[misc] # pyright: ignore[reportIncompatibleVariableOverride]
    permission_classes = (IsAuthenticatedOrReadOnly,)

    @extend_schema(
        responses=PostPaginationSerializer,
        operation_id="post_all",
        parameters=[
            OpenApiParameter(
                name="siteId", type=OpenApiTypes.INT, many=True, location=OpenApiParameter.QUERY
            ),
            OpenApiParameter(
                name="page", type=OpenApiTypes.INT, required=True, location=OpenApiParameter.QUERY
            ),
            OpenApiParameter(
                name="size", type=OpenApiTypes.INT, required=True, location=OpenApiParameter.QUERY
            ),
        ],
    )
    def get(self, request: Request):
        site_ids = request.GET.getlist("siteId")
        posts = Post.objects.filter(site__in=site_ids) if site_ids else Post.objects.all()
        sorted_posts = posts.order_by("-created_at")

        page = request.GET.get("page")
        size = request.GET.get("size")

        if (
            not isinstance(page, str)
            or not page.isnumeric()
            or not isinstance(size, str)
            or not size.isnumeric()
        ):
            return Response(
                "Page and size are missing or invalid", status=status.HTTP_400_BAD_REQUEST
            )

        posts_paginator = Paginator(object_list=sorted_posts, per_page=int(size))
        page_posts = posts_paginator.page(int(page))

        self.page = page_posts
        self.page_size = int(size)

        serializer = PostSerializer(page_posts, many=True, context={"request": request})
        return self.get_paginated_response(serializer.data)

    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(
        # TODO: Add serializer for multipart/form-data
        # request={"multipart/form-data": PostPostSerializer}
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
    def post(self, request: Request):
        # TODO: Are we sure about getlist ?
        # If this is correct, consider raising an issue upstream
        assets = request.data.getlist("media")  # type:ignore[attr-defined] # pyright: ignore[reportAttributeAccessIssue]
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
    def get(self, request: Request, postId):
        try:
            post = Post.objects.get(pk=postId)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = PostSerializer(post, context={"request": request})
        return Response(serializer.data)


class CommentListAPIView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    @extend_schema(responses=CommentSerializer(many=True), operation_id="comment_all")
    def get(self, request: Request, postId):
        comments = Comment.objects.filter(post=postId).order_by("-created_at")
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @extend_schema(
        request=CreateCommentSerializer,
        responses={201: CommentSerializer},
        operation_id="comment_create",
    )
    def post(self, request: Request, postId):
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
    def delete(self, request: Request, postId, commentId):
        try:
            comment = Comment.objects.get(pk=commentId)
        except Comment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, comment)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AnnouncementDetailAPIView(APIView):
    @extend_schema(
        request=AnnouncementSerializer,
        responses=AnnouncementSerializer,
        operation_id="announcement_update",
    )
    def patch(self, request: Request, siteId):
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
    @extend_schema(
        request=ContactSerializer, responses=ContactSerializer, operation_id="contact_update"
    )
    def patch(self, request: Request, pk):
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
    @extend_schema(
        request=WidgetSerializer, responses={201: WidgetSerializer}, operation_id="widget_create"
    )
    def post(self, request: Request, siteId):
        serializer = WidgetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(site_id=siteId)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WidgetDetailAPIView(APIView):
    @extend_schema(
        request=WidgetSerializer, responses=WidgetSerializer, operation_id="widget_update"
    )
    def patch(self, request: Request, siteId, widgetId):
        try:
            widget = Widget.objects.get(pk=widgetId)
        except Widget.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = WidgetSerializer(widget, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(operation_id="widget_delete")
    def delete(self, request: Request, siteId, widgetId):
        try:
            widget = Widget.objects.get(pk=widgetId)
        except Widget.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        widget.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LikeListAPIView(APIView):
    @extend_schema(request="", responses={201: LikeSerializer}, operation_id="like_likePost")
    def post(self, request: Request, postId):
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
    def delete(self, request: Request, postId):
        try:
            post = Post.objects.get(pk=postId)
            like = Like.objects.get(post=post, user=request.user)
        except Like.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        like.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BatchListAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(responses=BatchAnalyticsSerializer(many=True), operation_id="batch_all")
    def get(self, request: Request):
        batches = Batch.objects.all()
        serializer = BatchSerializer(batches, many=True)
        return Response(serializer.data)

    @extend_schema(
        request={
            "multipart/form-data": {
                "type": "object",
                "properties": {
                    "site": {"type": "number"},
                    "name": {"type": "string", "nullable": True},
                    "sponsor": {"type": "string", "nullable": True},
                    "size": {"type": "number", "nullable": True},
                    "soilCondition": {"type": "string", "nullable": True},
                    "plantCount": {"type": "number", "nullable": True},
                    "survivedCount": {"type": "number", "nullable": True},
                    "replaceCount": {"type": "number", "nullable": True},
                    "totalNumberSeed": {"type": "number", "nullable": True},
                    "totalPropagation": {"type": "number", "nullable": True},
                    "image": {"type": "string", "format": "binary", "nullable": True},
                    "fertilizerIds": {"type": "array", "items": {"type": "number"}},
                    "mulchLayerIds": {"type": "array", "items": {"type": "number"}},
                    "seeds": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "number"},
                                "quantity": {"type": "number"},
                            },
                        },
                    },
                    "species": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "number"},
                                "quantity": {"type": "number"},
                            },
                        },
                    },
                    "supportedSpecieIds": {"type": "array", "items": {"type": "number"}},
                },
            },
        },
        responses={201: BatchSerializer},
        operation_id="batch_create",
    )
    def post(self, request: Request):
        errors = []

        try:
            parsed_fertilizer_ids = request.data.getlist("fertilizerIds", [])  # type:ignore[attr-defined] # pyright: ignore[reportAttributeAccessIssue]
            parsed_mulch_layer_ids = request.data.getlist("mulchLayerIds", [])  # type:ignore[attr-defined] # pyright: ignore[reportAttributeAccessIssue]
            parsed_seeds = [
                json.loads(seed)
                for seed in request.data.getlist("seeds", [])  # type:ignore[attr-defined] # pyright: ignore[reportAttributeAccessIssue]
            ]
            parsed_species = [
                json.loads(specie)
                for specie in request.data.getlist("species", [])  # type:ignore[attr-defined] # pyright: ignore[reportAttributeAccessIssue]
            ]
            parsed_supported_species_ids = request.data.getlist("supportedSpecieIds", [])  # type:ignore[attr-defined] # pyright: ignore[reportAttributeAccessIssue]
        except json.JSONDecodeError as e:
            return Response(data={"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        image = None
        if request.data.get("image"):
            asset_serializer = AssetSerializer(data=request.data)
            if not asset_serializer.is_valid():
                errors.append(asset_serializer.errors)
            else:
                image = asset_serializer.save()

        batch_data = {
            "site": request.data.get("site"),
            "name": request.data.get("name"),
            "sponsor": request.data.get("sponsor"),
            "size": request.data.get("size"),
            "soil_condition": request.data.get("soilCondition"),
            "plant_count": request.data.get("plantCount"),
            "survived_count": request.data.get("survivedCount"),
            "replace_count": request.data.get("replaceCount"),
            "total_number_seed": request.data.get("totalNumberSeed"),
            "total_propagation": request.data.get("totalPropagation"),
        }

        batch_serializer = BatchSerializer(data=batch_data)
        if not batch_serializer.is_valid():
            errors.append(batch_serializer.errors)
        else:
            site = Site.objects.get(pk=request.data.get("site", ""))
            batch_data["site"] = site
            batch = batch_serializer.save(**batch_data, image=image)

            # Batch fertilizer
            for fertilizer_id in parsed_fertilizer_ids:
                fertilizer_type = Fertilizertype.objects.get(pk=fertilizer_id)
                Batchfertilizer.objects.create(fertilizer_type=fertilizer_type, batch=batch)

            # Mulch layer
            for mulch_layer_id in parsed_mulch_layer_ids:
                mulch_layer_type = Mulchlayertype.objects.get(pk=mulch_layer_id)
                Batchmulchlayer.objects.create(mulch_layer_type=mulch_layer_type, batch=batch)

            # Seeds
            for seed in parsed_seeds:
                tree_type = Treetype.objects.get(pk=seed["id"])
                BatchSeed.objects.create(
                    tree_type=tree_type, quantity=seed.get("quantity", 0), batch=batch
                )

            # Species
            for specie in parsed_species:
                tree_type = Treetype.objects.get(pk=specie["id"])
                BatchSpecies.objects.create(
                    tree_type=tree_type, quantity=specie.get("quantity", 0), batch=batch
                )

            # Supported species
            for supported_specie_id in parsed_supported_species_ids:
                tree_type = Treetype.objects.get(pk=supported_specie_id)
                BatchSupportedSpecies.objects.create(tree_type=tree_type, batch=batch)

        if errors:
            return Response(data={"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response(batch_serializer.data, status=status.HTTP_201_CREATED)


class BatchDetailAPIView(APIView):
    @extend_schema(request=BatchSerializer, responses=BatchSerializer, operation_id="batch_update")
    def patch(self, request: Request, batchId):
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
    def delete(self, request: Request, batchId):
        try:
            batch = Batch.objects.get(pk=batchId)
        except Batch.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        batch.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserListAPIView(APIView):
    @extend_schema(responses=UserSerializer(many=True), operation_id="user_all")
    def get(self, request: Request):
        users = User.objects.all().order_by("username")
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class SiteManagersListAPIView(APIView):
    permission_classes = (MegaAdminPermission,)

    @extend_schema(responses=UserSerializer(many=True), operation_id="user_allSiteManagers")
    def get(self, request: Request):
        users = User.objects.filter(role__name__iexact=RoleName.SITEMANAGER).order_by("username")
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class UserDetailAPIView(APIView):
    permission_classes = (CurrentUserPermission,)

    @extend_schema(request=UserSerializer, responses=UserSerializer, operation_id="user_detail")
    def get(self, request: Request, userId):
        try:
            user = User.objects.get(pk=userId)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, user)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    @extend_schema(
        request=UpdateUserSerializer, responses=UserSerializer, operation_id="user_update"
    )
    def patch(self, request: Request, userId):
        try:
            user = User.objects.get(pk=userId)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        self.check_object_permissions(request, user)

        change_password_request = request.data.get("changePassword")
        if change_password_request is not None:
            change_password_serializer = ChangePasswordSerializer(data=change_password_request)
            change_password_serializer.is_valid()
            current_password = change_password_request["currentPassword"]

            if isinstance(current_password, str):
                is_valid = user.check_password(current_password)
                if is_valid is not True:
                    return Response("CURRENT_PASSWORD_INVALID", status=status.HTTP_400_BAD_REQUEST)
                new_password = change_password_request["newPassword"]
                new_password_confirmation = current_password = change_password_request[
                    "newPasswordConfirmation"
                ]
                if new_password != new_password_confirmation:
                    return Response(
                        "NEW_PASSWORDS_DO_NOT_MATCH", status=status.HTTP_400_BAD_REQUEST
                    )
                user.set_password(new_password)
                user.save()

        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserCurrentUserAPIView(APIView):
    @extend_schema(responses=UserSerializer, operation_id="user_current")
    def get(self, request: Request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserInvitationListAPIView(APIView):
    permission_classes = (MegaAdminPermission,)

    @extend_schema(
        request=CreateUserInvitationSerializer,
        responses=UserInvitationSerializer,
        operation_id="user-invitation_create",
    )
    def post(self, request: Request):
        site_ids = request.data.get("siteIds")
        if site_ids is None:
            return Response("SITE_IDS_INVALID", status=status.HTTP_400_BAD_REQUEST)
        email = request.data.get("email")
        if not email or User.objects.filter(email=email).exists():
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
    def get(self, request: Request, code: str):
        try:
            user_invitation = UserInvitation.objects.get(code=code)
        except UserInvitation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserInvitationSerializer(user_invitation)
        return Response(serializer.data)


class TokenRefreshAPIView(APIView):
    @extend_schema(responses=RefreshToken, operation_id="token_refresh")
    def post(self, request: Request):
        refresh = RefreshToken(request.data.get("refresh"))
        user = User.objects.get(pk=refresh["user_id"])
        refresh["role"] = user.role.name
        return Response(
            {"refresh": str(refresh), "access": str(refresh.access_token)},
            status=status.HTTP_200_OK,
        )


class TokenObtainPairAPIView(APIView):
    @extend_schema(responses=UserSerializer, operation_id="token_obtain_pair")
    def post(self, request: Request):
        user = cast(
            User,
            authenticate(
                username=request.data.get("username"), password=request.data.get("password")
            ),
        )
        if user is not None:
            refresh = cast(RefreshToken, RefreshToken.for_user(user))
            if user.role is not None:
                refresh["role"] = user.role.name
            return Response(
                {"refresh": str(refresh), "access": str(refresh.access_token)},
                status=status.HTTP_200_OK,
            )
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
