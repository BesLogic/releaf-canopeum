import re
from datetime import datetime, timedelta
from typing import TYPE_CHECKING, ClassVar, override

import googlemaps
import pytz
from django.contrib.auth.models import AbstractUser
from django.db import models
from rest_framework.request import Request as drf_Request

from .settings import GOOGLE_API_KEY

# Pyright won't be able to infer all types here, see:
# https://github.com/typeddjango/django-stubs/issues/579
# https://github.com/typeddjango/django-stubs/issues/1264
# For now we have to rely on the mypy plugin

LAT_LONG_SEP = re.compile(r"°|\'|\"")

gmaps = googlemaps.Client(key=GOOGLE_API_KEY) if GOOGLE_API_KEY else None

class RoleName(models.TextChoices):
    USER = "User"
    SITEMANAGER = "SiteManager"
    MEGAADMIN = "MegaAdmin"

    @classmethod
    def from_string(cls, value: str):
        try:
            return cls(value)
        except ValueError:
            return cls.USER


class Role(models.Model):
    name = models.CharField(
        max_length=11,
        choices=RoleName.choices,
        default=RoleName.USER,
    )


class User(AbstractUser):
    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True,
    )
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: ClassVar[list[str]] = []
    role = models.ForeignKey[Role, Role](Role, models.RESTRICT, null=False, default=1)
    if TYPE_CHECKING:
        # Missing "id" in "Model" or some base "User" class?
        id: int


class Announcement(models.Model):
    body = models.TextField(blank=True, null=True)
    link = models.TextField(blank=True, null=True)


