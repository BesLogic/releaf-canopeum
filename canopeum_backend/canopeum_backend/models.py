from django.conf import settings
from django.db import models


class Announcement(models.Model):
    body = models.TextField(blank=True, null=True)
    link = models.TextField(blank=True, null=True)


class Batch(models.Model):
    site = models.ForeignKey("Site", models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    name = models.TextField(blank=True, null=True)
    sponsor = models.TextField(blank=True, null=True)
    size = models.TextField(blank=True, null=True)
    soil_condition = models.TextField(blank=True, null=True)
    total_number_seed = models.IntegerField(blank=True, null=True)
    total_propagation = models.IntegerField(blank=True, null=True)


class Batchfertilizer(models.Model):
    batch = models.ForeignKey(Batch, models.DO_NOTHING, blank=True, null=True)
    fertilizer_type = models.ForeignKey("Fertilizertype", models.DO_NOTHING, blank=True, null=True)


class Batchmulchlayer(models.Model):
    batch = models.ForeignKey(Batch, models.DO_NOTHING, blank=True, null=True)
    mulch_layer_type = models.ForeignKey("Mulchlayertype", models.DO_NOTHING, blank=True, null=True)


class BatchSpecies(models.Model):
    batch = models.ForeignKey(Batch, models.DO_NOTHING, blank=True, null=True)
    tree_type = models.ForeignKey("Treetype", models.DO_NOTHING, blank=True, null=True)
    quantity = models.IntegerField(blank=True, null=True)


class BatchSeed(models.Model):
    batch = models.ForeignKey(Batch, models.DO_NOTHING, blank=True, null=True)
    tree_type = models.ForeignKey("Treetype", models.DO_NOTHING, blank=True, null=True)
    quantity = models.IntegerField(blank=True, null=True)


class BatchSupportedSpecies(models.Model):
    batch = models.ForeignKey(Batch, models.DO_NOTHING, blank=True, null=True)
    tree_type = models.ForeignKey("Treetype", models.DO_NOTHING, blank=True, null=True)


class Comment(models.Model):
    body = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    auth_user = models.ForeignKey(settings.AUTH_USER_MODEL, models.DO_NOTHING, blank=True, null=True)
    post = models.ForeignKey("Post", models.DO_NOTHING, blank=True, null=True)


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


class Fertilizertype(models.Model):
    name = models.ForeignKey("FertilizertypeInternationalization", models.DO_NOTHING, blank=True, null=True)


class FertilizertypeInternationalization(models.Model):
    en = models.TextField(db_column="EN", blank=True, null=True)
    fr = models.TextField(db_column="FR", blank=True, null=True)


class Image(models.Model):
    path = models.TextField(blank=True, null=True)


class Mulchlayertype(models.Model):
    name = models.ForeignKey("MulchlayertypeInternationalization", models.DO_NOTHING, blank=True, null=True)


class MulchlayertypeInternationalization(models.Model):
    en = models.TextField(db_column="EN", blank=True, null=True)
    fr = models.TextField(db_column="FR", blank=True, null=True)


class Post(models.Model):
    site = models.ForeignKey("Site", models.DO_NOTHING, blank=True, null=True)
    body = models.TextField(blank=True, null=True)
    like_count = models.IntegerField(blank=True, null=True)
    share_count = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)


class Postimage(models.Model):
    image = models.ForeignKey(Image, models.DO_NOTHING, blank=True, null=True)
    post = models.ForeignKey(Post, models.DO_NOTHING, blank=True, null=True)


class Site(models.Model):
    name = models.TextField(blank=True, null=True)
    site_type = models.ForeignKey("Sitetype", models.DO_NOTHING, blank=True, null=True)
    image = models.ForeignKey(Image, models.DO_NOTHING, blank=True, null=True)
    coordinate = models.ForeignKey(Coordinate, models.DO_NOTHING, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    size = models.TextField(blank=True, null=True)
    research_partnership = models.BooleanField(blank=True, null=True)
    visible_map = models.BooleanField(blank=True, null=True)
    visitor_count = models.IntegerField(blank=True, null=True)
    contact = models.ForeignKey(Contact, models.DO_NOTHING, blank=True, null=True)
    announcement = models.ForeignKey(Announcement, models.DO_NOTHING, blank=True, null=True)


class Siteadmin(models.Model):
    auth_user = models.ForeignKey(settings.AUTH_USER_MODEL, models.DO_NOTHING, blank=True, null=True)
    site = models.ForeignKey(Site, models.DO_NOTHING, blank=True, null=True)


class Siteimage(models.Model):
    image = models.ForeignKey(Image, models.DO_NOTHING, blank=True, null=True)
    site = models.ForeignKey(Site, models.DO_NOTHING, blank=True, null=True)


class Sitetreespecies(models.Model):
    site = models.ForeignKey(Site, models.DO_NOTHING, blank=True, null=True)
    tree_type = models.ForeignKey("Treetype", models.DO_NOTHING, blank=True, null=True)
    quantity = models.IntegerField(blank=True, null=True)


class Sitetype(models.Model):
    name = models.ForeignKey("SitetypeInternationalization", models.DO_NOTHING, blank=True, null=True)


class SitetypeInternationalization(models.Model):
    en = models.TextField(db_column="EN", blank=True, null=True)
    fr = models.TextField(db_column="FR", blank=True, null=True)


class TreespeciestypeInternationalization(models.Model):
    en = models.TextField(db_column="EN", blank=True, null=True)
    fr = models.TextField(db_column="FR", blank=True, null=True)


class Treetype(models.Model):
    name = models.ForeignKey(TreespeciestypeInternationalization, models.DO_NOTHING, blank=True, null=True)


class Widget(models.Model):
    site = models.ForeignKey(Site, models.DO_NOTHING, blank=True, null=True)
    title = models.TextField(blank=True, null=True)
    body = models.TextField(blank=True, null=True)


class Like(models.Model):
    auth_user = models.ForeignKey(settings.AUTH_USER_MODEL, models.DO_NOTHING, blank=True, null=True)
    post = models.ForeignKey(Post, models.DO_NOTHING, blank=True, null=True)


class Internationalization(models.Model):
    en = models.TextField(db_column="EN", blank=True, null=True)
    fr = models.TextField(db_column="FR", blank=True, null=True)
