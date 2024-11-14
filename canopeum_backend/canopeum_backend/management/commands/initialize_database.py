# flake8: noqa: S311 -- Accept random int generation for database seeding

import random
from collections.abc import Iterable
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
    BatchSponsor,
    Comment,
    Contact,
    Coordinate,
    Fertilizertype,
    Internationalization,
    Mulchlayertype,
    Post,
    Role,
    Site,
    Siteadmin,
    Sitetreespecies,
    Sitetype,
    Treetype,
    User,
)

seeding_images_path = (
    Path(canopeum_backend.settings.BASE_DIR) / "canopeum_backend" / "seeding" / "images"
)

tree_type_names = (
    ("Balsam Fir", "Sapin baumier"),
    ("Black Maple", "Érable noir"),
    ("Red Maple", "Érable rouge"),
    ("Silver Maple", "Érable argenté"),
    ("Sugar Maple", "Érable à sucre"),
    ("Ohio Buckeye", "Marronnier d'Ohio"),
    ("Speckled Alder", "Aulne tacheté"),
    ("Green Alder", "Aulne vert"),
    ("Serviceberries", "Amélanchier"),
    ("Black Chokeberry", "Aronie noire"),
    ("Yellow Birch", "Bouleau jaune"),
    ("White Birch", "Bouleau blanc"),
    ("Gray Birch", "Bouleau gris"),
    ("Blue Beech", "Hêtre bleu"),
    ("Bitternut Hickory", "Noyer amer"),
    ("Pignut Hickory", "Noyer des montagnes"),
    ("Big Shellbark Hickory", "Noyer à gros fruits"),
    ("Shagbark Hickory", "Noyer à écorce shaggy"),
    ("American Bittersweet", "Morelle d'Amérique"),
    ("Northern Hackberry", "Micocoulier occidental"),
    ("Buttonbush", "Céphalanthère occidentale"),
    ("Redbud", "Gainier de Virginie"),
    ("Alternate-leaf Dogwood", "Cornouiller à feuilles alternes"),
    ("Silky Dogwood", "Cornouiller soyeux"),
    ("Flowering Dogwood", "Cornouiller à fleurs"),
    ("Gray Dogwood", "Cornouiller gris"),
    ("Redosier Dogwood", "Cornouiller stolonifère"),
    ("American Hazelnut", "Noisetier d'Amérique"),
    ("Beaked Hazel", "Coudrier à bec"),
    ("Hawthorns", "Aubépines"),
    ("Bush Honeysuckle", "Chèvrefeuille arbustif"),
    ("American Beech", "Hêtre d'Amérique"),
    ("White Ash", "Frêne blanc"),
    ("Black Ash", "Frêne noir"),
    ("Green/ Red Ash", "Frêne vert/rouge"),
    ("Pumpkin Ash", "Frêne citrouille"),
    ("Blue Ash", "Frêne bleu"),
    ("Honey Locust", "Faux-acacia"),
    ("Kentucky Coffeetree", "Gymnocladus de Kentucky"),
    ("Witch-Hazel", "Hamamélis de Virginie"),
    ("Winterberry", "Houx d'hiver"),
    ("Butternut", "Noyer cendré"),
    ("Black Walnut", "Noyer noir"),
    ("Common Juniper", "Genévrier commun"),
    ("Eastern Red Cedar", "Genévrier rouge de l'Est"),
    ("Tamarac", "Mélèze laricin"),
    ("Spicebush", "Lindera à feuilles opposées"),
    ("Tulip-Tree", "Tulipier de Virginie"),
    ("Cucumber-Tree", "Magnolia concombre"),
    ("Sweetgale", "Myrica gale"),
    ("Black Gum", "Nyssa sylvatica"),
    ("Ironwood", "Ostryer de Virginie"),
    ("Virginia Creeper", "Vigne vierge"),
    ("Ninebark", "Physocarpe"),
    ("White Spruce", "Épinette blanche"),
    ("Black Spruce", "Épinette noire"),
    ("Red Spruce", "Épinette rouge"),
    ("Jack Pine", "Pin gris"),
    ("Red Pine", "Pin rouge"),
    ("Pitch Pine", "Pin rigide"),
    ("Eastern White Pine", "Pin blanc de l'Est"),
    ("Sycamore", "Platanus occidentalis"),
    ("Eastern Cottonwood", "Peuplier baumier"),
    ("Trembling Aspen", "Peuplier faux-tremble"),
    ("American Plum", "Prunier d'Amérique"),
    ("Pin Cherry", "Cerisier de Pennsylvanie"),
    ("Black Cherry", "Cerisier noir"),
    ("Eastern Choke Cherry", "Cerisier de Virginie"),
    ("Hoptree", "Ptelea trifoliata"),
    ("White Oak", "Chêne blanc"),
    ("Swamp White Oak", "Chêne blanc des marais"),
    ("Bur Oak", "Chêne bur"),
    ("Chinquapin Oak", "Chêne chinkapin"),
    ("Pin Oak", "Chêne à pin"),
    ("Red Oak", "Chêne rouge"),
    ("Shumard Oak", "Chêne de Shumard"),
    ("Black Oak", "Chêne noir"),
    ("Fragrant Sumac", "Sumac aromatique"),
    ("Shining Sumac", "Sumac brillant"),
    ("Staghorn Sumac", "Sumac vinaigrier"),
    ("Purple-flowering Raspberry", "Ronce pourpre"),
    ("Roses", "Roses"),
    ("Willows", "Saules"),
    ("Black Elderberry", "Sureau noir"),
    ("Red Elderberry", "Sureau rouge"),
    ("Sassafras", "Sassafras"),
    ("American Mountain Ash", "Sorbier d'Amérique"),
    ("Showy Mountain Ash", "Sorbier remarquable"),
    ("Narrow-leaved Meadowsweet", "Reine-des-prés à feuilles étroites"),
    ("Snowberry", "Symphorine"),
    ("White Cedar", "Thuya occidental"),
    ("Basswood", "Tilleul d'Amérique"),
    ("Eastern Hemlock", "Pruche de l'Est"),
    ("American Elm", "Orme d'Amérique"),
    ("Slippery Elm", "Orme glissant"),
    ("Nannyberry", "Viorne à feuilles de viorne"),
    ("American Highbush Cranberry", "Viorne trilobée"),
)


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
    total_tree_types = len(tree_type_names)

    # Ensure num_species is not greater than the total number
    # of tree types available to avoid an infinite loop
    num_species = min(num_species, total_tree_types)

    used_tree_ids = set()
    for _ in range(num_species):
        while True:
            tree_type_id = random.randint(1, total_tree_types)
            if tree_type_id not in used_tree_ids:
                used_tree_ids.add(tree_type_id)
                break
        BatchSpecies.objects.create(
            batch=batch,
            tree_type=Treetype.objects.get(pk=tree_type_id),
            quantity=random.randint(1, 100),
        )


