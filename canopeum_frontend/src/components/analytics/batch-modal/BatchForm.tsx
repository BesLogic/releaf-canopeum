/* eslint-disable max-lines -- disable max-lines */
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import FertilizersSelector from '@components/analytics/FertilizersSelector'
import ImageUpload from '@components/analytics/ImageUpload'
import MulchLayersSelector from '@components/analytics/MulchLayersSelector'
import SupportSpeciesSelector from '@components/analytics/SupportSpeciesSelector'
import TreeSpeciesSelector from '@components/analytics/TreeSpeciesSelector'
import { DEFAULT_BATCH_FORM_DTO } from '@constants/batchForm.constant'
import { type BatchDetail, type FertilizerType, type MulchLayerType, Seeds, Species, type TreeType } from '@services/api'
import { getApiBaseUrl } from '@services/apiSettings'
import { floorNumberValue } from '@utils/formUtils'

type Props = {
  readonly initialBatch?: BatchDetail,
  readonly handleBatchChange: (batchFormDto: BatchFormDto) => void,
}

const transformToEditBatchDto = (batchDetail: BatchDetail) => ({
  ...batchDetail,
  siteId: batchDetail.site,
  seeds: batchDetail.seeds.map(batchSeed =>
    new Seeds({ id: batchSeed.treeType.id, quantity: batchSeed.quantity })
  ),
  species: batchDetail.species.map(batchSpecies =>
    new Species({ id: batchSpecies.treeType.id, quantity: batchSpecies.quantity })
  ),
  sponsorName: batchDetail.sponsor.name,
  sponsorWebsiteUrl: batchDetail.sponsor.url,
  sponsorLogo: undefined,
  image: undefined,
})

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

