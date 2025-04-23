import { type DefaultCoordinate, defaultLatitude, defaultLongitude, extractCoordinate } from '@models/Coordinate'
import type { Site} from '@services/api';
import { Species } from '@services/api'
import { fileFormatter } from '@utils/assetFormatter'

export type SiteFormDto = {
  siteName?: string,
  siteType?: number,
  siteImage?: File,
  dmsLatitude: DefaultCoordinate,
  dmsLongitude: DefaultCoordinate,
  presentation?: string,
  size?: number,
  species: Species[],
  researchPartner?: boolean,
  visibleOnMap?: boolean,
}

export const DEFAULT_SITE_FORM_DTO: SiteFormDto = {
  dmsLatitude: defaultLatitude,
  dmsLongitude: defaultLongitude,
  species: [],
  researchPartner: true,
  visibleOnMap: true,
}

export const transformToEditSiteDto = async (site: Site): Promise<SiteFormDto> => ({
  ...site,
  siteName: site.name,
  siteType: site.siteType.id,
  siteImage: await fileFormatter(site.image),
  dmsLatitude: site.coordinate.dmsLatitude
    ? extractCoordinate(site.coordinate.dmsLatitude)
    : defaultLatitude,
  dmsLongitude: site.coordinate.dmsLongitude
    ? extractCoordinate(site.coordinate.dmsLongitude)
    : defaultLongitude,
  presentation: site.description,
  size: Number(site.size),
  species: site.siteTreeSpecies.map(specie => new Species(specie)),
  researchPartner: site.researchPartnership,
  visibleOnMap: site.visibleMap,
})
