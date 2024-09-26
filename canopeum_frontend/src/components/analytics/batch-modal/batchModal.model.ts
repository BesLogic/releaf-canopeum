import { type BatchDetail, type FertilizerType, type MulchLayerType, Seeds, Species, type TreeType } from '@services/api'

export type BatchFormDto = {
  siteId: number,
  name?: string,
  sponsorName?: string,
  sponsorWebsiteUrl?: string,
  sponsorLogo?: File,
  size?: number,
  soilCondition?: string,
  plantCount?: number,
  survivedCount?: number,
  replaceCount?: number,
  totalNumberSeed?: number,
  totalPropagation?: number,
  image?: File,
  fertilizers: FertilizerType[],
  mulchLayers: MulchLayerType[],
  seeds: Seeds[],
  species: Species[],
  supportedSpecies: TreeType[],
}

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

export const transformToEditBatchDto = (batchDetail: BatchDetail): BatchFormDto => ({
  ...batchDetail,
  siteId: batchDetail.site,
  seeds: batchDetail.seeds.map(batchSeed =>
    new Seeds({ id: batchSeed.treeType.id, quantity: batchSeed.quantity })
  ),
  species: batchDetail.species.map(batchSpecies =>
    new Species({ id: batchSpecies.treeType.id, quantity: batchSpecies.quantity })
  ),
  image: undefined,
})
