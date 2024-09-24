# Pyright does not support duck-typed Meta inner-class
# pyright: reportIncompatibleVariableOverride=false

import random
from decimal import Decimal
from typing import Any

from django.contrib.auth.password_validation import validate_password
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from .models import (
    Announcement,
    Asset,
    Batch,
    Batchfertilizer,
    Batchmulchlayer,
    BatchSeed,
    BatchSpecies,
    BatchSponsor,
    BatchSupportedSpecies,
    Comment,
    Contact,
    Coordinate,
    Fertilizertype,
    Internationalization,
    Like,
    Mulchlayertype,
    Post,
    Role,
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
from .utils.weather_service import get_weather_data


class IntegerListFieldSerializer(serializers.ListField):
    child = serializers.IntegerField()


class LoginUserSerializer(serializers.ModelSerializer[User]):
    class Meta:
        model = User
        fields = ("email", "password")


# Note about Any: Generic is the type of "instance", not set here
class ChangePasswordSerializer(serializers.Serializer[Any]):
    current_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    new_password_confirmation = serializers.CharField(write_only=True, required=True)

    class Meta:
        fields = ("current_password", "new_password", "new_password_confirmation")


class UpdateUserSerializer(serializers.ModelSerializer[User]):
    change_password = ChangePasswordSerializer(required=False)

    class Meta:
        model = User
        fields = ("username", "email", "change_password")


class RegisterUserSerializer(serializers.ModelSerializer[User]):
    username = serializers.CharField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirmation = serializers.CharField(write_only=True, required=True)

    code = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ("username", "email", "password", "password_confirmation", "code")

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirmation"]:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create_user(self):
        if not isinstance(self.validated_data, dict):
            raise serializers.ValidationError("VALIDATED_DATA_INVALID") from None

        user_invitation: UserInvitation | None = None
        invitation_code = self.validated_data.get("code")

        if invitation_code is not None:
            try:
                user_invitation = UserInvitation.objects.get(code=invitation_code)
                if user_invitation.is_expired():
                    raise serializers.ValidationError("INVITATION_EXPIRED") from None

                role = Role.objects.get(name="SiteManager")
            except UserInvitation.DoesNotExist:
                raise serializers.ValidationError("INVITATION_CODE_INVALID") from None
        else:
            role = Role.objects.get(name="User")

        user = User.objects.create(
            username=self.validated_data["username"],
            email=self.validated_data["email"],
            role=role,
        )

        user.set_password(self.validated_data["password"])
        user.save()

        if user_invitation is not None:
            assigned_to_sites = user_invitation.assigned_to_sites.all()
            for site in assigned_to_sites:
                Siteadmin.objects.create(site=site, user=user)
            user_invitation.delete()

        return user


class UserSerializer(serializers.ModelSerializer[User]):
    role = serializers.SerializerMethodField()
    admin_site_ids = serializers.SerializerMethodField()
    followed_site_ids = serializers.SerializerMethodField()

    class Meta:
        model = User
        exclude = ("password",)

    def get_role(self, obj: User) -> RoleName:
        role_name = obj.role.name
        return RoleName.from_string(role_name)  # type: ignore[no-any-return] # mypy false-positive

    def get_admin_site_ids(self, obj: User) -> list[int]:
        return [siteadmin.site.pk for siteadmin in Siteadmin.objects.filter(user=obj)]

    def get_followed_site_ids(self, obj: User) -> list[int]:
        return [site_follower.site.pk for site_follower in SiteFollower.objects.filter(user=obj)]


# Note about Any: Generic is the type of "instance", not set here
class UserTokenSerializer(serializers.Serializer[Any]):
    token = TokenRefreshSerializer()
    user = UserSerializer()

    class Meta:
        fields = ("token", "user")


class CoordinatesSerializer(serializers.ModelSerializer[Coordinate]):
    class Meta:
        model = Coordinate
        fields = "__all__"


class WidgetSerializer(serializers.ModelSerializer[Widget]):
    class Meta:
        model = Widget
        fields = "__all__"


# Any: Accepts any model with "en" and "fr" fields. Unfortunately can't use protocols here
class InternationalizationSerializer(serializers.ModelSerializer[Any]):
    class Meta:
        model = Internationalization
        fields = ("en", "fr")


class SiteTypeSerializer(serializers.ModelSerializer[Sitetype]):
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()

    class Meta:
        model = Sitetype
        fields = ("id", "en", "fr")

    def get_en(self, obj):
        return InternationalizationSerializer(obj.name).data.get("en", None)

    def get_fr(self, obj):
        return InternationalizationSerializer(obj.name).data.get("fr", None)


class TreeTypeSerializer(serializers.ModelSerializer[Treetype]):
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()

    class Meta:
        model = Treetype
        fields = ("id", "en", "fr")

    def get_en(self, obj):
        return InternationalizationSerializer(obj.name).data.get("en", None)

    def get_fr(self, obj):
        return InternationalizationSerializer(obj.name).data.get("fr", None)


class FertilizerTypeSerializer(serializers.ModelSerializer[Fertilizertype]):
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()

    class Meta:
        model = Fertilizertype
        fields = ("id", "en", "fr")

    def get_en(self, obj: Fertilizertype):
        return InternationalizationSerializer(obj.name).data.get("en", None)

    def get_fr(self, obj: Fertilizertype):
        return InternationalizationSerializer(obj.name).data.get("fr", None)


class MulchLayerTypeSerializer(serializers.ModelSerializer[Mulchlayertype]):
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()

    class Meta:
        model = Mulchlayertype
        fields = ("id", "en", "fr")

    def get_en(self, obj: Mulchlayertype):
        return InternationalizationSerializer(obj.name).data.get("en", None)

    def get_fr(self, obj: Mulchlayertype):
        return InternationalizationSerializer(obj.name).data.get("fr", None)


class AnnouncementSerializer(serializers.ModelSerializer[Announcement]):
    class Meta:
        model = Announcement
        fields = "__all__"


class ContactSerializer(serializers.ModelSerializer[Contact]):
    class Meta:
        model = Contact
        fields = "__all__"


class SitetreespeciesSerializer(serializers.ModelSerializer[Sitetreespecies]):
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()

    class Meta:
        model = Sitetreespecies
        fields = ("id", "quantity", "en", "fr")

    def get_id(self, obj) -> int:
        return TreeTypeSerializer(obj.tree_type).data.get("id", None)  # type: ignore[no-any-return]

    def get_en(self, obj):
        return TreeTypeSerializer(obj.tree_type).data.get("en", None)

    def get_fr(self, obj):
        return TreeTypeSerializer(obj.tree_type).data.get("fr", None)


class AssetSerializer(serializers.ModelSerializer[Asset]):
    asset = serializers.FileField()

    class Meta:
        model = Asset
        fields = ("id", "asset")

    def to_internal_value(self, data):
        # Map 'image' field to 'asset' field in incoming data
        if "image" in data:
            data["asset"] = data["image"]
            del data["image"]
        return super().to_internal_value(data)


class SitePostSerializer(serializers.ModelSerializer[Site]):
    class Meta:
        model = Site
        fields = "__all__"


class SiteSerializer(serializers.ModelSerializer[Site]):
    site_type = SiteTypeSerializer()
    coordinate = CoordinatesSerializer()
    site_tree_species = serializers.SerializerMethodField()
    contact = ContactSerializer()
    announcement = AnnouncementSerializer()
    image = AssetSerializer()

    class Meta:
        model = Site
        fields = "__all__"

    @extend_schema_field(SitetreespeciesSerializer(many=True))
    def get_site_tree_species(self, obj):
        return SitetreespeciesSerializer(obj.sitetreespecies_set.all(), many=True).data


# Note about Any: Generic is the type of "instance", not set here
class UpdateSitePublicStatusSerializer(serializers.Serializer[Any]):
    is_public = serializers.BooleanField(required=True)

    class Meta:
        fields = ("is_public",)


class SiteNameSerializer(serializers.ModelSerializer[Site]):
    class Meta:
        model = Site
        fields = ("id", "name")


class AdminUserSitesSerializer(serializers.ModelSerializer[User]):
    sites = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "username", "email", "sites")

    @extend_schema_field(SiteNameSerializer(many=True))
    def get_sites(self, obj):
        sites_list = [siteadmin.site for siteadmin in obj.siteadmin_set.all()]
        return SiteNameSerializer(sites_list, many=True).data


