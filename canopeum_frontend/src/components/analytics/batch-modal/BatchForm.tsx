import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { type BatchFormDto, DEFAULT_BATCH_FORM_DTO, transformToEditBatchDto } from '@components/analytics/batch-modal/batchModal.model'
import FertilizersSelector from '@components/analytics/FertilizersSelector'
import ImageUpload from '@components/analytics/ImageUpload'
import MulchLayersSelector from '@components/analytics/MulchLayersSelector'
import SupportSpeciesSelector from '@components/analytics/SupportSpeciesSelector'
import TreeSpeciesSelector from '@components/analytics/TreeSpeciesSelector'
import type { BatchDetail } from '@services/api'
import { getApiBaseUrl } from '@services/apiSettings'
import { mapSum } from '@utils/arrayUtils'
import { floorNumberValue } from '@utils/formUtils'
import { type FieldErrors, type UseFormRegister, type UseFormSetValue, type UseFormWatch } from 'react-hook-form'

type Props = {
  initialBatch?: BatchDetail,
  register: UseFormRegister<BatchFormDto>,
  setValue: UseFormSetValue<BatchFormDto>,
  watch: UseFormWatch<BatchFormDto>,
  errors: FieldErrors<BatchFormDto>,
}

const BatchForm = ({ register, setValue, watch, errors, initialBatch }: Props) => {
  const { t } = useTranslation()

  const [batch, setBatch] = useState<BatchFormDto>(DEFAULT_BATCH_FORM_DTO)
  const [batchImageURL, setBatchImageURL] = useState<string>()
  const [sponsorLogoUrl, setSponsorLogoUrl] = useState<string>()

  useEffect(() => {
    if (!initialBatch) return

    const transformed = transformToEditBatchDto(initialBatch)
    Object.entries(transformed).forEach(([key, value]) => {
      setValue(key as keyof BatchFormDto, value)
    })

    setSponsorLogoUrl(`${getApiBaseUrl()}${initialBatch.sponsor.logo.asset}`)

    if (!initialBatch.image) return

    setBatchImageURL(`${getApiBaseUrl()}${initialBatch.image.asset}`)
  }, [initialBatch])

  const onImageUpload = (file: File) => {
    setBatch(value => ({ ...value, image: file }))
    setBatchImageURL(URL.createObjectURL(file))
  }

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
    <>
      <div>
        <label aria-required className='form-label' htmlFor='batch-name'>
          {t('analyticsSite.batch-modal.name-label')}
        </label>
        <input
          className='form-control'
          id='batch-name'
          {...register('name', { required: 'Name is required' })}
          type='text'
        />
        {errors.name && <span className='text-danger'>{errors.name.message}</span>}
      </div>

      <div>
        <label aria-required className='form-label' htmlFor='sponsor-name'>
          {t('analyticsSite.batch-modal.sponsor-name-label')}
        </label>
        <input
          className='form-control'
          id='sponsor-name'
          type='text'
          {...register('sponsor.name', { required: 'Sponsor name is required' })}
        />
        {errors.sponsor?.name && <span className='text-danger'>{errors.sponsor.name.message}</span>}
      </div>

      <div>
        <label aria-required className='form-label' htmlFor='sponsor-website-url'>
          {t('analyticsSite.batch-modal.sponsor-website-url-label')}
        </label>
        <input
          className='form-control'
          id='sponsor-website-url'
          type='url'
          {...register('sponsor.url', {
            required: 'Sponsor URL is required',
            pattern: {
              value: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.+)*\/?$/,
              message: 'Enter a valid URL',
            },
          })}
        />
        {errors.sponsor?.url && <span className='text-danger'>{errors.sponsor.url.message}</span>}
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
            type='number'
            {...register('size', {
              valueAsNumber: true,
              min: { value: 0, message: 'Size must be at least 0' },
            })}
          />
          <span className='input-group-text'>
            {t('analyticsSite.batch-modal.feet-squared')}
          </span>
          {errors.size && <span className='text-danger'>{errors.size.message}</span>}
        </div>
      </div>

      <div>
        <TreeSpeciesSelector
          label='analyticsSite.batch-modal.number-of-trees-label'
          required
          species={watch('species')}
          onChange={species => {
            const total = mapSum(species, 'quantity')
            setValue('species', species)
            setValue('plantCount', total)
          }}
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
          value={batch.soilCondition}
        />
      </div>

      <FertilizersSelector
        fertilizers={watch('fertilizers')}
        onChange={fertilizers => {
          setValue('fertilizers', fertilizers)
          setBatch(current => ({
            ...current,
            fertilizers,
          }))
        }}
      />

      <MulchLayersSelector
        mulchLayers={watch('mulchLayers')}
        onChange={mulchLayers => {
          setValue('mulchLayers', mulchLayers)
          setBatch(current => ({
            ...current,
            mulchLayers,
          }))
        }}
      />

      <SupportSpeciesSelector
        species={watch('supportedSpecies')}
        onChange={supportedSpecies => {
          setValue('supportedSpecies', supportedSpecies)
          setBatch(current => ({
            ...current,
            supportedSpecies,
          }))
        }}
      />

      <div>
        <label className='form-label' htmlFor='survived'>
          {t('analyticsSite.batch-modal.survived-label')}
        </label>
        <input
          className='form-control'
          id='survived'
          type='number'
          {...register('survivedCount', {
            valueAsNumber: true,
            min: { value: 0, message: 'Cannot be negative' },
          })}
        />
        {errors.survivedCount && <span className='text-danger'>{errors.survivedCount.message}
        </span>}
      </div>

      <div>
        <label className='form-label' htmlFor='replaced'>
          {t('analyticsSite.batch-modal.replaced-label')}
        </label>
        <input
          className='form-control'
          id='replaced'
          type='number'
          {...register('replaceCount', {
            valueAsNumber: true,
            min: { value: 0, message: 'Cannot be negative' },
          })}
        />
      </div>

      <div>
        <TreeSpeciesSelector
          label='analyticsSite.batch-modal.seeds-per-species-label'
          species={watch('seeds')}
          onChange={species => {
            const total = mapSum(species, 'quantity')
            setValue('seeds', species)
            setValue('totalNumberSeeds', total)
          }}
        />
      </div>

      <div>
        <label className='form-label'>
          {t('analyticsSite.batch-modal.total-seeds-label')}:&nbsp;
        </label>
        <span>{watch('totalNumberSeeds')}</span>
      </div>

      <div>
        <label className='form-label' htmlFor='propagation'>
          {t('analyticsSite.batch-modal.propagation-label')}
        </label>
        <input
          className='form-control'
          id='propagation'
          type='number'
          {...register('totalPropagation', {
            valueAsNumber: true,
            min: { value: 0, message: 'Cannot be negative' },
          })}
        />
        {errors.totalPropagation && (
          <span className='text-danger'>{errors.totalPropagation.message}</span>
        )}
      </div>

      <div>
        <label className='form-label' htmlFor='batch-image'>
          {t('analyticsSite.batch-modal.images-label')}
        </label>
        <ImageUpload id='batch-image-upload' imageUrl={batchImageURL} onChange={onImageUpload} />
      </div>
    </>
  )
}

export default BatchForm
