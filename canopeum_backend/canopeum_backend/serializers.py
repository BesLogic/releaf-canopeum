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
    BatchSeed,
    BatchSpecies,
    BatchSupportedSpecies,
    Comment,
    Contact,
    Coordinate,
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


class IntegerListFieldSerializer(serializers.ListField):
    child = serializers.IntegerField()


class LoginUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("email", "password")


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "email")


class RegisterUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])
    email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])

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


class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    admin_site_ids = serializers.SerializerMethodField()
    followed_site_ids = serializers.SerializerMethodField()

    class Meta:
        model = User
        exclude = ("password",)

    def get_role(self, obj: User) -> RoleName:
        role_name = obj.role.name
        return RoleName.from_string(RoleName.USER, role_name)

    def get_admin_site_ids(self, obj: User) -> list[int]:
        return [siteadmin.site.id for siteadmin in Siteadmin.objects.filter(user=obj)]

    def get_followed_site_ids(self, obj: User) -> list[int]:
        return [site_follower.site.id for site_follower in SiteFollower.objects.filter(user=obj)]


class UserTokenSerializer(serializers.Serializer):
    token = TokenRefreshSerializer()
    user = UserSerializer()

    class Meta:
        fields = ("token", "user")


class CoordinatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coordinate
        fields = "__all__"


class WidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Widget
        fields = "__all__"


class InternationalizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Internationalization
        fields = ("en", "fr")


class SiteTypeSerializer(serializers.ModelSerializer):
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()

    class Meta:
        model = Sitetype
        fields = ("id", "en", "fr")

    def get_en(self, obj):
        return InternationalizationSerializer(obj.name).data.get("en", None)

    def get_fr(self, obj):
        return InternationalizationSerializer(obj.name).data.get("fr", None)


class TreeTypeSerializer(serializers.ModelSerializer):
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()

    class Meta:
        model = Treetype
        fields = ("en", "fr")

    def get_en(self, obj):
        return InternationalizationSerializer(obj.name).data.get("en", None)

    def get_fr(self, obj):
        return InternationalizationSerializer(obj.name).data.get("fr", None)


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = "__all__"


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = "__all__"


class SitetreespeciesSerializer(serializers.ModelSerializer):
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()

    class Meta:
        model = Sitetreespecies
        fields = ("id", "quantity", "en", "fr")

    def get_en(self, obj):
        return TreeTypeSerializer(obj.tree_type).data.get("en", None)

    def get_fr(self, obj):
        return TreeTypeSerializer(obj.tree_type).data.get("fr", None)


class AssetSerializer(serializers.ModelSerializer):
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


class SitePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ("id", "name", "description", "image")


class SiteSerializer(serializers.ModelSerializer):
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


class SiteNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ("id", "name")


class AdminUserSitesSerializer(serializers.ModelSerializer):
    sites = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "username", "email", "sites")

    @extend_schema_field(SiteNameSerializer(many=True))
    def get_sites(self, obj):
        sites_list = [siteadmin.site for siteadmin in obj.siteadmin_set.all()]
        return SiteNameSerializer(sites_list, many=True).data


class SiteSocialSerializer(serializers.ModelSerializer):
    site_type = SiteTypeSerializer()
    contact = ContactSerializer()
    announcement = AnnouncementSerializer()
    widget = serializers.SerializerMethodField()
    sponsors = serializers.SerializerMethodField()
    image = AssetSerializer()

    class Meta:
        model = Site
        fields = ("id", "name", "site_type", "image", "description", "contact", "announcement", "sponsors", "widget")

    # Bug in the extend_schema_field type annotation, they should allow
    # base python types supported by open api specs
    @extend_schema_field(list[str])  # pyright: ignore[reportArgumentType]
    def get_sponsors(self, obj):
        return self.context.get("sponsors")

    @extend_schema_field(WidgetSerializer(many=True))
    def get_widget(self, obj):
        return WidgetSerializer(obj.widget_set.all(), many=True).data


class BatchfertilizerSerializer(serializers.ModelSerializer):
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()

    class Meta:
        model = Batchfertilizer
        fields = ("id", "en", "fr")

    def get_en(self, obj):
        return InternationalizationSerializer(obj.fertilizer_type).data.get("en", None)

    def get_fr(self, obj):
        return InternationalizationSerializer(obj.fertilizer_type).data.get("fr", None)


class BatchMulchLayerSerializer(serializers.ModelSerializer):
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()

    class Meta:
        model = Mulchlayertype
        fields = ("id", "en", "fr")

    def get_en(self, obj):
        return InternationalizationSerializer(obj.mulch_layer_type).data.get("en", None)

    def get_fr(self, obj):
        return InternationalizationSerializer(obj.mulch_layer_type).data.get("fr", None)


class BatchSupportedSpeciesSerializer(serializers.ModelSerializer):
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()

    class Meta:
        model = BatchSupportedSpecies
        fields = ("en", "fr")

    def get_en(self, obj):
        return InternationalizationSerializer(obj.tree_type).data.get("en", None)

    def get_fr(self, obj):
        return InternationalizationSerializer(obj.tree_type).data.get("fr", None)


class BatchSeedSerializer(serializers.ModelSerializer):
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()

    class Meta:
        model = BatchSeed
        fields = ("quantity", "en", "fr")

    def get_en(self, obj):
        return InternationalizationSerializer(obj.tree_type).data.get("en", None)

    def get_fr(self, obj):
        return InternationalizationSerializer(obj.tree_type).data.get("fr", None)


class BatchSpeciesSerializer(serializers.ModelSerializer):
    en = serializers.SerializerMethodField()
    fr = serializers.SerializerMethodField()

    class Meta:
        model = BatchSpecies
        fields = ("quantity", "en", "fr")

    def get_en(self, obj):
        return InternationalizationSerializer(obj.tree_type).data.get("en", None)

    def get_fr(self, obj):
        return InternationalizationSerializer(obj.tree_type).data.get("fr", None)


