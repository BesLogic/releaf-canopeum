# Pyright does not support duck-typed Meta inner-class
# pyright: reportIncompatibleVariableOverride=false

from collections.abc import Mapping
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

                role = Role.objects.get(name=RoleName.ForestSteward)
            except UserInvitation.DoesNotExist:
                raise serializers.ValidationError("INVITATION_CODE_INVALID") from None
        else:
            role = Role.objects.get(name=RoleName.User)

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
        return RoleName.from_string(obj.role.name)  # type: ignore[no-any-return] # mypy false-positive

    def get_admin_site_ids(self, obj: User) -> list[int]:
        return [siteadmin.site.pk for siteadmin in Siteadmin.objects.filter(user=obj)]

    def get_followed_site_ids(self, obj: User) -> list[int]:
        if obj.role.name == RoleName.MegaAdmin:
            return [site.pk for site in Site.objects.all()]
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


# Note about Any: Generic is the type of "instance", not set here
class TranslatableSerializerMixin(serializers.Serializer[Any]):
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()
    __translate_key__ = "name"

    class Meta:
        abstract = True
        fields = ("en", "fr")

    def get_en(self, obj):
        return InternationalizationSerializer(getattr(obj, self.__translate_key__)).data.get("en")

    def get_fr(self, obj):
        return InternationalizationSerializer(getattr(obj, self.__translate_key__)).data.get("fr")


class SiteTypeSerializer(serializers.ModelSerializer[Sitetype], TranslatableSerializerMixin):
    class Meta:
        model = Sitetype
        fields = ("id", *TranslatableSerializerMixin.Meta.fields)


class TreeTypeSerializer(serializers.ModelSerializer[Treetype], TranslatableSerializerMixin):
    class Meta:
        model = Treetype
        fields = ("id", *TranslatableSerializerMixin.Meta.fields)


class FertilizerTypeSerializer(
    serializers.ModelSerializer[Fertilizertype], TranslatableSerializerMixin
):
    class Meta:
        model = Fertilizertype
        fields = ("id", *TranslatableSerializerMixin.Meta.fields)


class MulchLayerTypeSerializer(
    serializers.ModelSerializer[Mulchlayertype], TranslatableSerializerMixin
):
    class Meta:
        model = Mulchlayertype
        fields = ("id", *TranslatableSerializerMixin.Meta.fields)


class AnnouncementSerializer(serializers.ModelSerializer[Announcement]):
    class Meta:
        model = Announcement
        fields = "__all__"


class ContactSerializer(serializers.ModelSerializer[Contact]):
    class Meta:
        model = Contact
        fields = "__all__"


class SitetreespeciesSerializer(
    serializers.ModelSerializer[Sitetreespecies], TranslatableSerializerMixin
):
    id = serializers.SerializerMethodField()
    __translate_key__ = "tree_type"

    class Meta:
        model = Sitetreespecies
        fields = ("id", "quantity", *TranslatableSerializerMixin.Meta.fields)

    def get_id(self, obj) -> int:
        return TreeTypeSerializer(obj.tree_type).data.get("id", None)  # type: ignore[no-any-return]


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

    def create(self, validated_data):
        logo_data = validated_data.pop("logo")
        logo_serializer = AssetSerializer(data=logo_data)
        logo_serializer.is_valid()
        created_logo = logo_serializer.save()

        return BatchSponsor.objects.create(**validated_data, logo=created_logo)

    def update(self, instance, validated_data: Mapping[str, Any]):
        instance.name = validated_data.get("name", instance.name)
        instance.url = validated_data.get("url", instance.url)
        logo_data = validated_data.get("logo")
        if logo_data is not None:
            logo_serializer = AssetSerializer(data=logo_data)
            logo_serializer.is_valid()
            old_logo_asset_to_delete = Asset.objects.get(pk=instance.logo.pk)
            instance.logo = logo_serializer.save()
            if old_logo_asset_to_delete is not None:
                # TODO(NicolasDontigny): The old image file is not deleted from the media folder;
                # Figure out if that is something we want to do
                old_logo_asset_to_delete.delete()

        instance.save()
        return instance


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


class BatchSeedSerializer(serializers.ModelSerializer[BatchSeed]):
    tree_type = serializers.SerializerMethodField()

    class Meta:
        model = BatchSeed
        fields = ("id", "quantity", "tree_type")

    @extend_schema_field(TreeTypeSerializer)
    def get_tree_type(self, obj: BatchSeed):
        return TreeTypeSerializer(obj.tree_type).data


class BatchSpeciesSerializer(serializers.ModelSerializer[BatchSpecies]):
    tree_type = serializers.SerializerMethodField()

    class Meta:
        model = BatchSpecies
        fields = ("id", "quantity", "tree_type")

    @extend_schema_field(TreeTypeSerializer)
    def get_tree_type(self, obj: BatchSpecies):
        return TreeTypeSerializer(obj.tree_type).data


