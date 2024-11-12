// This mapping MUST MATCH site_type_names in
// canopeum_backend/canopeum_backend/management/commands/initialize_database.py
const SITE_TYPE_ID_TO_ICON_KEY = {
  1: 'eco', // Canopeum // TODO: Update to proper icon
  2: 'forest', // Parks
  3: 'workspaces', // Indigenous community
  4: 'school', // Educational Facility
  5: 'psychiatry', // Farms Land // TODO: Update to proper icon
  6: 'source_environment', // Corporate Lot
} as const
export const getSiteTypeIconKey = (siteTypeId: number): SiteTypeIconKey => {
  const iconKey = SITE_TYPE_ID_TO_ICON_KEY[siteTypeId as SiteTypeID]
  /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  -- Additional runtime safety */
  if (!iconKey) {
    throw new RangeError(`${siteTypeId} is not a known site type ID`)
  }

  return iconKey
}
export type SiteTypeID = keyof typeof SITE_TYPE_ID_TO_ICON_KEY
export type SiteTypeIconKey = typeof SITE_TYPE_ID_TO_ICON_KEY[SiteTypeID]
export const SITE_TYPE_ICON_KEYS = Object.values(SITE_TYPE_ID_TO_ICON_KEY)
export const SITE_TYPE_IDS = Object.keys(SITE_TYPE_ID_TO_ICON_KEY).map(Number) as SiteTypeID[]