class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = "__all__"


class BatchAnalyticsSerializer(serializers.ModelSerializer):
    fertilizers = serializers.SerializerMethodField()
    mulch_layers = serializers.SerializerMethodField()
    supported_species = serializers.SerializerMethodField()
    plant_count = serializers.SerializerMethodField()
    survived_count = serializers.SerializerMethodField()
    replace_count = serializers.SerializerMethodField()
    seed_collected_count = serializers.SerializerMethodField()
    seeds = serializers.SerializerMethodField()
    species = serializers.SerializerMethodField()
    updated_at = serializers.DateTimeField()

    class Meta:
        model = Batch
        fields = (
            "id",
            "name",
            "size",
            "soil_condition",
            "sponsor",
            "fertilizers",
            "mulch_layers",
            "supported_species",
            "plant_count",
            "survived_count",
            "replace_count",
            "seed_collected_count",
            "seeds",
            "species",
            "updated_at",
        )

    @extend_schema_field(int)  # pyright: ignore[reportArgumentType]
    def get_plant_count(self, obj):
        return self.context.get("plant_count")

    @extend_schema_field(int)  # pyright: ignore[reportArgumentType]
    def get_survived_count(self, obj):
        return self.context.get("survived_count")

    @extend_schema_field(int)  # pyright: ignore[reportArgumentType]
    def get_replace_count(self, obj):
        return self.context.get("replace_count")

    @extend_schema_field(int)  # pyright: ignore[reportArgumentType]
    def get_seed_collected_count(self, obj):
        return self.context.get("seed_collected_count")

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


class SiteAdminSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Siteadmin
        fields = ("user",)


class CreateUserInvitationSerializer(serializers.Serializer):
    site_ids = IntegerListFieldSerializer()
    email = serializers.EmailField()

    class Meta:
        fields = ("site_ids", "email")


class UserInvitationSerializer(serializers.ModelSerializer):
    expires_at = serializers.DateTimeField()

    class Meta:
        model = UserInvitation
        fields = ("id", "code", "email", "expires_at")


class SiteFollowerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    site = SiteSerializer()

    class Meta:
        model = SiteFollower
        fields = ("user", "site")


class SiteAdminUpdateRequestSerializer(serializers.Serializer):
    ids = IntegerListFieldSerializer()

    class Meta:
        fields = ("ids",)


class SiteSummarySerializer(serializers.ModelSerializer):
    site_type = SiteTypeSerializer()
    coordinate = CoordinatesSerializer()
    plant_count = serializers.SerializerMethodField()
    survived_count = serializers.SerializerMethodField()
    propagation_count = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    sponsors = serializers.SerializerMethodField()
    admins = SiteAdminSerializer(source="siteadmin_set", many=True)
    batches = BatchAnalyticsSerializer(source="batch_set", read_only=True, many=True)

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

    @extend_schema_field(int)  # pyright: ignore[reportArgumentType]
    def get_plant_count(self, obj):
        return self.context.get("plant_count")

    @extend_schema_field(int)  # pyright: ignore[reportArgumentType]
    def get_survived_count(self, obj):
        return self.context.get("survived_count")

    @extend_schema_field(int)  # pyright: ignore[reportArgumentType]
    def get_propagation_count(self, obj):
        return self.context.get("propagation_count")

    @extend_schema_field(float)  # pyright: ignore[reportArgumentType]
    def get_progress(self, obj):
        return self.context.get("progress")

    @extend_schema_field(list[str])  # pyright: ignore[reportArgumentType]
    def get_sponsors(self, obj):
        batches = Batch.objects.filter(site=obj)
        return [batch.sponsor for batch in batches]


class CoordinatesMapSerializer(serializers.ModelSerializer):
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

    class Meta:
        model = Coordinate
        fields = ("latitude", "longitude", "address")

    def get_latitude(self, obj):
        return obj.dd_latitude

    def get_longitude(self, obj):
        return obj.dd_longitude


class SiteMapSerializer(serializers.ModelSerializer):
    site_type = SiteTypeSerializer()
    coordinates = serializers.SerializerMethodField()
    image = AssetSerializer()

    class Meta:
        model = Site
        fields = ("id", "name", "site_type", "coordinates", "image")

    @extend_schema_field(CoordinatesMapSerializer)
    def get_coordinates(self, obj):
        return CoordinatesMapSerializer(obj.coordinate).data


class SiteOverviewSerializer(serializers.ModelSerializer):
    image = AssetSerializer()

    class Meta:
        model = Site
        fields = ("id", "name", "image")


class PostPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ("site", "body", "media")


class PostSerializer(serializers.ModelSerializer):
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
    def get_like_count(self, obj):
        return Like.objects.filter(post=obj).count()

    @extend_schema_field(bool)  # pyright: ignore[reportArgumentType]
    def get_has_liked(self, obj: Post):
        user = self.context["request"].user
        if user.is_anonymous:
            return False
        return Like.objects.filter(user=user).exists()


class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ("body",)


class CommentSerializer(serializers.ModelSerializer):
    author_id = serializers.SerializerMethodField()
    author_username = serializers.SerializerMethodField()
    # TODO(NicolasDontigny): Add user avatar image here once implemented

    class Meta:
        model = Comment
        fields = ("id", "body", "author_id", "author_username", "created_at")

    @extend_schema_field(int)  # pyright: ignore[reportArgumentType]
    def get_author_id(self, obj):
        return obj.user.id

    def get_author_username(self, obj):
        return obj.user.username


class LikePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ("post",)


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = "__all__"