class BatchSponsorSerializer(serializers.ModelSerializer[BatchSponsor]):
    logo = AssetSerializer()

    class Meta:
        model = BatchSponsor
        fields = "__all__"


class SiteSocialSerializer(serializers.ModelSerializer[Site]):
    site_type = SiteTypeSerializer()
    contact = ContactSerializer()
    announcement = AnnouncementSerializer()
    widget = serializers.SerializerMethodField()
    sponsors = serializers.SerializerMethodField()
    image = AssetSerializer()

    class Meta:
        model = Site
        fields = (
            "id",
            "name",
            "is_public",
            "site_type",
            "image",
            "description",
            "contact",
            "announcement",
            "sponsors",
            "widget",
        )

    @extend_schema_field(BatchSponsorSerializer(many=True))
    def get_sponsors(self, obj: Site):
        batches = Batch.objects.filter(site=obj)

        sponsors = [batch.sponsor for batch in batches if batch.sponsor is not None]
        return BatchSponsorSerializer(sponsors, many=True).data

    @extend_schema_field(WidgetSerializer(many=True))
    def get_widget(self, obj):
        return WidgetSerializer(obj.widget_set.all(), many=True).data


class BatchfertilizerSerializer(serializers.ModelSerializer[Batchfertilizer]):
    id = serializers.SerializerMethodField()
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()

    class Meta:
        model = Batchfertilizer
        fields = ("id", "en", "fr")

    def get_id(self, obj: Batchfertilizer):
        return FertilizerTypeSerializer(obj.fertilizer_type).data.get("id", None)

    def get_en(self, obj: Batchfertilizer):
        return (
            InternationalizationSerializer(obj.fertilizer_type.name).data.get("en", None)
            if obj.fertilizer_type
            else None
        )

    def get_fr(self, obj: Batchfertilizer):
        return (
            InternationalizationSerializer(obj.fertilizer_type.name).data.get("fr", None)
            if obj.fertilizer_type
            else None
        )


