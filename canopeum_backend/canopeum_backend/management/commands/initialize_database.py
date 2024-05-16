# flake8: noqa: S311 -- Accept random int generation for database seeding

import random
from datetime import timedelta
from pathlib import Path

from django.core.files import File
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import ProgrammingError, connection
from django.utils import timezone

import canopeum_backend.settings
from canopeum_backend.models import (
    Announcement,
    Asset,
    Batch,
    Batchfertilizer,
    BatchSpecies,
    Comment,
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


def create_posts_for_site(site):
    num_posts = random.randint(4, 8)
    for _ in range(num_posts):
        # Generate a random share_count between 0 and 10
        share_count = random.randint(0, 10)

        # Create a post for the site
        post = Post.objects.create(
            site=site,
            body=f"{site.name} has planted {random.randint(100, 1000)} new trees today. "
            + "Let's continue to grow our forest!",
            share_count=share_count,
        )
        # Change created_at date since it is auto-generated on create
        # Generate a random created_at time within the last 2 months
        post.created_at = timezone.now() - timedelta(
            days=random.randint(0, 60),
            hours=random.randint(0, 12),
            minutes=random.randint(0, 55),
        )
        post.save()


def create_batch_species_for_batch(batch):
    num_species = random.randint(4, 8)
    for _ in range(num_species):
        tree_type_id = random.randint(1, len(tree_types))
        BatchSpecies.objects.create(
            batch=batch,
            tree_type=Treetype.objects.get(pk=tree_type_id),
            quantity=random.randint(1, 100),
        )


batch_names = [
    "First Batch",
    "Second Batch",
    "Third Batch",
    "Fourth Batch",
    "Fifth Batch",
    "Sixth Batch",
    "Seventh Batch",
    "Eight Batch",
]

sponsors = [
    "GreenGrow Solutions",
    "ArborWorks",
    "Evergreen Eco",
    "Rooted Reforestation",
    "TreeTech Innovations",
    "Forest Guardians",
    "LeafyLife Planting",
    "EcoArbor",
    "Sapling Services",
    "Birch & Pine Planters",
    "Foliage Force",
    "Canopy Creations",
    "GrowGreen Reforestation",
    "Woodland Warriors",
    "BranchOut Planting",
    "EcoTree Partners",
    "Grove Guardians",
    "Sustainable Sowers",
    "TimberTech Planting",
    "Nature's Nurseries",
    "GreenThumb Reforestation",
    "Forest Frontiers",
    "Arbor Alliance",
    "TreeTrek Planters",
    "RootRise Reforestation",
    "LeafLegacy Planting",
    "EcoRoot Reforestation",
    "TrunkTrack Planters",
    "WoodWise Reforestation",
    "Boreal Bloom Planters",
]


def get_sponsors():
    number_of_sponsors = random.randint(1, 5)
    random.shuffle(sponsors)
    return sponsors[:number_of_sponsors]


def get_sponsor():
    index = random.randint(0, len(sponsors) - 1)
    return sponsors[index]


def create_batches_for_site(site):
    num_batches = random.randint(3, 8)
    for i in range(num_batches):
        number_of_seed = random.randint(50, 200)
        batch = Batch.objects.create(
            name=batch_names[i - 1],
            site=site,
            created_at=timezone.now(),
            size=random.randint(20, 150),
            sponsor=get_sponsor(),
            soil_condition="Good",
            total_number_seed=number_of_seed,
            total_propagation=random.randint(0, number_of_seed),
            updated_at=timezone.now(),
        )
        create_batch_species_for_batch(batch)
        Batchfertilizer.objects.create(
            batch=batch,
            fertilizer_type=Fertilizertype.objects.first(),
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
                try:
                    for asset in assets_to_delete:
                        path = (
                            Path(canopeum_backend.settings.BASE_DIR)
                            / "canopeum_backend"
                            / "media"
                            / asset.asset.name
                        )
                        path.unlink(missing_ok=True)
                except ProgrammingError:
                    # Catch old leftover tables that can't be deleted because they don't exist
                    # This can happen if this script got interrupted in a previous run (CTRL+C)
                    # It'd be better if the query was lazy fetched so we could iter.next() every
                    # element and only skip the problematic ones. But this works too.
                    pass
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

        self.create_roles()
        self.create_users()

        self.create_canopeum_site()
        self.create_other_sites()

        self.create_siteadmins()
        self.stdout.write(self.style.SUCCESS("Data Generated"))

    def create_fertilizer_types(self):
        fertilizer_types = [["Synthetic", "Synthetique"], ["Innoculant", "Innoculant"]]
        for _ in fertilizer_types:
            Fertilizertype.objects.create(
                name=FertilizertypeInternationalization.objects.create(en=_[0], fr=_[1])
            )

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
            Mulchlayertype.objects.create(
                name=MulchlayertypeInternationalization.objects.create(en=_[0], fr=_[1])
            )

    def create_tree_types(self):
        for _ in tree_types:
            Treetype.objects.create(
                name=TreespeciestypeInternationalization.objects.create(en=_[0], fr=_[1])
            )

    def create_site_types(self):
        site_types = [
            ["Parks", "Parcs"],
            ["Indigenous community", "Communauté Indigène"],
            ["Educational Facility", "Établissement d'enseignement"],
            ["Farms Land", "Terres agricoles"],
            ["Corporate Lot", "Lot d'entreprise"],
        ]

        for _ in site_types:
            Sitetype.objects.create(
                name=SitetypeInternationalization.objects.create(en=_[0], fr=_[1])
            )

    def create_assets(self):
        seeding_images_path = (
            Path(canopeum_backend.settings.BASE_DIR) / "canopeum_backend" / "seeding" / "images"
        )
        image_file_names = (
            "site_img1.png",
            "site_img2.jpg",
            "site_img3.jpg",
            "site_img4.jpg",
            "canopeum_post_img1.jpg",
            "canopeum_post_img2.jpg",
        )
        for file_name in image_file_names:
            with Path.open(seeding_images_path / file_name, "rb") as img_file:
                django_file = File(img_file)

                asset = Asset()
                asset.asset.save(file_name, django_file, save=True)

    def create_roles(self):
        Role.objects.create(name="User")
        Role.objects.create(name="SiteManager")
        Role.objects.create(name="MegaAdmin")

    def create_users(self):
        User.objects.create_user(
            username="admin",
            email="admin@beslogic.com",
            password="Adminbeslogic!",  # noqa: S106 # MOCK_PASSWORD
            is_staff=True,
            is_superuser=True,
            role=Role.objects.get(name="MegaAdmin"),
        )
        User.objects.create_user(
            username="TyrionLannister",
            email="tyrion@lannister.com",
            password="tyrion123",  # noqa: S106 # MOCK_PASSWORD
            role=Role.objects.get(name="SiteManager"),
        )
        User.objects.create_user(
            username="DaenerysTargaryen",
            email="daenerys@targaryen.com",
            password="daenerys123",  # noqa: S106 # MOCK_PASSWORD
            role=Role.objects.get(name="SiteManager"),
        )
        User.objects.create_user(
            username="JonSnow",
            email="jon@snow.com",
            password="jon123",  # noqa: S106 # MOCK_PASSWORD
            role=Role.objects.get(name="SiteManager"),
        )
        User.objects.create_user(
            username="OberynMartell",
            email="oberyn@martell.com",
            password="oberyn123",  # noqa: S106 # MOCK_PASSWORD
            role=Role.objects.get(name="SiteManager"),
        )
        User.objects.create_user(
            username="NormalUser",
            email="normal@user.com",
            password="normal123",  # noqa: S106 # MOCK_PASSWORD
            role=Role.objects.get(name="User"),
        )

    def create_canopeum_site(self):
        site = Site.objects.create(
            name="Canopeum",
            is_public=True,
            site_type=Sitetype.objects.get(
                name=SitetypeInternationalization.objects.get(en="Parks")
            ),
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
                body="We currently have 20000 healthy seedlings of different species, "
                + "ready to be planted at any time! "
                + "Please click the link below to book your favorite seedlings on our website",
                link="https://www.canopeum-pos.com",
            ),
        )
        create_batches_for_site(site)
        post = Post.objects.create(
            site=site,
            body="The season is officially started; "
            + "new plants are starting to grow and our volunteers are very dedicated!",
            share_count=5,
            created_at=timezone.now(),
        )
        post.media.add(*Asset.objects.filter(asset__contains="canopeum_post_img"))
        create_posts_for_site(site)
        Comment.objects.create(
            body="Wow, I'm very excited to join the team!",
            user=User.objects.get(email="tyrion@lannister.com"),
            post=post,
        )
        Comment.objects.create(
            body="Thanks for helping our planet!",
            user=User.objects.get(email="normal@user.com"),
            post=post,
        )

    def create_other_sites(self):
        site_2 = Site.objects.create(
            name="Maple Grove Retreat",
            is_public=True,
            site_type=Sitetype.objects.get(
                name=SitetypeInternationalization.objects.get(en="Parks")
            ),
            coordinate=Coordinate.objects.create(
                dms_latitude="46°48'33.6\"N",
                dms_longitude="71°18'40.0\"W",
                dd_latitude=46.8093,
                dd_longitude=-71.3111,
                address="123 Forest Trail, Quebec City, QC G1P 3X4",
            ),
            description="Maple Grove Retreat is a serene escape nestled in the outskirts of "
            + "Quebec City, offering a lush forested area with scenic maple groves.",
            size="1500",
            research_partnership=True,
            visible_map=True,
            visitor_count=300,
            contact=Contact.objects.create(
                email="contact@maplegroveretreat.com",
                phone="+1 (418) 555-1234",
                address="123 Forest Trail, Quebec City, QC G1P 3X4",
            ),
            image=Asset.objects.get(asset__contains="site_img2"),
            announcement=Announcement.objects.create(
                body="Maple Grove Retreat is excited to announce our upcoming Maple Syrup "
                + "Festival! Join us on March 15th for a day of maple syrup tastings, "
                + "nature hikes, and family fun. Learn more on our website.",
                link="https://www.maplegroveretreat.com/events/maple-syrup-festival",
            ),
        )
        create_batches_for_site(site_2)
        create_posts_for_site(site_2)

        site_3 = Site.objects.create(
            name="Lakeside Oasis",
            is_public=True,
            site_type=Sitetype.objects.get(
                name=SitetypeInternationalization.objects.get(en="Parks")
            ),
            coordinate=Coordinate.objects.create(
                dms_latitude="48°36'05.0\"N",
                dms_longitude="71°18'27.0\"W",
                dd_latitude=48.6014,
                dd_longitude=-71.3075,
                address="456 Lakeview Road, Lac-Saint-Jean, QC G8M 1R9",
            ),
            description="Lakeside Oasis offers a tranquil retreat by the shores of "
            + "Lac-Saint-Jean, with pristine waters and breathtaking sunsets.",
            size="800",
            research_partnership=False,
            visible_map=True,
            visitor_count=150,
            contact=Contact.objects.create(
                email="info@lakesideoasis.com",
                phone="+1 (418) 555-5678",
                address="456 Lakeview Road, Lac-Saint-Jean, QC G8M 1R9",
            ),
            image=Asset.objects.get(asset__contains="site_img3"),
            announcement=Announcement.objects.create(
                body="Escape to Lakeside Oasis! "
                + "Our cozy cabins are now open for winter bookings. "
                + "Enjoy ice fishing, snowshoeing, and warm campfires by the lake. "
                + "Book your stay today!",
                link="https://www.lakesideoasis.com/winter-getaway",
            ),
        )
        create_batches_for_site(site_3)
        create_posts_for_site(site_3)

        site_4 = Site.objects.create(
            name="Evergreen Trail",
            is_public=False,
            site_type=Sitetype.objects.get(
                name=SitetypeInternationalization.objects.get(en="Parks")
            ),
            coordinate=Coordinate.objects.create(
                dms_latitude="46°12'30.0\"N",
                dms_longitude="74°35'30.0\"W",
                dd_latitude=46.2083,
                dd_longitude=-74.5917,
                address="789 Trailhead Way, Mont-Tremblant, QC J8E 1T7",
            ),
            description="Evergreen Trail invites you to explore the rugged beauty of "
            + "Mont-Tremblant's wilderness, with winding trails and majestic evergreen forests.",
            size="1200",
            research_partnership=True,
            visible_map=True,
            visitor_count=200,
            contact=Contact.objects.create(
                email="explore@evergreentrail.com",
                phone="+1 (819) 555-9876",
                address="789 Trailhead Way, Mont-Tremblant, QC J8E 1T7",
            ),
            image=Asset.objects.get(asset__contains="site_img4"),
            announcement=Announcement.objects.create(
                body="Discover the wonders of Evergreen Trail! "
                + "Our guided nature walks are now available every weekend. "
                + "Immerse yourself in nature and learn about the diverse "
                + "flora and fauna of Mont-Tremblant.",
                link="https://www.evergreentrail.com/guided-walks",
            ),
        )
        create_batches_for_site(site_4)
        create_posts_for_site(site_4)

    def create_siteadmins(self):
        Siteadmin.objects.create(
            user=User.objects.get(email="tyrion@lannister.com"),
            site=Site.objects.get(name="Canopeum"),
        )
        Siteadmin.objects.create(
            user=User.objects.get(email="daenerys@targaryen.com"),
            site=Site.objects.get(name="Canopeum"),
        )