class BatchDetailSerializer(serializers.ModelSerializer[Batch]):
    fertilizers = serializers.SerializerMethodField()
    mulch_layers = serializers.SerializerMethodField()
    supported_species = serializers.SerializerMethodField()
    seeds = serializers.SerializerMethodField()
    total_number_seeds = serializers.SerializerMethodField()
    species = serializers.SerializerMethodField()
    plant_count = serializers.SerializerMethodField()
    sponsor = serializers.SerializerMethodField()
    # HACK to allow handling the image with a AssetSerializer separately
    # TODO: Figure out how to feed the image directly to BatchDetailSerializer
    image = AssetSerializer(required=False)

    class Meta:
        model = Batch
        fields = "__all__"

    @extend_schema_field(FertilizerTypeSerializer(many=True))
    def get_fertilizers(self, obj: Batch):
        batch_fertilizers = Batchfertilizer.objects.filter(batch=obj)
        fertilizer_types = [
            batch_fertilizer.fertilizer_type for batch_fertilizer in batch_fertilizers
        ]

        return FertilizerTypeSerializer(fertilizer_types, many=True).data

    @extend_schema_field(MulchLayerTypeSerializer(many=True))
    def get_mulch_layers(self, obj: Batch):
        batch_mulch_layers = Batchmulchlayer.objects.filter(batch=obj)
        mulch_layer_types = [
            batch_mulch_layer.mulch_layer_type for batch_mulch_layer in batch_mulch_layers
        ]
        return MulchLayerTypeSerializer(mulch_layer_types, many=True).data

    @extend_schema_field(TreeTypeSerializer(many=True))
    def get_supported_species(self, obj: Batch):
        batch_supported_species_list = BatchSupportedSpecies.objects.filter(batch=obj)
        supported_species_types = [
            batch_supported_species.tree_type
            for batch_supported_species in batch_supported_species_list
        ]
        return TreeTypeSerializer(supported_species_types, many=True).data

    @extend_schema_field(BatchSeedSerializer(many=True))
    def get_seeds(self, obj: Batch):
        return BatchSeedSerializer(BatchSeed.objects.filter(batch=obj), many=True).data

    def get_total_number_seeds(self, obj: Batch) -> int:
        return obj.get_total_number_seeds()

    @extend_schema_field(BatchSpeciesSerializer(many=True))
    def get_species(self, obj: Batch):
        return BatchSpeciesSerializer(BatchSpecies.objects.filter(batch=obj), many=True).data

    def get_plant_count(self, obj: Batch) -> int:
        return obj.get_plant_count()

    @extend_schema_field(BatchSponsorSerializer)
    def get_sponsor(self, obj: Batch):
        return BatchSponsorSerializer(BatchSponsor.objects.get(batch=obj)).data


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
    sponsor_progress = serializers.SerializerMethodField()
    survived_count = serializers.SerializerMethodField()
    propagation_count = serializers.SerializerMethodField()
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
            "sponsor_progress",
            "survived_count",
            "propagation_count",
            "visitor_count",
            "admins",
            "batches",
        )

    def get_plant_count(self, obj: Site) -> int:
        return obj.get_plant_count()

    def get_sponsor_progress(self, obj: Site) -> float:
        return obj.get_sponsor_progress()

    def get_survived_count(self, obj: Site) -> int:
        batches = Batch.objects.filter(site=obj)
        return sum(batch.survived_count or 0 for batch in batches)

    def get_propagation_count(self, obj: Site) -> int:
        batches = Batch.objects.filter(site=obj)
        return sum(batch.total_propagation or 0 for batch in batches)

    @extend_schema_field(BatchDetailSerializer(many=True))
    def get_batches(self, obj):
        batches = obj.batch_set.all().order_by("-updated_at")
        return BatchDetailSerializer(batches, many=True).data


class SiteSummaryDetailSerializer(serializers.ModelSerializer[Site]):
    site_type = SiteTypeSerializer()
    coordinate = CoordinatesSerializer()
    plant_count = serializers.SerializerMethodField()
    sponsor_progress = serializers.SerializerMethodField()
    survived_count = serializers.SerializerMethodField()
    propagation_count = serializers.SerializerMethodField()
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
            "sponsor_progress",
            "survived_count",
            "propagation_count",
            "visitor_count",
            "sponsors",
            "admins",
            "batches",
            "weather",
        )

    def get_plant_count(self, obj: Site) -> int:
        return obj.get_plant_count()

    def get_sponsor_progress(self, obj: Site) -> float:
        return obj.get_sponsor_progress()

    def get_survived_count(self, obj: Site) -> int:
        batches = Batch.objects.filter(site=obj)
        return sum(batch.survived_count or 0 for batch in batches)

    def get_propagation_count(self, obj: Site) -> int:
        batches = Batch.objects.filter(site=obj)
        return sum(batch.total_propagation or 0 for batch in batches)

    @extend_schema_field(BatchSponsorSerializer(many=True))
    def get_sponsors(self, obj):
        batches = Batch.objects.filter(site=obj)
        sponsors = [batch.sponsor for batch in batches if batch.sponsor]
        return BatchSponsorSerializer(sponsors, many=True).data

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
            # "share_count",
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