batch_names = (
    "First Batch",
    "Second Batch",
    "Third Batch",
    "Fourth Batch",
    "Fifth Batch",
    "Sixth Batch",
    "Seventh Batch",
    "Eight Batch",
)

sponsor_names = [
    "Green Earth Initiative",
    "EcoRoots Corporation",
    "Sustainable Growth Group",
    "Forest Futures Fund",
    "Green Horizons Alliance",
    "Tree of Life Foundation",
    "Evergreen Solutions",
    "Leaf Legacy Group",
    "Planet Guardians Inc.",
    "Roots of Tomorrow",
    "Nature's Canopy Collective",
    "Oxygen for All Co.",
    "Verdant Ventures",
    "ForestFlow Enterprises",
    "Seedling Sustainability Co.",
    "Pure Green Partners",
    "Branch Out Initiative",
    "Nature Nurturers",
    "Earthwise Ecosystems",
    "Renewed Forest Foundation",
    "EcoSphere Solutions",
    "TreeMendously Green",
    "Reforest Co.",
    "Grow Green Initiative",
    "Earthshade Sponsors",
    "GreenBreathe Fund",
    "Flourishing Forest Foundation",
    "Sapling Supporters Co.",
    "Global Green Guardians",
    "Woodland Warriors",
    "Sprout Sponsors",
    "Evergreen Tomorrow Foundation",
    "Roots & Shoots Initiative",
    "TreeTop Trust",
    "LeafLife Partners",
    "The Canopy Collective",
    "EcoLeaf Sponsorship",
    "Pure Planet Patrons",
    "Oxygen Origins Fund",
    "The GreenWay Project",
    "TreeTrail Trust",
    "ThriveGreen Group",
    "ForestFront Alliance",
    "ReTree Sponsors",
    "EcoPledge Foundation",
    "Verdant Visions Fund",
    "BranchRoots Collective",
    "PlanetGreen Partnerships",
    "SustainSeed Co.",
    "NatureSprout Network",
    "GreenFuture Trust",
    "TreeLife Alliance",
]


