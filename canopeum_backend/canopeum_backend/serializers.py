from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

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
    Site,
    Siteadmin,
    Sitetreespecies,
    Sitetype,
    Treetype,
    Widget,
)


class AuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "password")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


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
        fields = ("asset",)

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


class SiteSocialSerializer(serializers.ModelSerializer):
    site_type = SiteTypeSerializer()
    contact = ContactSerializer()
    announcement = AnnouncementSerializer()
    widget = serializers.SerializerMethodField()
    sponsors = serializers.SerializerMethodField()
    image = AssetSerializer()

    class Meta:
        model = Site
        fields = ("name", "site_type", "image", "description", "contact", "announcement", "sponsors", "widget")

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
    updated_on = serializers.DateTimeField()

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
            "updated_on",
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
    user_id = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

    class Meta:
        model = Siteadmin
        fields = ("id", "user_id", "username")

    @extend_schema_field(str)  # pyright: ignore[reportArgumentType]
    def get_user_id(self, obj):
        return AuthUserSerializer().get_attribute("id")

    @extend_schema_field(str)  # pyright: ignore[reportArgumentType]
    def get_username(self, obj):
        return AuthUserSerializer().get_attribute("username")


class SiteSummarySerializer(serializers.ModelSerializer):
    site_type = SiteTypeSerializer()
    coordinate = CoordinatesSerializer()
    plant_count = serializers.SerializerMethodField()
    survived_count = serializers.SerializerMethodField()
    propagation_count = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    sponsors = serializers.SerializerMethodField()
    admins = SiteAdminSerializer(many=True)
    batches = BatchAnalyticsSerializer(many=True)

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

    @extend_schema_field(SiteAdminSerializer(many=True))
    def get_admins(self, obj):
        admins = Siteadmin.objects.filter(site=obj)
        return SiteAdminSerializer(admins, many=True).data

    def get_batches(self, obj):
        batches = obj.batch_set.all()
        serializer = BatchAnalyticsSerializer(batches, many=True)
        return serializer.data


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
        fields = ("site", "body")


class PostSerializer(serializers.ModelSerializer):
    site = SiteOverviewSerializer()
    comment_count = serializers.SerializerMethodField()
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

    @extend_schema_field(int)  # pyright: ignore[reportArgumentType]
    def get_comment_count(self, obj):
        return self.context.get("comment_count")

    @extend_schema_field(bool)  # pyright: ignore[reportArgumentType]
    def get_has_liked(self, obj):
        return self.context.get("has_liked")


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ("id", "body", "auth_user", "created_at")


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = "__all__"