class BatchMulchLayerSerializer(serializers.ModelSerializer[Batchmulchlayer]):
    id = serializers.SerializerMethodField()
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()

    class Meta:
        model = Mulchlayertype
        fields = ("id", "en", "fr")

    def get_id(self, obj: Batchmulchlayer):
        return MulchLayerTypeSerializer(obj.mulch_layer_type).data.get("id", None)

    def get_en(self, obj: Batchmulchlayer):
        return (
            InternationalizationSerializer(obj.mulch_layer_type.name).data.get("en", None)
            if obj.mulch_layer_type
            else None
        )

    def get_fr(self, obj: Batchmulchlayer):
        return (
            InternationalizationSerializer(obj.mulch_layer_type.name).data.get("fr", None)
            if obj.mulch_layer_type
            else None
        )


class BatchSupportedSpeciesSerializer(serializers.ModelSerializer[BatchSupportedSpecies]):
    id = serializers.SerializerMethodField()
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()

    class Meta:
        model = BatchSupportedSpecies
        fields = ("id", "en", "fr")

    def get_id(self, obj: BatchSupportedSpecies):
        return TreeTypeSerializer(obj.tree_type).data.get("id", None)

    def get_en(self, obj: BatchSupportedSpecies):
        return (
            InternationalizationSerializer(obj.tree_type.name).data.get("en", None)
            if obj.tree_type
            else None
        )

    def get_fr(self, obj: BatchSupportedSpecies):
        return (
            InternationalizationSerializer(obj.tree_type.name).data.get("fr", None)
            if obj.tree_type
            else None
        )