def create_sponsor_for_batch():
    image_file_name = f"batch_logo{random.randint(1, 7)}.png"

    with Path.open(seeding_images_path / image_file_name, "rb") as img_file:
        django_file = File(img_file)

        asset = Asset()
        asset.asset.save(image_file_name, django_file, save=True)

        return BatchSponsor.objects.create(
            name=sponsor_names.pop(random.randint(0, len(sponsor_names) - 1)),
            url="https://uilogos.co/",
            logo=asset,
        )


def create_species_for_site(site: Site, batches: Iterable[Batch]):
    already_added_tree_type: dict[int, Sitetreespecies] = {}
    for batch in batches:
        for batch_specie in BatchSpecies.objects.filter(batch=batch):
            quantity = batch_specie.quantity
            # Add more to the site's quantity than the batches' quantity
            # so they don't appear at 100%. Except Canopeum, let's use it as a 100% example
            if site.name != "Canopeum":
                quantity += random.randint(0, 50)
            if batch_specie.tree_type.pk in already_added_tree_type:
                site_tree_specie = already_added_tree_type[batch_specie.tree_type.pk]
                site_tree_specie.quantity += quantity
                site_tree_specie.save()
            else:
                site_tree_specie = Sitetreespecies.objects.create(
                    site=site, tree_type=batch_specie.tree_type, quantity=quantity
                )
                already_added_tree_type[batch_specie.tree_type.pk] = site_tree_specie


