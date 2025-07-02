import json
import secrets
from copy import deepcopy
from typing import cast

from django.contrib.auth import authenticate
from django.core.paginator import Paginator
from django.db.models import Q
from django.http import QueryDict

# TODO: Figure out why setting CamelCaseMultiPartParser as a DEFAULT_PARSER_CLASSES
# breaks *some* Views' API generation (adds multiple body params)
# (then we won't need to import these as it'll simply be default)
from djangorestframework_camel_case.parser import (
    CamelCaseFormParser,
    CamelCaseJSONParser,
    CamelCaseMultiPartParser,
)
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from canopeum_backend.permissions import (
    CurrentUserPermission,
    DeleteCommentPermission,
    MegaAdminOrForestStewardPermission,
    MegaAdminPermission,
    MegaAdminPermissionReadOnly,
    PublicSiteReadPermission,
    SiteAdminPermission,
)

from .models import (
    Announcement,
    Batch,
    BatchAsset,
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
    AnnouncementSerializer,
    AssetSerializer,
    BatchDetailSerializer,
    BatchSponsorSerializer,
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
    SiteAdminsSerializer,
    SiteAdminUpdateRequestSerializer,
    SiteMapSerializer,
    SitePostSerializer,
    SiteSerializer,
    SiteSocialSerializer,
    SiteSummaryDetailSerializer,
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
    if isinstance(user, User) and user.role.name == RoleName.MegaAdmin:
        sites = Site.objects.all()
    elif isinstance(user, User) and user.role.name == RoleName.ForestSteward:
        admin_site_ids = [siteadmin.site.pk for siteadmin in Siteadmin.objects.filter(user=user)]
        sites = Site.objects.filter(Q(id__in=admin_site_ids) | Q(is_public=True))
    else:
        sites = Site.objects.filter(is_public=True)
    return sites


def get_admin_sites(user: User):
    if user.role.name == RoleName.MegaAdmin:
        return Site.objects.all()
    if user.role.name == RoleName.ForestSteward:
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

        user = cast(User | None, authenticate(email=email, password=password))
        if user is not None:
            refresh = RefreshToken.for_user(user)

            refresh_serializer = TokenRefreshSerializer({
                "refresh": refresh,
                "access": refresh.access_token,
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
        register_user_serializer = RegisterUserSerializer(data=request.data)

        if register_user_serializer.is_valid():
            user = register_user_serializer.create_user()
            if user is not None:
                refresh = RefreshToken.for_user(user)

                token_refresh_serializer = TokenRefreshSerializer({
                    "refresh": refresh,
                    "access": refresh.access_token,
                })
                user_serializer = UserSerializer(user)
                user_token_serializer = UserTokenSerializer(
                    data={"token": token_refresh_serializer.data, "user": user_serializer.data}
                )
                user_token_serializer.is_valid()
                return Response(user_token_serializer.data, status=status.HTTP_201_CREATED)
        return Response(register_user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TreeSpeciesAPIView(APIView):
    permission_classes = (MegaAdminOrForestStewardPermission,)

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
    permission_classes = (MegaAdminOrForestStewardPermission,)

    @extend_schema(
        responses=FertilizerTypeSerializer(many=True), operation_id="fertilizer_allTypes"
    )
    def get(self, request):
        fertilizer_types = Fertilizertype.objects.all()
        serializer = FertilizerTypeSerializer(fertilizer_types, many=True)
        return Response(serializer.data)


class MulchLayerListAPIView(APIView):
    permission_classes = (MegaAdminOrForestStewardPermission,)

    @extend_schema(
        responses=MulchLayerTypeSerializer(many=True), operation_id="mulchLayer_allTypes"
    )
    def get(self, request):
        mulch_layer_types = Mulchlayertype.objects.all()
        serializer = MulchLayerTypeSerializer(mulch_layer_types, many=True)
        return Response(serializer.data)


SITE_SCHEMA = {
    "multipart/form-data": {
        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "siteType": {"type": "number"},
            "image": {"type": "string", "format": "binary", "nullable": True},
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
}


class SiteListAPIView(APIView):
    permission_classes = (MegaAdminPermission,)
    parser_classes = (CamelCaseJSONParser, CamelCaseFormParser, CamelCaseMultiPartParser)

    @extend_schema(responses=SiteSerializer(many=True), operation_id="site_all")
    def get(self, request: Request):
        sites = get_public_sites_unless_admin(request.user)
        serializer = SiteSerializer(sites, many=True)
        return Response(serializer.data)

    @extend_schema(
        # TODO: Add serializer for multipart/form-data
        # request={"multipart/form-data": SiteSerializer}
        request=SITE_SCHEMA,
        responses={201: SiteSerializer},
        operation_id="site_create",
    )
    def post(self, request: Request):
        asset = AssetSerializer(data=request.data)
        if not asset.is_valid():
            return Response(data=asset.errors, status=status.HTTP_400_BAD_REQUEST)
        image = asset.save()

        site_type = Sitetype.objects.get(pk=request.data["site_type"])

        # TODO: Move call to from_dms_lat_long in the serializer
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
            )
            for tree_type_json in request.data.getlist("species"):
                tree_type_obj = json.loads(tree_type_json)
                tree_type = Treetype.objects.get(pk=tree_type_obj["id"])
                Sitetreespecies.objects.create(
                    site=site, tree_type=tree_type, quantity=tree_type_obj["quantity"]
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SiteDetailAPIView(APIView):
    permission_classes = (MegaAdminPermissionReadOnly, SiteAdminPermission)
    parser_classes = (CamelCaseJSONParser, CamelCaseFormParser, CamelCaseMultiPartParser)

    @extend_schema(request=SiteSerializer, responses=SiteSerializer, operation_id="site_detail")
    def get(self, request: Request, siteId):
        try:
            site = Site.objects.prefetch_related("image").get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = SiteSerializer(site)
        return Response(serializer.data)

    @extend_schema(
        # TODO: Add serializer for multipart/form-data
        # request={"multipart/form-data": SiteSerializer}
        request=SITE_SCHEMA,
        responses=SiteSerializer,
        operation_id="site_update",
    )
    def patch(self, request: Request, siteId):
        try:
            site = Site.objects.get(pk=siteId)
        except Site.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if request.data.get("image") is None:
            image = site.image
        else:
            asset = AssetSerializer(data=request.data)
            if not asset.is_valid():
                return Response(data=asset.errors, status=status.HTTP_400_BAD_REQUEST)
            image = asset.save()

        site_type = Sitetype.objects.get(pk=request.data["site_type"])

        # TODO: Move call to from_dms_lat_long in the serializer
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
            )

            Sitetreespecies.objects.filter(site=site).delete()

            for tree_type_json in request.data.getlist("species"):
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

        serializer = UpdateSitePublicStatusSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        site.is_public = serializer.validated_data["is_public"]
        site.save()

        return Response(serializer.data)


class SiteSummaryListAPIView(APIView):
    permission_classes = (MegaAdminOrForestStewardPermission,)

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

    @extend_schema(responses=SiteSummaryDetailSerializer, operation_id="site_summary")
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
        serializer = SiteSummaryDetailSerializer(
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
            if user not in existing_admin_users and user.role.name == RoleName.ForestSteward:
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


class SiteAdminsAPIView(APIView):
    permission_classes = (MegaAdminPermission,)

    @extend_schema(
        responses=SiteAdminsSerializer(many=True),
        operation_id="site-admins_all",
    )
    def get(self, request: Request):
        forest_stewards = User.objects.filter(role__name__iexact=RoleName.ForestSteward).order_by(
            "username"
        )
        serializer = SiteAdminsSerializer(forest_stewards, many=True)
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

        serializer = SiteSocialSerializer(site)
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
    parser_classes = (CamelCaseJSONParser, CamelCaseFormParser, CamelCaseMultiPartParser)

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
        site_ids = request.GET.getlist("site_id")
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
    def get(self, request: Request, postId):
        try:
            post = Post.objects.get(pk=postId)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = PostSerializer(post, context={"request": request})
        return Response(serializer.data)

    @extend_schema(operation_id="post_delete")
    def delete(self, request: Request, postId):
        if not request.user.is_staff:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        try:
            post = Post.objects.get(pk=postId)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
        announcement = Announcement.objects.get_or_create(site=siteId)[0]

        serializer = AnnouncementSerializer(announcement, data=request.data)
        if serializer.is_valid():
            serializer.save()
            Site.objects.filter(pk=siteId).update(announcement=announcement)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactDetailAPIView(APIView):
    @extend_schema(
        request=ContactSerializer, responses=ContactSerializer, operation_id="contact_update"
    )
    def patch(self, request: Request, contactId):
        try:
            contact = Contact.objects.get(pk=contactId)
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


# TODO: Add serializer for multipart/form-data
# request={"multipart/form-data": BatchDetailSerializer}
BATCH_CREATE_SCHEMA = {
    "multipart/form-data": {
        "type": "object",
        "properties": {
            "site": {"type": "number"},
            "name": {"type": "string", "nullable": True},
            "sponsorName": {"type": "string", "nullable": True},
            "sponsorWebsiteUrl": {"type": "string", "nullable": True},
            # TODO(NicolasDontigny): sponsorLogo should be in the sponsor object, but the generated
            # typescript api does not correctly type it as a FileParameter type
            # unless it is a root key
            # Raise the issue upstream, OR it should be fixed when we figure out how to serialize
            # multipart/form-data
            "sponsorLogo": {"type": "string", "format": "binary", "nullable": True},
            "size": {"type": "number", "nullable": True},
            "soilCondition": {"type": "string", "nullable": True},
            "survivedCount": {"type": "number", "nullable": True},
            "replaceCount": {"type": "number", "nullable": True},
            "totalPropagation": {"type": "number", "nullable": True},
            "images": {
                "type": "array",
                "items": {"type": "string", "format": "binary", "nullable": True},
            },
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
}


class BatchListAPIView(APIView):
    parser_classes = (CamelCaseJSONParser, CamelCaseFormParser, CamelCaseMultiPartParser)

    @extend_schema(responses=BatchDetailSerializer(many=True), operation_id="batch_all")
    def get(self, request: Request):
        batches = Batch.objects.all()
        serializer = BatchDetailSerializer(batches, many=True)
        return Response(serializer.data)

    @extend_schema(
        # TODO: Add serializer for multipart/form-data
        # request={"multipart/form-data": BatchDetailSerializer}
        request=BATCH_CREATE_SCHEMA,
        responses={201: BatchDetailSerializer},
        operation_id="batch_create",
    )
    def post(self, request: Request):
        errors = []

        try:
            parsed_fertilizer_ids = request.data.getlist("fertilizer_ids", [])
            parsed_mulch_layer_ids = request.data.getlist("mulch_layer_ids", [])
            parsed_seeds = [json.loads(seed) for seed in request.data.getlist("seeds", [])]
            parsed_species = [json.loads(specie) for specie in request.data.getlist("species", [])]
            parsed_supported_species_ids = request.data.getlist("supported_specie_ids", [])
        except json.JSONDecodeError as e:
            return Response(data={"error": e}, status=status.HTTP_400_BAD_REQUEST)

        # HACK to allow handling the image with a AssetSerializer separately
        # TODO: Figure out how to feed the image directly to BatchDetailSerializer
        uploaded_images = request.FILES.getlist("images", [])
        asset_instances = []
        for file in uploaded_images:
            asset_serializer = AssetSerializer(data={"asset": file})
            if not asset_serializer.is_valid():
                errors.append(asset_serializer.errors)
            else:
                asset_instances.append(asset_serializer.save())

        sponsor_data = {
            "name": request.data.get("sponsor_name"),
            "url": request.data.get("sponsor_website_url"),
            "logo": {
                "asset": request.data.get("sponsor_logo"),
            },
        }
        sponsor_serializer = BatchSponsorSerializer(data=sponsor_data)
        sponsor = None
        if not sponsor_serializer.is_valid():
            errors.append(sponsor_serializer.errors)
        else:
            sponsor = sponsor_serializer.save()

        batch_serializer = BatchDetailSerializer(data=request.data)
        if not batch_serializer.is_valid():
            errors.append(batch_serializer.errors)
        else:
            site = Site.objects.get(pk=request.data.get("site", ""))
            batch = batch_serializer.save(site=site, sponsor=sponsor)

            for asset in asset_instances:
                BatchAsset.objects.create(batch=batch, asset=asset)

            for fertilizer_id in parsed_fertilizer_ids:
                batch.add_fertilizer_by_id(fertilizer_id)
            for mulch_layer_id in parsed_mulch_layer_ids:
                batch.add_mulch_by_id(mulch_layer_id)
            for seed in parsed_seeds:
                batch.add_seed_by_id(seed["id"], seed.get("quantity", 0))
            for specie in parsed_species:
                batch.add_specie_by_id(specie["id"], specie.get("quantity", 0))
            for supported_specie_id in parsed_supported_species_ids:
                batch.add_supported_specie_by_id(supported_specie_id)

        if errors:
            return Response(data={"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response(batch_serializer.data, status=status.HTTP_201_CREATED)


BATCH_EDIT_SCHEMA = deepcopy(BATCH_CREATE_SCHEMA)
# type ignore: not gonna do a TypedDict for that, inline TypedDict are still experimental
del BATCH_EDIT_SCHEMA["multipart/form-data"]["properties"]["site"]  # type: ignore[attr-defined]


class BatchDetailAPIView(APIView):
    parser_classes = (CamelCaseJSONParser, CamelCaseFormParser, CamelCaseMultiPartParser)

    @extend_schema(
        # TODO: Add serializer for multipart/form-data
        # request={"multipart/form-data": BatchDetailSerializer}
        request=BATCH_EDIT_SCHEMA,
        responses=BatchDetailSerializer,
        operation_id="batch_update",
    )
    def patch(self, request: Request, batchId):
        try:
            batch = Batch.objects.get(pk=batchId)
        except Batch.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        errors = []

        parsed_data, parse_errors = self._parse_request_data(request)
        if parse_errors:
            return Response(data={"error": parse_errors}, status=status.HTTP_400_BAD_REQUEST)

        asset_instances, asset_errors = self._handle_assets(
            request.FILES.getlist("images", []), batch
        )
        errors.extend(asset_errors)

        sponsor, sponsor_errors = self._handle_sponsor(request, batch)
        errors.extend(sponsor_errors)

        batch_serializer = BatchDetailSerializer(batch, data=request.data, partial=True)
        if not batch_serializer.is_valid():
            errors.append(batch_serializer.errors)
        else:
            batch = batch_serializer.save(sponsor=sponsor)
            self._update_batch_mappings(batch, parsed_data, asset_instances)

        if errors:
            return Response(data={"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response(batch_serializer.data)

    def _parse_request_data(self, request):
        try:
            return {
                "fertilizer_ids": request.data.getlist("fertilizer_ids", []),
                "mulch_layer_ids": request.data.getlist("mulch_layer_ids", []),
                "seeds": [json.loads(seed) for seed in request.data.getlist("seeds", [])],
                "species": [json.loads(specie) for specie in request.data.getlist("species", [])],
                "supported_specie_ids": request.data.getlist("supported_specie_ids", []),
            }, None
        except json.JSONDecodeError as e:
            return None, str(e)

    def _handle_assets(self, uploaded_files, batch):
        asset_errors = []
        asset_instances = []

        existing_assets = list(BatchAsset.objects.filter(batch=batch).select_related("asset"))
        new_file_names = {file.name for file in uploaded_files}

        for ba in existing_assets:
            if ba.asset.asset.name not in new_file_names:
                ba.delete()

        for file in uploaded_files:
            matching_existing = next(
                (ba.asset for ba in existing_assets if ba.asset.asset.name == file.name), None
            )
            if matching_existing:
                asset_instances.append(matching_existing)
                continue

            asset_serializer = AssetSerializer(data={"asset": file})
            if not asset_serializer.is_valid():
                asset_errors.append(asset_serializer.errors)
            else:
                asset_instances.append(asset_serializer.save())

        return asset_instances, asset_errors

    def _handle_sponsor(self, request, batch):
        sponsor_data = {
            "name": request.data.get("sponsor_name"),
            "url": request.data.get("sponsor_website_url"),
        }
        if request.data.get("sponsor_logo") is not None:
            sponsor_data["logo"] = {"asset": request.data.get("sponsor_logo")}

        sponsor_serializer = BatchSponsorSerializer(batch.sponsor, data=sponsor_data, partial=True)
        if not sponsor_serializer.is_valid():
            return None, sponsor_serializer.errors
        return sponsor_serializer.save(), []

    def _update_batch_mappings(self, batch, parsed_data, asset_instances):
        for asset in asset_instances:
            BatchAsset.objects.create(batch=batch, asset=asset)

        # Less efficient, but so much easier to just remove all then recreate mappings.
        Batchfertilizer.objects.filter(batch=batch).delete()
        Batchmulchlayer.objects.filter(batch=batch).delete()
        BatchSeed.objects.filter(batch=batch).delete()
        BatchSpecies.objects.filter(batch=batch).delete()
        BatchSupportedSpecies.objects.filter(batch=batch).delete()

        for fertilizer_id in parsed_data["fertilizer_ids"]:
            batch.add_fertilizer_by_id(fertilizer_id)
        for mulch_layer_id in parsed_data["mulch_layer_ids"]:
            batch.add_mulch_by_id(mulch_layer_id)
        for seed in parsed_data["seeds"]:
            batch.add_seed_by_id(seed["id"], seed.get("quantity", 0))
        for specie in parsed_data["species"]:
            batch.add_specie_by_id(specie["id"], specie.get("quantity", 0))
        for supported_specie_id in parsed_data["supported_specie_ids"]:
            batch.add_supported_specie_by_id(supported_specie_id)

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


class ForestStewardsListAPIView(APIView):
    permission_classes = (MegaAdminPermission,)

    @extend_schema(responses=UserSerializer(many=True), operation_id="user_allForestStewards")
    def get(self, request: Request):
        users = User.objects.filter(role__name__iexact=RoleName.ForestSteward).order_by("username")
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

        change_password_request = request.data.get("change_password")
        if change_password_request is not None:
            change_password_serializer = ChangePasswordSerializer(data=change_password_request)
            change_password_serializer.is_valid()
            current_password = change_password_request["current_password"]

            if isinstance(current_password, str):
                is_valid = user.check_password(current_password)
                if is_valid is not True:
                    return Response("CURRENT_PASSWORD_INVALID", status=status.HTTP_400_BAD_REQUEST)
                new_password = change_password_request["new_password"]
                new_password_confirmation = current_password = change_password_request[
                    "new_password_confirmation"
                ]
                if new_password != new_password_confirmation:
                    return Response(
                        "NEW_PASSWORDS_DO_NOT_MATCH", status=status.HTTP_400_BAD_REQUEST
                    )
                user.set_password(new_password)

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
        site_ids = request.data.get("site_ids")
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
