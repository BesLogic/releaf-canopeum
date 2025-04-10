import { type BatchDetail, type FertilizerType, type MulchLayerType, Seeds, Species, type TreeType } from '@services/api'
import { fileFormatter } from '@utils/assetFormatter'

export type BatchFormDto = {
  siteId: number,
  name?: string,
  sponsor?: {
    name?: string,
    url?: string,
    logo?: File,
  },
  size?: number,
  soilCondition?: string,
  plantCount: number,
  survivedCount?: number,
  replaceCount?: number,
  totalNumberSeeds: number,
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
  sponsor: {
    name: undefined,
    url: undefined,
    logo: undefined,
  },
  supportedSpecies: [],
  plantCount: 0,
  survivedCount: undefined,
  replaceCount: undefined,
  totalNumberSeeds: 0,
  totalPropagation: undefined,
  image: undefined,
  fertilizers: [],
  mulchLayers: [],
  seeds: [],
  species: [],
}

export const transformToEditBatchDto = async (batchDetail: BatchDetail): Promise<BatchFormDto> => ({
  ...batchDetail,
  siteId: batchDetail.site,
  seeds: batchDetail.seeds.map(batchSeed =>
    new Seeds({ id: batchSeed.treeType.id, quantity: batchSeed.quantity })
  ),
  species: batchDetail.species.map(batchSpecies =>
    new Species({ id: batchSpecies.treeType.id, quantity: batchSpecies.quantity })
  ),
  sponsor: {
    name: batchDetail.sponsor.name,
    url: batchDetail.sponsor.url,
    logo: await fileFormatter(batchDetail.sponsor.logo),
  },
  image: undefined,
})
