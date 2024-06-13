CREATE TABLE `Image` (
  `id` integer PRIMARY KEY,
  `path` url
);

CREATE TABLE `SiteType_Internationalization` (
  `id` integer PRIMARY KEY,
  `EN` text,
  `FR` text
);

CREATE TABLE `SiteType` (
  `id` integer PRIMARY KEY,
  `name_id` interger REFERENCES `SiteType_Internationalization` (`id`)
);

CREATE TABLE `Announcement` (
  `id` integer PRIMARY KEY,
  `body` text,
  `link` url
);

CREATE TABLE `Contact` (
  `id` integer PRIMARY KEY,
  `adress` text,
  `email` text,
  `phone` text,
  `facebook_link` url,
  `x_link` url,
  `instagram_link` url,
  `linkedin_link` url
);

CREATE TABLE `Coordinate` (
  `id` integer PRIMARY KEY,
  `dms_latitude` text,
  `dms_longitude` text,
  `dd_latitude` double,
  `dd_longitude` double,
  `address` text
);

CREATE TABLE `Site` (
  `id` integer PRIMARY KEY,
  `name` text,
  `site_type_id` integer REFERENCES `SiteType` (`id`),
  `image_id` integer REFERENCES `Image` (`id`),
  `coordinate_id` integer REFERENCES `Coordinate` (`id`),
  `description` text,
  `size` double,
  `research_partnership` boolean,
  `visible_map` boolean,
  `contact_id` integer REFERENCES `Contact` (`id`),
  `announcement_id` integer REFERENCES `Announcement` (`id`)
);

CREATE TABLE `Post` (
  `id` integer PRIMARY KEY,
  `site_id` integer REFERENCES `Site` (`id`),
  `body` text,
  `like_count` integer,
  `created_at` timestamp
);

CREATE TABLE `PostImage` (
  `image_id` integer REFERENCES `Image` (`id`),
  `post_id` integer REFERENCES `Post` (`id`)
);

CREATE TABLE `SiteImage` (
  `image_id` integer REFERENCES `Image` (`id`),
  `site_id` integer REFERENCES `Site` (`id`)
);

CREATE TABLE `Comment` (
  `id` integer PRIMARY KEY,
  `body` text,
  `created_at` timestamp,
  `auth_user_id` integer REFERENCES `auth_user` (`id`),
  `post_id` integer REFERENCES `Post` (`id`)
);

CREATE TABLE `SiteAdmin` (
  `auth_user_id` integer REFERENCES `auth_user` (`id`),
  `site_id` integer REFERENCES `Site` (`id`)
);

CREATE TABLE `Batch` (
  `id` integer PRIMARY KEY,
  `site_id` integer REFERENCES `Site` (`id`),
  `created_at` timestamp,
  `name` text,
  `sponsor` text,
  `size` double,
  `soil_condition` text,
  `plant_count` integer,
  `survived_count` integer,
  `replace_count` integer,
  `total_number_seed` integer,
  `total_propagation` integer,
  `image_id` integer REFERENCES `Image` (`id`),
);

CREATE TABLE `Widget` (
  `id` integer PRIMARY KEY,
  `site_id` integer REFERENCES `Site` (`id`),
  `title` text,
  `body` text
);

CREATE TABLE `FertilizerType_Internationalization` (
  `id` integer PRIMARY KEY,
  `EN` text,
  `FR` text
);

CREATE TABLE `FertilizerType` (
  `id` integer PRIMARY KEY,
  `name_id` integer REFERENCES `FertilizerType_Internationalization` (`id`)
);

CREATE TABLE `BatchFertilizer` (
  `batch_id` integer REFERENCES `Batch` (`id`),
  `fertilizer_type_id` integer REFERENCES `FertilizerType` (`id`)
);

CREATE TABLE `MulchLayerType_Internationalization` (
  `id` integer PRIMARY KEY,
  `EN` text,
  `FR` text
);

CREATE TABLE `MulchLayerType` (
  `id` integer PRIMARY KEY,
  `name_id` integer REFERENCES `MulchLayerType_Internationalization` (`id`)
);

CREATE TABLE `BatchMulchLayer` (
  `batch_id` integer REFERENCES `Batch` (`id`),
  `mulch_layer_type_id` integer REFERENCES `MulchLayerType` (`id`)
);

CREATE TABLE `TreeSpeciesType_Internationalization` (
  `id` integer PRIMARY KEY,
  `EN` text,
  `FR` text
);

CREATE TABLE `TreeType` (
  `id` integer PRIMARY KEY,
  `name_id` integer REFERENCES `TreeSpeciesType_Internationalization` (`id`)
);

CREATE TABLE `SiteTreeSpecies` (
  `site_id` integer REFERENCES `Site` (`id`),
  `tree_type_id` integer REFERENCES `TreeType` (`id`),
  `quantity` integer
);

CREATE TABLE `BatchTreeType` (
  `batch_id` integer REFERENCES `Batch` (`id`),
  `tree_type_id` integer REFERENCES `TreeType` (`id`),
  `quantity` integer
);
