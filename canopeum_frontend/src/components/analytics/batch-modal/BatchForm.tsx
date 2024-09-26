import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { type BatchFormDto, DEFAULT_BATCH_FORM_DTO, transformToEditBatchDto } from '@components/analytics/batch-modal/batchModal.model'
import FertilizersSelector from '@components/analytics/FertilizersSelector'
import ImageUpload from '@components/analytics/ImageUpload'
import MulchLayersSelector from '@components/analytics/MulchLayersSelector'
import SupportSpeciesSelector from '@components/analytics/SupportSpeciesSelector'
import TreeSpeciesSelector from '@components/analytics/TreeSpeciesSelector'
import type { BatchDetail } from '@services/api'
import { getApiBaseUrl } from '@services/apiSettings'
import { floorNumberValue } from '@utils/formUtils'

type Props = {
  readonly initialBatch?: BatchDetail,
  readonly handleBatchChange: (batchFormDto: BatchFormDto) => void,
}

const BatchForm = ({ handleBatchChange, initialBatch }: Props) => {
  const { t } = useTranslation()

  const [batch, setBatch] = useState<BatchFormDto>(DEFAULT_BATCH_FORM_DTO)
  const [batchImageURL, setBatchImageURL] = useState<string>()

  useEffect(() => {
    if (!initialBatch) return

    setBatch(transformToEditBatchDto(initialBatch))

    if (!initialBatch.image) return

    setBatchImageURL(`${getApiBaseUrl()}${initialBatch.image.asset}`)
  }, [initialBatch])

  useEffect(() => handleBatchChange(batch), [batch, handleBatchChange])

  const onImageUpload = (file: File) => {
    setBatch(value => ({ ...value, image: file }))
    setBatchImageURL(URL.createObjectURL(file))
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
