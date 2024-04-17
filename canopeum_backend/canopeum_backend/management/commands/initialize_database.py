from pathlib import Path

from django.core.files import File
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import connection
from django.utils import timezone

from canopeum_backend import settings
from canopeum_backend.models import (
    Announcement,
    Asset,
    Batch,
    Contact,
    Coordinate,
    Fertilizertype,
    FertilizertypeInternationalization,
    Mulchlayertype,
    MulchlayertypeInternationalization,
    Post,
    Role,
    Site,
    Siteadmin,
    Sitetype,
    SitetypeInternationalization,
    TreespeciestypeInternationalization,
    Treetype,
    User,
)


class Command(BaseCommand):
    help = "Generate Data for the database"

    def handle(self, *args, **kwargs):
        self.stdout.write("Are you sure you want to erase all existing data and generate new data?")
        self.stdout.write("This operation is irreversible and will erase all existing data")
        self.stdout.write("Type 'yes' to continue, or 'no' to cancel")
        response = input()
        if response != "yes":
            self.stdout.write(self.style.ERROR("Operation cancelled"))
            return
        with connection.cursor() as cursor:
            if cursor.execute("SHOW TABLES;") != 0:
                self.stdout.write("Erasing existing data...")
                assets_to_delete = Asset.objects.all().exclude(asset="site_img.png")
                for asset in assets_to_delete:
                    path = Path(settings.BASE_DIR) / "canopeum_backend" / "media" / asset.asset.name
                    path.unlink(missing_ok=True)
                call_command("flush", "--noinput")
                cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
                cursor.execute("SHOW TABLES;")
                tables = cursor.fetchall()
                for table in tables:
                    cursor.execute(f"DROP TABLE IF EXISTS {table[0]};")
                cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
        self.stdout.write(self.style.SUCCESS("Existing data erased"))

        self.stdout.write("Migrating database...")
        call_command("makemigrations")
        call_command("migrate")

        self.stdout.write("Generating Data")
        self.create_fertilizer_types()
        self.create_mulch_layer_types()
        self.create_tree_types()
        self.create_site_types()
        self.create_assets()
        self.create_canopeum_site()
        self.create_post_conopeum_site()
        self.create_batch()
        self.create_roles()
        self.create_users()
        self.create_siteadmins()
        self.stdout.write(self.style.SUCCESS("Data Generated"))

    def create_fertilizer_types(self):
        fertilizer_types = [["Synthetic", "Synthetique"], ["Innoculant", "Innoculant"]]
        for _ in fertilizer_types:
            Fertilizertype.objects.create(name=FertilizertypeInternationalization.objects.create(en=_[0], fr=_[1]))

    def create_mulch_layer_types(self):
        mulch_layer_types = [
            ["Sheep wool", "Laine de mouton"],
            ["Cardboard", "Carton"],
            ["Compost", "Compost"],
            ["Woodchips", "Copeaux de bois"],
            ["Saw dust", "Poussière de scie"],
            ["Corn husk", "Feuille de maïs"],
        ]
        for _ in mulch_layer_types:
            Mulchlayertype.objects.create(name=MulchlayertypeInternationalization.objects.create(en=_[0], fr=_[1]))

    def create_tree_types(self):
        tree_types = [
            ["Balsam Fir", "Sapin baumier"],
            ["Black Maple", "Érable noir"],
            ["Red Maple", "Érable rouge"],
            ["Silver Maple", "Érable argenté"],
            ["Sugar Maple", "Érable à sucre"],
            ["Ohio Buckeye", "Marronnier d'Ohio"],
            ["Speckled Alder", "Aulne tacheté"],
            ["Green Alder", "Aulne vert"],
            ["Serviceberries", "Amélanchier"],
            ["Black Chokeberry", "Aronie noire"],
            ["Yellow Birch", "Bouleau jaune"],
            ["White Birch", "Bouleau blanc"],
            ["Gray Birch", "Bouleau gris"],
            ["Blue Beech", "Hêtre bleu"],
            ["Bitternut Hickory", "Noyer amer"],
            ["Pignut Hickory", "Noyer des montagnes"],
            ["Big Shellbark Hickory", "Noyer à gros fruits"],
            ["Shagbark Hickory", "Noyer à écorce shaggy"],
            ["American Bittersweet", "Morelle d'Amérique"],
            ["Northern Hackberry", "Micocoulier occidental"],
            ["Buttonbush", "Céphalanthère occidentale"],
            ["Redbud", "Gainier de Virginie"],
            ["Alternate-leaf Dogwood", "Cornouiller à feuilles alternes"],
            ["Silky Dogwood", "Cornouiller soyeux"],
            ["Flowering Dogwood", "Cornouiller à fleurs"],
            ["Gray Dogwood", "Cornouiller gris"],
            ["Redosier Dogwood", "Cornouiller stolonifère"],
            ["American Hazelnut", "Noisetier d'Amérique"],
            ["Beaked Hazel", "Coudrier à bec"],
            ["Hawthorns", "Aubépines"],
            ["Bush Honeysuckle", "Chèvrefeuille arbustif"],
            ["American Beech", "Hêtre d'Amérique"],
            ["White Ash", "Frêne blanc"],
            ["Black Ash", "Frêne noir"],
            ["Green/ Red Ash", "Frêne vert/rouge"],
            ["Pumpkin Ash", "Frêne citrouille"],
            ["Blue Ash", "Frêne bleu"],
            ["Honey Locust", "Faux-acacia"],
            ["Kentucky Coffeetree", "Gymnocladus de Kentucky"],
            ["Witch-Hazel", "Hamamélis de Virginie"],
            ["Winterberry", "Houx d'hiver"],
            ["Butternut", "Noyer cendré"],
            ["Black Walnut", "Noyer noir"],
            ["Common Juniper", "Genévrier commun"],
            ["Eastern Red Cedar", "Genévrier rouge de l'Est"],
            ["Tamarac", "Mélèze laricin"],
            ["Spicebush", "Lindera à feuilles opposées"],
            ["Tulip-Tree", "Tulipier de Virginie"],
            ["Cucumber-Tree", "Magnolia concombre"],
            ["Sweetgale", "Myrica gale"],
            ["Black Gum", "Nyssa sylvatica"],
            ["Ironwood", "Ostryer de Virginie"],
            ["Virginia Creeper", "Vigne vierge"],
            ["Ninebark", "Physocarpe"],
            ["White Spruce", "Épinette blanche"],
            ["Black Spruce", "Épinette noire"],
            ["Red Spruce", "Épinette rouge"],
            ["Jack Pine", "Pin gris"],
            ["Red Pine", "Pin rouge"],
            ["Pitch Pine", "Pin rigide"],
            ["Eastern White Pine", "Pin blanc de l'Est"],
            ["Sycamore", "Platanus occidentalis"],
            ["Eastern Cottonwood", "Peuplier baumier"],
            ["Trembling Aspen", "Peuplier faux-tremble"],
            ["American Plum", "Prunier d'Amérique"],
            ["Pin Cherry", "Cerisier de Pennsylvanie"],
            ["Black Cherry", "Cerisier noir"],
            ["Eastern Choke Cherry", "Cerisier de Virginie"],
            ["Hoptree", "Ptelea trifoliata"],
            ["White Oak", "Chêne blanc"],
            ["Swamp White Oak", "Chêne blanc des marais"],
            ["Bur Oak", "Chêne bur"],
            ["Chinquapin Oak", "Chêne chinkapin"],
            ["Pin Oak", "Chêne à pin"],
            ["Red Oak", "Chêne rouge"],
            ["Shumard Oak", "Chêne de Shumard"],
            ["Black Oak", "Chêne noir"],
            ["Fragrant Sumac", "Sumac aromatique"],
            ["Shining Sumac", "Sumac brillant"],
            ["Staghorn Sumac", "Sumac vinaigrier"],
            ["Purple-flowering Raspberry", "Ronce pourpre"],
            ["Roses", "Roses"],
            ["Willows", "Saules"],
            ["Black Elderberry", "Sureau noir"],
            ["Red Elderberry", "Sureau rouge"],
            ["Sassafras", "Sassafras"],
            ["American Mountain Ash", "Sorbier d'Amérique"],
            ["Showy Mountain Ash", "Sorbier remarquable"],
            ["Narrow-leaved Meadowsweet", "Reine-des-prés à feuilles étroites"],
            ["Snowberry", "Symphorine"],
            ["White Cedar", "Thuya occidental"],
            ["Basswood", "Tilleul d'Amérique"],
            ["Eastern Hemlock", "Pruche de l'Est"],
            ["American Elm", "Orme d'Amérique"],
            ["Slippery Elm", "Orme glissant"],
            ["Nannyberry", "Viorne à feuilles de viorne"],
            ["American Highbush Cranberry", "Viorne trilobée"],
        ]

        for _ in tree_types:
            Treetype.objects.create(name=TreespeciestypeInternationalization.objects.create(en=_[0], fr=_[1]))

    def create_site_types(self):
        site_types = [
            ["Parks", "Parcs"],
            ["Indigenous community", "Communauté Indigène"],
            ["Educational Facility", "Établissement d'enseignement"],
            ["Farms Land", "Terres agricoles"],
            ["Corporate Lot", "Lot d'entreprise"],
        ]

        for _ in site_types:
            Sitetype.objects.create(name=SitetypeInternationalization.objects.create(en=_[0], fr=_[1]))

    def create_assets(self):
        asset_path = Path(settings.BASE_DIR) / "canopeum_backend" / "media" / "site_img.png"
        for _ in range(2):  # Saving 2 example images
            with Path.open(asset_path, "rb") as img_file:
                django_file = File(img_file)

                asset = Asset()
                asset.asset.save(asset_path.name, django_file, save=True)

    def create_canopeum_site(self):
        Site.objects.create(
            name="Canopeum",
            site_type=Sitetype.objects.get(name=SitetypeInternationalization.objects.get(en="Parks")),
            coordinate=Coordinate.objects.create(
                dms_latitude="45°30'06.1\"N",
                dms_longitude="73°34'02.3\"W",
                dd_latitude=45.5017,
                dd_longitude=-73.5673,
                address="721 Walker avenue, Office 200 Montréal, QC H4C 2H5",
            ),
            description="Canopeum is a park in Montreal",
            size="1000",
            research_partnership=True,
            visible_map=True,
            visitor_count=100,
            contact=Contact.objects.create(
                email="info@canopeum.com",
                phone="+1 (514) 741-5008",
                address="721 Walker avenue, Office 200 Montréal, QC H4C 2H5",
            ),
            image=Asset.objects.first(),
            announcement=Announcement.objects.create(
                body="We currently have 20000 healthy seedlings of different species, ready to be planted at any time!"
                + "Please click the link below to book your favorite seedlings on our website",
                link="https://www.canopeum-pos.com",
            ),
        )

    def create_post_conopeum_site(self):
        post = Post.objects.create(
            site=Site.objects.get(name="Canopeum"),
            body="Canopeum is a park in Montreal",
            like_count=10,
            share_count=5,
            created_at=timezone.now(),
        )
        post.media.set(Asset.objects.all())

    def create_batch(self):
        Batch.objects.create(
            name="First Batch",
            site=Site.objects.get(name="Canopeum"),
            created_at=timezone.now(),
            size=100,
            sponsor="Beslogic Inc.",
            soil_condition="Good",
            total_number_seed=100,
            total_propagation=100,
            updated_at=timezone.now(),
        )

    def create_roles(self):
        Role.objects.create(name="User")
        Role.objects.create(name="SiteManager")
        Role.objects.create(name="MegaAdmin")

    def create_users(self):
        User.objects.create_user(
            username="admin",
            email="admin@beslogic.com",
            password="Adminbeslogic!",  # noqa: S106 MOCK_PASSWORD
            is_staff=True,
            is_superuser=True,
            role=Role.objects.get(name="MegaAdmin"),
        )
        User.objects.create_user(
            username="TyrionLannister",
            email="tyrion@lannister.com",
            password="tyrion123",  # noqa: S106 MOCK_PASSWORD
            role=Role.objects.get(name="SiteManager"),
        )
        User.objects.create_user(
            username="DaenerysTargaryen",
            email="daenerys@targaryen.com",
            password="daenerys123",  # noqa: S106 MOCK_PASSWORD
            role=Role.objects.get(name="SiteManager"),
        )
        User.objects.create_user(
            username="JonSnow",
            email="jon@snow.com",
            password="jon123",  # noqa: S106 MOCK_PASSWORD
            role=Role.objects.get(name="SiteManager"),
        )
        User.objects.create_user(
            username="OberynMartell",
            email="oberyn@martell.com",
            password="oberyn123",  # noqa: S106 MOCK_PASSWORD
            role=Role.objects.get(name="User"),
        )
        User.objects.create_user(
            username="NormalUser",
            email="normal@user.com",
            password="normal123",  # noqa: S106 MOCK_PASSWORD
            role=Role.objects.get(name="User"),
        )

    def create_siteadmins(self):
        Siteadmin.objects.create(
            user=User.objects.get(email="tyrion@lannister.com"),
            site=Site.objects.get(name="Canopeum"),
        )
        Siteadmin.objects.create(
            user=User.objects.get(email="daenerys@targaryen.com"),
            site=Site.objects.get(name="Canopeum"),
        )
