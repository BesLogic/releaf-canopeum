import type { BatchFormDto } from '@components/analytics/batch-modal/BatchForm'

export const DEFAULT_BATCH_FORM_DTO: BatchFormDto = {
  siteId: 0,
  name: undefined,
  size: undefined,
  soilCondition: undefined,
  sponsorName: undefined,
  sponsorWebsiteUrl: undefined,
  sponsorLogo: undefined,
  supportedSpecies: [],
  plantCount: undefined,
  survivedCount: undefined,
  replaceCount: undefined,
  totalNumberSeed: undefined,
  totalPropagation: undefined,
  image: undefined,
  fertilizers: [],
  mulchLayers: [],
  seeds: [],
  species: [],
}
