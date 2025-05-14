import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { type BatchFormDto, DEFAULT_BATCH_FORM_DTO, transformToEditBatchDto } from '@components/analytics/batch-modal/batchModal.model'
import FertilizersSelector from '@components/analytics/FertilizersSelector'
import ImageUpload from '@components/analytics/ImageUpload'
import MulchLayersSelector from '@components/analytics/MulchLayersSelector'
import SupportSpeciesSelector from '@components/analytics/SupportSpeciesSelector'
import TreeSpeciesSelector from '@components/analytics/TreeSpeciesSelector'
import AssetGrid from '@components/assets/AssetGrid'
import { Asset, type BatchDetail } from '@services/api'
import { mapSum } from '@utils/arrayUtils'
import { floorNumberValue } from '@utils/formUtils'

type Props = {
  readonly initialBatch?: BatchDetail,
  readonly handleBatchChange: (batchFormDto: BatchFormDto) => void,
}

const BatchForm = ({ handleBatchChange, initialBatch }: Props) => {
  const { t } = useTranslation()

  const [batch, setBatch] = useState<BatchFormDto>(DEFAULT_BATCH_FORM_DTO)
  const [sponsorLogoUrl, setSponsorLogoUrl] = useState<string>()

  useEffect(
    () =>
      void initBatch().catch(() =>
        console.error('Oops an error occured during initialization the batch')
      ),
    [initialBatch],
  )

  const initBatch = async () => {
    if (!initialBatch) return
    const batchDto = await transformToEditBatchDto(initialBatch)
    setBatch(batchDto)
    if (batchDto.sponsor?.logo) {
      setSponsorLogoUrl(URL.createObjectURL(batchDto.sponsor.logo))
    }
  }

  useEffect(() => handleBatchChange(batch), [batch, handleBatchChange])

  const onSponsorLogoUpload = (file: File) => {
    setBatch(value => ({
      ...value,
      sponsor: {
        ...value.sponsor,
        logo: file,
      },
    }))
    setSponsorLogoUrl(URL.createObjectURL(file))
  }

  return (
    <form className='d-flex flex-column gap-3'>
      <div>
        <label aria-required className='form-label' htmlFor='batch-name'>
          {t('analyticsSite.batch-modal.name-label')}
        </label>
        <input
          className='form-control'
          id='batch-name'
          onChange={event => setBatch(value => ({ ...value, name: event.target.value }))}
          type='text'
          value={batch.name ?? ''}
        />
      </div>

      <div>
        <label aria-required className='form-label' htmlFor='sponsor-name'>
          {t('analyticsSite.batch-modal.sponsor-name-label')}
        </label>
        <input
          className='form-control'
          id='sponsor-name'
          onChange={event =>
            setBatch(value => ({
              ...value,
              sponsor: { ...value.sponsor, name: event.target.value },
            }))}
          type='text'
          value={batch.sponsor?.name ?? ''}
        />
      </div>

      <div>
        <label aria-required className='form-label' htmlFor='sponsor-website-url'>
          {t('analyticsSite.batch-modal.sponsor-website-url-label')}
        </label>
        <input
          className='form-control'
          id='sponsor-website-url'
          onChange={event =>
            setBatch(value => ({
              ...value,
              sponsor: { ...value.sponsor, url: event.target.value },
            }))}
          type='text'
          value={batch.sponsor?.url ?? ''}
        />
      </div>

      <div>
        <label aria-required className='form-label' htmlFor='sponsor-logo'>
          {t('analyticsSite.batch-modal.sponsor-logo-label')}
        </label>
        <ImageUpload
          id='batch-sponsor-logo-upload'
          imageUrl={sponsorLogoUrl}
          onChange={onSponsorLogoUpload}
        />
      </div>

      <div>
        <label className='form-label' htmlFor='size'>
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
                plantCount: mapSum(species, 'quantity'),
              })),
            [],
          )}
          required
          species={batch.species}
        />
      </div>

      <div>
        <label className='form-label'>
          {t('analyticsSite.batch-modal.total-number-of-plants-label')}:&nbsp;
        </label>
        <span>{batch.plantCount}</span>
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
          value={batch.soilCondition ?? ''}
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
        <label className='form-label' htmlFor='survived'>
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
        <label className='form-label' htmlFor='replaced'>
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
                totalNumberSeeds: mapSum(species, 'quantity'),
              })),
            [],
          )}
          species={batch.seeds}
        />
      </div>

      <div>
        <label className='form-label'>
          {t('analyticsSite.batch-modal.total-seeds-label')}:&nbsp;
        </label>
        <span>{batch.totalNumberSeeds}</span>
      </div>

      <div>
        <label className='form-label' htmlFor='propagation'>
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

      <div className='d-flex flex-column'>
        <label className='form-label' htmlFor='batch-images'>
          {t('analyticsSite.batch-modal.images-label')}
        </label>
        <input
          className='form-control'
          id='batch-images'
          multiple
          onChange={event =>
            setBatch(value => ({
              ...value,
              images: [...batch.images, ...event.target.files ?? []],
            }))}
          type='file'
        />
        {batch.images.length > 0 && (
          <AssetGrid
            isEditable={{
              removeFile: id => {
                const updatedImages = batch.images.filter((_, index_) => index_ !== id)

                setBatch(value => ({
                  ...value,
                  images: updatedImages,
                }))
              },
            }}
            medias={batch.images.map(
              (file, index) => (new Asset({ id: index, asset: URL.createObjectURL(file) })),
            )}
          />
        )}
      </div>
    </form>
  )
}

export default BatchForm