class BatchSeedSerializer(serializers.ModelSerializer[BatchSeed]):
    id = serializers.SerializerMethodField()
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()

    class Meta:
        model = BatchSeed
        fields = ("id", "quantity", "en", "fr")

    def get_id(self, obj: BatchSeed) -> int | None:
        return TreeTypeSerializer(obj.tree_type).data.get("id", None)

    def get_en(self, obj: BatchSeed):
        return (
            InternationalizationSerializer(obj.tree_type.name).data.get("en", None)
            if obj.tree_type
            else None
        )

    def get_fr(self, obj: BatchSeed):
        return (
            InternationalizationSerializer(obj.tree_type.name).data.get("fr", None)
            if obj.tree_type
            else None
        )


class BatchSpeciesSerializer(serializers.ModelSerializer[BatchSpecies]):
    id = serializers.SerializerMethodField()
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()

    class Meta:
        model = BatchSpecies
        fields = ("id", "quantity", "en", "fr")

    def get_id(self, obj: BatchSpecies) -> int | None:
        return TreeTypeSerializer(obj.tree_type).data.get("id", None)

    def get_en(self, obj: BatchSpecies):
        return (
            InternationalizationSerializer(obj.tree_type.name).data.get("en", None)
            if obj.tree_type
            else None
        )

    def get_fr(self, obj: BatchSpecies):
        return (
            InternationalizationSerializer(obj.tree_type.name).data.get("fr", None)
            if obj.tree_type
            else None
        )


class BatchDetailSerializer(serializers.ModelSerializer[Batch]):
    fertilizers = serializers.SerializerMethodField()
    mulch_layers = serializers.SerializerMethodField()
    supported_species = serializers.SerializerMethodField()
    seeds = serializers.SerializerMethodField()
    species = serializers.SerializerMethodField()
    sponsor = serializers.SerializerMethodField()
    # HACK to allow handling the image with a AssetSerializer separately
    # TODO: Figure out how to feed the image directly to BatchDetailSerializer
    image = AssetSerializer(required=False)

    class Meta:
        model = Batch
        fields = "__all__"

    @extend_schema_field(BatchfertilizerSerializer(many=True))
    def get_fertilizers(self, obj):
        return BatchfertilizerSerializer(obj.batchfertilizer_set.all(), many=True).data

    @extend_schema_field(BatchMulchLayerSerializer(many=True))
    def get_mulch_layers(self, obj):
        return BatchMulchLayerSerializer(obj.batchmulchlayer_set.all(), many=True).data

    @extend_schema_field(BatchSupportedSpeciesSerializer(many=True))
    def get_supported_species(self, obj):
        return BatchSupportedSpeciesSerializer(obj.batchsupportedspecies_set.all(), many=True).data

    @extend_schema_field(BatchSeedSerializer(many=True))
    def get_seeds(self, obj):
        return BatchSeedSerializer(obj.batchseed_set.all(), many=True).data

    @extend_schema_field(BatchSpeciesSerializer(many=True))
    def get_species(self, obj):
        return BatchSpeciesSerializer(obj.batchspecies_set.all(), many=True).data

    @extend_schema_field(BatchSponsorSerializer(many=False))
    def get_sponsor(self, obj: Batch):
        return BatchSponsorSerializer(obj.sponsor, many=False).data


class SiteAdminSerializer(serializers.ModelSerializer[Siteadmin]):
    user = UserSerializer()

    class Meta:
        model = Siteadmin
        fields = ("user",)


# Note about Any: Generic is the type of "instance", not set here
class CreateUserInvitationSerializer(serializers.Serializer[Any]):
    site_ids = IntegerListFieldSerializer()
    email = serializers.EmailField()

    class Meta:
        fields = ("site_ids", "email")