class Batch(models.Model):
    site = models.ForeignKey("Site", models.CASCADE, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    name = models.TextField(blank=True, null=True)
    sponsor = models.TextField(blank=True, null=True)
    size = models.IntegerField(blank=True, null=True)
    soil_condition = models.TextField(blank=True, null=True)
    total_number_seed = models.IntegerField(blank=True, null=True)
    total_propagation = models.IntegerField(blank=True, null=True)


class FertilizertypeInternationalization(models.Model):
    en = models.TextField(db_column="EN", blank=True, null=True)
    fr = models.TextField(db_column="FR", blank=True, null=True)


class Fertilizertype(models.Model):
    name = models.ForeignKey(
        FertilizertypeInternationalization, models.DO_NOTHING, blank=True, null=True
    )


class Batchfertilizer(models.Model):
    batch = models.ForeignKey(Batch, models.CASCADE, blank=True, null=True)
    fertilizer_type = models.ForeignKey(Fertilizertype, models.DO_NOTHING, blank=True, null=True)


class Batchmulchlayer(models.Model):
    batch = models.ForeignKey(Batch, models.CASCADE, blank=True, null=True)
    mulch_layer_type = models.ForeignKey("Mulchlayertype", models.DO_NOTHING, blank=True, null=True)


class TreespeciestypeInternationalization(models.Model):
    en = models.TextField(db_column="EN", blank=True, null=True)
    fr = models.TextField(db_column="FR", blank=True, null=True)


class Treetype(models.Model):
    name = models.ForeignKey(
        TreespeciestypeInternationalization, models.DO_NOTHING, blank=True, null=True
    )


class BatchSpecies(models.Model):
    batch = models.ForeignKey(Batch, models.CASCADE, blank=True, null=True)
    tree_type = models.ForeignKey(Treetype, models.DO_NOTHING, blank=True, null=True)
    quantity = models.IntegerField(blank=True, null=True)


class BatchSeed(models.Model):
    batch = models.ForeignKey(Batch, models.CASCADE, blank=True, null=True)
    tree_type = models.ForeignKey(Treetype, models.DO_NOTHING, blank=True, null=True)
    quantity = models.IntegerField(blank=True, null=True)


class BatchSupportedSpecies(models.Model):
    batch = models.ForeignKey(Batch, models.CASCADE, blank=True, null=True)
    tree_type = models.ForeignKey(Treetype, models.DO_NOTHING, blank=True, null=True)


class Contact(models.Model):
    address = models.TextField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    facebook_link = models.URLField(blank=True, null=True)
    x_link = models.URLField(blank=True, null=True)
    instagram_link = models.URLField(blank=True, null=True)
    linkedin_link = models.URLField(blank=True, null=True)


class Coordinate(models.Model):
    dms_latitude = models.TextField(blank=True, null=True)
    dms_longitude = models.TextField(blank=True, null=True)
    dd_latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    dd_longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    @classmethod
    def from_dms_lat_long(cls, dms_latitude: str, dms_longitude: str):
        dms_latitude_split = re.split(LAT_LONG_SEP, dms_latitude)
        dd_latitude = (
            float(dms_latitude_split[0])
            + float(dms_latitude_split[1]) / 60
            + float(dms_latitude_split[2]) / 3600
        )
        if dms_latitude_split[4] == "S":
            dd_latitude *= -1

        dms_longitude_split = re.split(LAT_LONG_SEP, dms_longitude)
        dd_longitude = (
            float(dms_longitude_split[0])
            + float(dms_longitude_split[1]) / 60
            + float(dms_longitude_split[2]) / 3600
        )
        if dms_longitude_split[4] == "W":
            dd_longitude *= -1

        formatted_address = (
            gmaps.reverse_geocode(
	            (dd_latitude, dd_longitude), result_type="street_address"
	        )[0] if gmaps is not None else ""
	    )

        return cls.objects.create(
            dms_latitude=dms_latitude,
            dms_longitude=dms_longitude,
            dd_latitude=dd_latitude,
            dd_longitude=dd_longitude,
            address=formatted_address,
        )


class Mulchlayertype(models.Model):
    name = models.ForeignKey(
        "MulchlayertypeInternationalization", models.DO_NOTHING, blank=True, null=True
    )


class MulchlayertypeInternationalization(models.Model):
    en = models.TextField(db_column="EN", blank=True, null=True)
    fr = models.TextField(db_column="FR", blank=True, null=True)


def upload_to(_, filename):
    now = datetime.now(pytz.utc).strftime("%Y%m%d%H%M%S%f")
    return f"{now}{filename}"


class Asset(models.Model):
    asset = models.FileField(upload_to=upload_to, null=False)

    @override
    def delete(self, using=None, keep_parents=False):
        self.asset.delete()
        return super().delete(using, keep_parents)


class Site(models.Model):
    name = models.TextField()
    is_public = models.BooleanField(blank=False, null=False, default=False)
    site_type = models.ForeignKey("Sitetype", models.DO_NOTHING, blank=True, null=True)
    coordinate = models.ForeignKey(Coordinate, models.SET_NULL, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    size = models.TextField(blank=True, null=True)
    research_partnership = models.BooleanField(blank=True, null=True)
    visible_map = models.BooleanField(blank=True, null=True)
    visitor_count = models.IntegerField(blank=True, null=True)
    contact = models.ForeignKey(Contact, models.SET_NULL, blank=True, null=True)
    announcement = models.ForeignKey(Announcement, models.SET_NULL, blank=True, null=True)
    image = models.ForeignKey(Asset, models.SET_NULL, blank=True, null=True)

    @override
    def delete(self, using=None, keep_parents=False):
        # Coordinate
        if self.coordinate:
            self.coordinate.delete()

        # Contact
        if self.contact:
            self.contact.delete()

        # Announcement
        if self.announcement:
            self.announcement.delete()

        # Image
        if self.image:
            self.image.delete()

        return super().delete(using, keep_parents)


# Note: PostAsset must be defined before Post because of a limitation with ManyToManyField type
# inference using string annotations: https://github.com/typeddjango/django-stubs/issues/1802
# Can't manually annotate because of: https://github.com/typeddjango/django-stubs/issues/760
class PostAsset(models.Model):
    post = models.ForeignKey("Post", models.CASCADE, null=False)
    asset = models.ForeignKey(Asset, models.DO_NOTHING, null=False)

    @override
    def delete(self, using=None, keep_parents=False):
        self.asset.delete()
        return super().delete(using, keep_parents)


class Post(models.Model):
    site = models.ForeignKey("Site", models.CASCADE, blank=False, null=False)
    body = models.TextField(blank=False, null=False)
    share_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    # created_by = models.ForeignKey(User, models.DO_NOTHING, blank=True, null=True)
    media = models.ManyToManyField(Asset, through=PostAsset, blank=True)


class Comment(models.Model):
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)


class Siteadmin(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)


def one_week_from_today():
    return datetime.now(pytz.utc) + timedelta(days=7)


class UserInvitation(models.Model):
    code = models.CharField(max_length=64, unique=True)
    expires_at = models.DateTimeField(default=one_week_from_today, blank=False, null=False)
    email = models.EmailField()
    assigned_to_sites = models.ManyToManyField(Site)

    def is_expired(self) -> bool:
        return self.expires_at <= datetime.now(pytz.utc)


class SiteFollower(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)


class Sitetreespecies(models.Model):
    site = models.ForeignKey(Site, models.CASCADE, blank=True, null=True)
    tree_type = models.ForeignKey("Treetype", models.DO_NOTHING, blank=True, null=True)
    quantity = models.IntegerField(blank=True, null=True)


class Sitetype(models.Model):
    name = models.ForeignKey(
        "SitetypeInternationalization", models.DO_NOTHING, blank=True, null=True
    )


class SitetypeInternationalization(models.Model):
    en = models.TextField(db_column="EN", blank=True, null=True)
    fr = models.TextField(db_column="FR", blank=True, null=True)


class Widget(models.Model):
    site = models.ForeignKey(Site, models.CASCADE, blank=True, null=True)
    title = models.TextField(blank=True, null=True)
    body = models.TextField(blank=True, null=True)


class Like(models.Model):
    user = models.ForeignKey(User, models.CASCADE)
    post = models.ForeignKey(Post, models.CASCADE)


class Internationalization(models.Model):
    en = models.TextField(db_column="EN", blank=True, null=True)
    fr = models.TextField(db_column="FR", blank=True, null=True)


class Request(drf_Request):
    """A custom Request type to use for parameter annotations."""

    # Override with our own User model
    user: User  # pyright: ignore[reportIncompatibleMethodOverride]