const BatchForm = ({ handleBatchChange, initialBatch }: Props) => {
  const { t } = useTranslation()

  const [batch, setBatch] = useState<BatchFormDto>(DEFAULT_BATCH_FORM_DTO)
  const [batchImageURL, setBatchImageURL] = useState<string>()
  const [sponsorLogoUrl, setSponsorLogoUrl] = useState<string>()

  useEffect(() => {
    if (!initialBatch) return

    setBatch(transformToEditBatchDto(initialBatch))
    setSponsorLogoUrl(`${getApiBaseUrl()}${initialBatch.sponsor.logo.asset}`)

    if (!initialBatch.image) return

    setBatchImageURL(`${getApiBaseUrl()}${initialBatch.image.asset}`)
  }, [initialBatch])

  useEffect(() => handleBatchChange(batch), [batch, handleBatchChange])

  const onImageUpload = (file: File) => {
    setBatch(value => ({ ...value, image: file }))
    setBatchImageURL(URL.createObjectURL(file))
  }

  const onSponsorLogoUpload = (file: File) => {
    setBatch(value => ({
      ...value,
      sponsorLogo: file,
    }))
    setSponsorLogoUrl(URL.createObjectURL(file))
  }

  return (
    <form>
      <div className='d-flex flex-column gap-3'>
        <div>
          <label className='form-label' htmlFor='batch-name'>
            {t('analyticsSite.batch-modal.name-label')}
          </label>
          <input
            className='form-control'
            id='batch-name'
            onChange={event => setBatch(value => ({ ...value, name: event.target.value }))}
            type='text'
            value={batch.name}
          />
        </div>

        <div>
          <label className='form-label text-capitalize' htmlFor='sponsor-name'>
            {t('analyticsSite.batch-modal.sponsor-name-label')}
          </label>
          <input
            className='form-control'
            id='sponsor-name'
            onChange={event => setBatch(value => ({ ...value, sponsorName: event.target.value }))}
            type='text'
            value={batch.sponsorName}
          />
        </div>

        <div>
          <label className='form-label text-capitalize' htmlFor='sponsor-website-url'>
            {t('analyticsSite.batch-modal.sponsor-website-url-label')}
          </label>
          <input
            className='form-control'
            id='sponsor-website-url'
            onChange={event =>
              setBatch(value => ({ ...value, sponsorWebsiteUrl: event.target.value }))}
            type='text'
            value={batch.sponsorWebsiteUrl}
          />
        </div>

        <div>
          <label className='form-label text-capitalize' htmlFor='sponsor-logo'>
            {t('analyticsSite.batch-modal.sponsor-logo-label')}
          </label>
          <ImageUpload
            id='batch-sponsor-logo-upload'
            imageUrl={sponsorLogoUrl}
            onChange={onSponsorLogoUpload}
          />
        </div>

        <div>
          <label className='form-label text-capitalize' htmlFor='size'>
            {t('analyticsSite.batch-modal.size-label')}
          </label>
          <div className='input-group'>
            <input
              className='form-control'
              id='size'
              min={0}
              onChange={event =>
                setBatch(value => ({
                  ...value,
                  size: Number.parseInt(event.target.value, 10),
                }))}
              type='number'
              value={floorNumberValue(batch.size)}
            />
            <span className='input-group-text'>
              {t('analyticsSite.batch-modal.feet-squared')}
            </span>
          </div>
        </div>

        <div>
          <TreeSpeciesSelector
            label='analyticsSite.batch-modal.number-of-trees-label'
            onChange={useCallback(
              species =>
                setBatch(current => ({
                  ...current,
                  species,
                })),
              [],
            )}
            species={batch.species}
          />
        </div>

        <div>
          <label className='form-label' htmlFor='soil-condition'>
            {t('analyticsSite.batch-modal.soil-condition-label')}
          </label>
          <input
            className='form-control'
            id='soil-condition'
            onChange={event => setBatch(value => ({ ...value, soilCondition: event.target.value }))}
            type='text'
            value={batch.soilCondition}
          />
        </div>

        <FertilizersSelector
          fertilizers={batch.fertilizers}
          onChange={useCallback(
            fertilizers =>
              setBatch(current => ({
                ...current,
                fertilizers,
              })),
            [],
          )}
        />

        <MulchLayersSelector
          mulchLayers={batch.mulchLayers}
          onChange={useCallback(
            mulchLayers =>
              setBatch(current => ({
                ...current,
                mulchLayers,
              })),
            [],
          )}
        />

        <SupportSpeciesSelector
          onChange={useCallback(
            supportedSpecies =>
              setBatch(current => ({
                ...current,
                supportedSpecies,
              })),
            [],
          )}
          species={batch.supportedSpecies}
        />

        <div>
          <label className='form-label text-capitalize' htmlFor='total-number-of-plants'>
            {t('analyticsSite.batch-modal.total-number-of-plants-label')}
          </label>
          <input
            className='form-control'
            id='total-number-of-plants'
            onChange={event =>
              setBatch(value => ({
                ...value,
                plantCount: Number.parseInt(event.target.value, 10),
              }))}
            type='number'
            value={floorNumberValue(batch.plantCount)}
          />
        </div>

        <div>
          <label className='form-label text-capitalize' htmlFor='survived'>
            {t('analyticsSite.batch-modal.survived-label')}
          </label>
          <input
            className='form-control'
            id='survived'
            onChange={event =>
              setBatch(value => ({
                ...value,
                survivedCount: Number.parseInt(event.target.value, 10),
              }))}
            type='number'
            value={floorNumberValue(batch.survivedCount)}
          />
        </div>

        <div>
          <label className='form-label text-capitalize' htmlFor='replaced'>
            {t('analyticsSite.batch-modal.replaced-label')}
          </label>
          <input
            className='form-control'
            id='replaced'
            onChange={event =>
              setBatch(value => ({
                ...value,
                replaceCount: Number.parseInt(event.target.value, 10),
              }))}
            type='number'
            value={floorNumberValue(batch.replaceCount)}
          />
        </div>

        <div>
          <TreeSpeciesSelector
            label='analyticsSite.batch-modal.seeds-per-species-label'
            onChange={useCallback(
              species =>
                setBatch(current => ({
                  ...current,
                  seeds: species,
                })),
              [],
            )}
            species={batch.seeds}
          />
        </div>

        <div>
          <label className='form-label text-capitalize' htmlFor='totalNumberSeed'>
            {t('analyticsSite.batch-modal.total-seeds-label')}
          </label>
          <input
            className='form-control'
            id='totalNumberSeed'
            onChange={event =>
              setBatch(value => ({
                ...value,
                totalNumberSeed: Number.parseInt(event.target.value, 10),
              }))}
            type='number'
            value={floorNumberValue(batch.totalNumberSeed)}
          />
        </div>

        <div>
          <label className='form-label text-capitalize' htmlFor='propagation'>
            {t('analyticsSite.batch-modal.propagation-label')}
          </label>
          <input
            className='form-control'
            id='propagation'
            onChange={event =>
              setBatch(value => ({
                ...value,
                totalPropagation: Number.parseInt(event.target.value, 10),
              }))}
            type='number'
            value={floorNumberValue(batch.totalPropagation)}
          />
        </div>

        <div className='mb-3'>
          <label className='form-label text-capitalize' htmlFor='batch-image'>
            {t('analyticsSite.batch-modal.images-label')}
          </label>
          <ImageUpload id='batch-image-upload' imageUrl={batchImageURL} onChange={onImageUpload} />
        </div>
      </div>
    </form>
  )
}

export default BatchForm