def create_batches_for_site(site):
    num_batches = random.randint(3, 8)
    for i in range(num_batches):
        number_of_seed = random.randint(50, 200)
        survived_count = random.randint(100, 200)
        replace_count = random.randint(0, 50)

        sponsor = create_sponsor_for_batch()

        batch = Batch.objects.create(
            name=batch_names[i - 1],
            site=site,
            size=random.randint(20, 150),
            sponsor=sponsor,
            soil_condition="Good",
            survived_count=survived_count,
            replace_count=replace_count,
            total_propagation=random.randint(0, number_of_seed),
        )
        create_batch_species_for_batch(batch)
        fertilizer_type = Fertilizertype.objects.first()
        if fertilizer_type is not None:
            Batchfertilizer.objects.create(
                batch=batch,
                fertilizer_type=fertilizer_type,
            )
        yield batch


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

        self.create_sites()

        self.create_siteadmins()
        self.stdout.write(self.style.SUCCESS("Data Generated"))

    def create_fertilizer_types(self):
        fertilizer_type_names = (
            ("Synthetic", "Synthétique"),
            ("Inoculant", "Inoculant"),
            ("Organic compost", "Compost organique"),
            ("Manure", "Fumier"),
            ("Bone meal", "Farine d'os"),
            ("Fish emulsion", "Émulsion de poisson"),
            ("Blood meal", "Farine de sang"),
            ("Seaweed fertilizer", "Engrais d'algues"),
            ("Bat guano", "Guano de chauve-souris"),
            ("Worm castings", "Moulée de vers"),
            ("Compost tea", "Thé de compost"),
            ("Wood ash", "Cendre de bois"),
            ("Rock phosphate", "Phosphate de roche"),
            ("Greensand", "Sable vert"),
            ("Alfalfa meal", "Farine d'alfalfa"),
            ("Cottonseed meal", "Farine de tourteau de coton"),
            ("Feather meal", "Farine de plumes"),
            ("Humic acid", "Acide humique"),
        )
        for name in fertilizer_type_names:
            Fertilizertype.objects.create(
                name=Internationalization.objects.create(en=name[0], fr=name[1])
            )

    def create_mulch_layer_types(self):
        mulch_layer_type_names = (
            ("Sheep wool", "Laine de mouton"),
            ("Cardboard", "Carton"),
            ("Compost", "Compost"),
            ("Woodchips", "Copeaux de bois"),
            ("Saw dust", "Poussière de scie"),
            ("Corn husk", "Feuille de maïs"),
        )
        for name in mulch_layer_type_names:
            Mulchlayertype.objects.create(
                name=Internationalization.objects.create(en=name[0], fr=name[1])
            )

    def create_tree_types(self):
        for name in tree_type_names:
            Treetype.objects.create(
                name=Internationalization.objects.create(en=name[0], fr=name[1])
            )

    def create_site_types(self):
        # This mapping MUST MATCH pinMap in canopeum_frontend/src/models/SiteType.ts
        site_type_names = {
            1: ("Canopeum", "Canopeum"),
            2: ("Parks", "Parcs"),
            3: ("Indigenous community", "Communauté Indigène"),
            4: ("Educational Facility", "Établissement d'enseignement"),
            5: ("Farms Land", "Terres agricoles"),
            6: ("Corporate Lot", "Lot d'entreprise"),
        }

        for site_type_id, name in site_type_names.items():
            Sitetype.objects.create(
                id=site_type_id,
                name=Internationalization.objects.create(en=name[0], fr=name[1]),
            )

    def create_assets(self):
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

    def create_sites(self):
        # Canopeum's site
        site1 = Site.objects.create(
            name="Canopeum",
            is_public=True,
            site_type=Sitetype.objects.get(id=1),
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
                phone="+1 514 741-5008",
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
        batches = create_batches_for_site(site1)
        create_species_for_site(site1, batches)
        post = Post.objects.create(
            site=site1,
            body="The season is officially started; "
            + "new plants are starting to grow and our volunteers are very dedicated!",
            share_count=5,
        )
        post.media.add(*Asset.objects.filter(asset__contains="canopeum_post_img"))
        create_posts_for_site(site1)
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
        # end of Canopeum's site

        site_2 = Site.objects.create(
            name="Maple Grove Retreat",
            is_public=True,
            site_type=Sitetype.objects.get(id=2),
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
        batches = create_batches_for_site(site_2)
        create_species_for_site(site_2, batches)
        create_posts_for_site(site_2)

        site_3 = Site.objects.create(
            name="Lakeside Oasis",
            is_public=True,
            site_type=Sitetype.objects.get(id=3),
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
        batches = create_batches_for_site(site_3)
        create_species_for_site(site_3, batches)
        create_posts_for_site(site_3)

        site_4 = Site.objects.create(
            name="Evergreen Trail",
            is_public=False,
            site_type=Sitetype.objects.get(id=4),
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
        batches = create_batches_for_site(site_4)
        create_species_for_site(site_4, batches)
        create_posts_for_site(site_4)

    def create_siteadmins(self) -> None:
        Siteadmin.objects.create(
            user=User.objects.get(email="tyrion@lannister.com"),
            site=Site.objects.get(name="Canopeum"),
        )
        Siteadmin.objects.create(
            user=User.objects.get(email="daenerys@targaryen.com"),
            site=Site.objects.get(name="Canopeum"),
        )