class UserInvitationSerializer(serializers.ModelSerializer[UserInvitation]):
    expires_at = serializers.DateTimeField()

    class Meta:
        model = UserInvitation
        fields = ("id", "code", "email", "expires_at")


class SiteFollowerSerializer(serializers.ModelSerializer[SiteFollower]):
    user = UserSerializer()
    site = SiteSerializer()

    class Meta:
        model = SiteFollower
        fields = ("user", "site")


class WeatherSerializer(serializers.Serializer[Any]):
    temperature = serializers.DecimalField(max_digits=4, decimal_places=1)
    humidity = serializers.DecimalField(max_digits=4, decimal_places=1)
    description = serializers.CharField()

    class Meta:
        fields = ("temperature", "humidity", "description")


# Note about Any: Generic is the type of "instance", not set here
class SiteAdminUpdateRequestSerializer(serializers.Serializer[Any]):
    ids = IntegerListFieldSerializer()

    class Meta:
        fields = ("ids",)


class SiteSummarySerializer(serializers.ModelSerializer[Site]):
    site_type = SiteTypeSerializer()
    coordinate = CoordinatesSerializer()
    plant_count = serializers.SerializerMethodField()
    survived_count = serializers.SerializerMethodField()
    propagation_count = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    sponsors = serializers.SerializerMethodField()
    admins = SiteAdminSerializer(source="siteadmin_set", many=True)
    batches = serializers.SerializerMethodField()

    class Meta:
        model = Site
        fields = (
            "id",
            "name",
            "coordinate",
            "site_type",
            "plant_count",
            "survived_count",
            "propagation_count",
            "visitor_count",
            "sponsors",
            "progress",
            "admins",
            "batches",
        )

    def get_plant_count(self, obj) -> int:
        return random.randint(100, 200)  # noqa: S311

    def get_survived_count(self, obj) -> int:
        return random.randint(50, 100)  # noqa: S311

    def get_propagation_count(self, obj) -> int:
        return random.randint(5, 50)  # noqa: S311

    def get_progress(self, obj) -> float:
        return random.randint(0, 10000) / 100  # noqa: S311

    def get_sponsors(self, obj) -> list[str]:
        batches = Batch.objects.filter(site=obj)
        # TODO(NicolasDontigny): include logo and url here
        return [batch.sponsor.name for batch in batches if batch.sponsor is not None]

    @extend_schema_field(BatchDetailSerializer(many=True))
    def get_batches(self, obj):
        batches = obj.batch_set.all().order_by("-updated_at")
        return BatchDetailSerializer(batches, many=True).data


class SiteSummaryDetailSerializer(serializers.ModelSerializer[Site]):
    site_type = SiteTypeSerializer()
    coordinate = CoordinatesSerializer()
    plant_count = serializers.SerializerMethodField()
    survived_count = serializers.SerializerMethodField()
    propagation_count = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    sponsors = serializers.SerializerMethodField()
    admins = SiteAdminSerializer(source="siteadmin_set", many=True)
    batches = serializers.SerializerMethodField()
    weather = serializers.SerializerMethodField()

    class Meta:
        model = Site
        fields = (
            "id",
            "name",
            "coordinate",
            "site_type",
            "plant_count",
            "survived_count",
            "propagation_count",
            "visitor_count",
            "sponsors",
            "progress",
            "admins",
            "batches",
            "weather",
        )

    def get_plant_count(self, obj) -> int:
        return random.randint(100, 200)  # noqa: S311

    def get_survived_count(self, obj) -> int:
        return random.randint(50, 100)  # noqa: S311

    def get_propagation_count(self, obj) -> int:
        return random.randint(5, 50)  # noqa: S311

    def get_progress(self, obj) -> float:
        return random.randint(0, 10000) / 100  # noqa: S311

    def get_sponsors(self, obj) -> list[str]:
        batches = Batch.objects.filter(site=obj)
        # TODO(NicolasDontigny): Use sponsor logos + urls here?
        return [batch.sponsor.name for batch in batches if batch.sponsor]

    @extend_schema_field(WeatherSerializer)
    def get_weather(self, obj):
        weather = get_weather_data(obj.coordinate.dd_latitude, obj.coordinate.dd_longitude)
        return WeatherSerializer(weather).data

    @extend_schema_field(BatchDetailSerializer(many=True))
    def get_batches(self, obj):
        batches = obj.batch_set.all().order_by("-updated_at")
        return BatchDetailSerializer(batches, many=True).data


class CoordinatesMapSerializer(serializers.ModelSerializer[Coordinate]):
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

    class Meta:
        model = Coordinate
        fields = ("latitude", "longitude", "address")

    def get_latitude(self, obj: Coordinate) -> Decimal | None:
        return obj.dd_latitude

    def get_longitude(self, obj: Coordinate) -> Decimal | None:
        return obj.dd_longitude


class SiteMapSerializer(serializers.ModelSerializer[Site]):
    site_type = SiteTypeSerializer()
    coordinates = serializers.SerializerMethodField()
    image = AssetSerializer()

    class Meta:
        model = Site
        fields = ("id", "name", "site_type", "coordinates", "image")

    @extend_schema_field(CoordinatesMapSerializer)
    def get_coordinates(self, obj):
        return CoordinatesMapSerializer(obj.coordinate).data


class SiteOverviewSerializer(serializers.ModelSerializer[Site]):
    image = AssetSerializer()

    class Meta:
        model = Site
        fields = ("id", "name", "image")


class PostPostSerializer(serializers.ModelSerializer[Post]):
    class Meta:
        model = Post
        fields = ("site", "body", "media")


class PostSerializer(serializers.ModelSerializer[Post]):
    site = SiteOverviewSerializer()
    comment_count = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    has_liked = serializers.SerializerMethodField()
    media = AssetSerializer(many=True)

    class Meta:
        model = Post
        fields = (
            "id",
            "site",
            "created_at",
            "body",
            "like_count",
            "share_count",
            "comment_count",
            "has_liked",
            "media",
        )

    @extend_schema_field(serializers.IntegerField())
    def get_comment_count(self, obj):
        return obj.comment_set.count()

    @extend_schema_field(serializers.IntegerField())
    def get_like_count(self, obj: Post):
        return Like.objects.filter(post=obj).count()

    def get_has_liked(self, obj: Post) -> bool:
        user = self.context["request"].user
        if user.is_anonymous:
            return False
        return Like.objects.filter(user=user, post=obj).exists()


# Note about Any: Generic is the type of "instance", not set here
class PostPaginationSerializer(serializers.Serializer[Any]):
    count = serializers.IntegerField()
    next = serializers.CharField(required=False)
    previous = serializers.CharField(required=False)
    results = PostSerializer(many=True)

    class Meta:
        fields = ("count", "next", "previous", "results")


class CreateCommentSerializer(serializers.ModelSerializer[Comment]):
    class Meta:
        model = Comment
        fields = ("body",)


class CommentSerializer(serializers.ModelSerializer[Comment]):
    author_id = serializers.SerializerMethodField()
    author_username = serializers.SerializerMethodField()
    # TODO(NicolasDontigny): Add user avatar image here once implemented

    class Meta:
        model = Comment
        fields = ("id", "body", "author_id", "author_username", "created_at")

    def get_author_id(self, obj: Comment) -> int:
        return obj.user.id

    def get_author_username(self, obj: Comment):
        return obj.user.username


class LikePostSerializer(serializers.ModelSerializer[Like]):
    class Meta:
        model = Like
        fields = ("post",)


class LikeSerializer(serializers.ModelSerializer[Like]):
    class Meta:
        model = Like
        fields = "__all__"
