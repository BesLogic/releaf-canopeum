import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { type BatchFormDto, DEFAULT_BATCH_FORM_DTO } from '@components/analytics/batch-modal/batchModal.model'
import FertilizersSelector from '@components/analytics/FertilizersSelector'
import ImageUpload from '@components/analytics/ImageUpload'
import MulchLayersSelector from '@components/analytics/MulchLayersSelector'
import SupportSpeciesSelector from '@components/analytics/SupportSpeciesSelector'
import TreeSpeciesSelector from '@components/analytics/TreeSpeciesSelector'
import { mapSum } from '@utils/arrayUtils'
import { type FieldErrors, type UseFormRegister, type UseFormSetValue, type UseFormTrigger, type UseFormWatch } from 'react-hook-form'
import AssetGrid from '@components/assets/AssetGrid'
import { Asset } from '@services/api'

type Props = {
  initialBatch?: BatchFormDto,
  register: UseFormRegister<BatchFormDto>,
  setValue: UseFormSetValue<BatchFormDto>,
  watch: UseFormWatch<BatchFormDto>,
  trigger: UseFormTrigger<BatchFormDto>,
  errors: FieldErrors<BatchFormDto>,
}

const BatchForm = ({ register, setValue, watch, trigger, errors }: Props) => {
  const { t } = useTranslation()

  const [batch, setBatch] = useState<BatchFormDto>(DEFAULT_BATCH_FORM_DTO)
  const [sponsorLogoUrl, setSponsorLogoUrl] = useState<string>()

  useEffect(() => {
    const imagePreview = watch(value => {
      const logo = value?.sponsor?.logo
      if (logo instanceof File) {
        setSponsorLogoUrl(URL.createObjectURL(logo))
      }
    })

    return () => imagePreview.unsubscribe()
  }, [register])

  useEffect(() => {
    register('sponsor.logo', {
      required: t('analyticsSite.batch-modal.validation.sponsor-logo-required'),
      validate: {
        fileType: (file: File | undefined) =>
          !file ||
          file.type.startsWith('image/') ||
          t('analyticsSite.batch-modal.validation.invalid-file-type'),
      },
    })

    register('plantCount', {
      validate: {
        min: (value: number) =>
          value > 0 || t('analyticsSite.batch-modal.validation.plant-count-min'),
      },
    })
  }, [register])

  return (
    <div className='form-container'>
      <div className='form-group'>
        <label aria-required className='form-label' htmlFor='batch-name'>
          {t('analyticsSite.batch-modal.name-label')}
        </label>
        <input
          className='form-control'
          id='batch-name'
          {...register('name', {
            required: t('analyticsSite.batch-modal.validation.name-required'),
          })}
          type='text'
        />
        {errors.name && <span className='help-block text-danger'>{errors.name.message}</span>}
      </div>

      <div className='form-group'>
        <label aria-required className='form-label' htmlFor='sponsor-name'>
          {t('analyticsSite.batch-modal.sponsor-name-label')}
        </label>
        <input
          className='form-control'
          id='sponsor-name'
          type='text'
          {...register('sponsor.name', {
            required: t('analyticsSite.batch-modal.validation.sponsor-name-required'),
          })}
        />
        {errors.sponsor?.name && (
          <span className='help-block text-danger'>{errors.sponsor.name.message}</span>
        )}
      </div>

      <div className='form-group'>
        <label aria-required className='form-label' htmlFor='sponsor-website-url'>
          {t('analyticsSite.batch-modal.sponsor-website-url-label')}
        </label>
        <div className='input-group'>
          <span className='input-group-text'>https://</span>
          <input
            className='form-control '
            id='sponsor-website-url'
            {...register('sponsor.url', {
              required: t('analyticsSite.batch-modal.validation.sponsor-url-required'),
              pattern: {
                value: /^([\w\d-]+\.)+\w{2,}(\/.*)?$/,
                message: t('analyticsSite.batch-modal.validation.sponsor-url-pattern'),
              },
            })}
          />
        </div>
        {errors.sponsor?.url && (
          <span className='help-block text-danger'>{errors.sponsor.url.message}</span>
        )}
      </div>

      <div className='form-group'>
        <label aria-required className='form-label' htmlFor='sponsor-logo'>
          {t('analyticsSite.batch-modal.sponsor-logo-label')}
        </label>
        <ImageUpload
          id='batch-sponsor-logo-upload'
          imageUrl={sponsorLogoUrl}
          onChange={(file: File | null) => {
            if (file) {
              setValue('sponsor.logo', file, { shouldValidate: true })
              trigger('sponsor.logo')
              setSponsorLogoUrl(URL.createObjectURL(file))
            } else {
              setValue('sponsor.logo', undefined, { shouldValidate: true })
              trigger('sponsor.logo')
            }
          }}
        />
        {errors.sponsor?.logo && (
          <span className='help-block text-danger'>{errors.sponsor.logo.message}</span>
        )}
      </div>

      <div className='form-group'>
        <label className='form-label' htmlFor='size'>
          {t('analyticsSite.batch-modal.size-label')}
        </label>
        <div className='input-group'>
          <input
            className='form-control'
            id='size'
            type='number'
            min={0}
            step={1}
            {...register('size', {
              valueAsNumber: true,
              min: { value: 0, message: t('analyticsSite.batch-modal.validation.size-min') },
            })}
          />
          <span className='input-group-text'>
            {t('analyticsSite.batch-modal.feet-squared')}
          </span>
        </div>
        {errors.size && <span className='help-block text-danger'>{errors.size.message}</span>}
      </div>

      <div className='form-group'>
        <TreeSpeciesSelector
          label='analyticsSite.batch-modal.number-of-trees-label'
          required
          species={watch('species')}
          onChange={species => {
            const total = mapSum(species, 'quantity')
            setValue('species', species)
            setValue('plantCount', total)
            trigger('plantCount')
          }}
        />
        {errors.plantCount && (
          <span className='help-block text-danger'>{errors.plantCount.message}</span>
        )}
      </div>

      <div className='form-group'>
        <label className='form-label' htmlFor='soil-condition'>
          {t('analyticsSite.batch-modal.soil-condition-label')}
        </label>
        <input
          className='form-control'
          id='soil-condition'
          type='text'
          {...register('soilCondition')}
        />
      </div>

      <div className='form-group'>
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
      </div>

      <div className='form-group'>
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
      </div>

      <div className='form-group'>
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
      </div>

      <div className='form-group'>
        <label className='form-label' htmlFor='survived'>
          {t('analyticsSite.batch-modal.survived-label')}
        </label>
        <input
          className='form-control'
          id='survived'
          type='number'
          {...register('survivedCount', {
            valueAsNumber: true,
            min: { value: 0, message: t('analyticsSite.batch-modal.validation.no-negative') },
          })}
        />
        {errors.survivedCount && (
          <span className='help-block text-danger'>{errors.survivedCount.message}</span>
        )}
      </div>

      <div className='form-group'>
        <label className='form-label' htmlFor='replaced'>
          {t('analyticsSite.batch-modal.replaced-label')}
        </label>
        <input
          className='form-control'
          id='replaced'
          type='number'
          {...register('replaceCount', {
            valueAsNumber: true,
            min: { value: 0, message: t('analyticsSite.batch-modal.validation.no-negative') },
          })}
        />
      </div>

      <div className='form-group'>
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

      <div className='form-group'>
        <label className='form-label' htmlFor='propagation'>
          {t('analyticsSite.batch-modal.propagation-label')}
        </label>
        <input
          className='form-control'
          id='propagation'
          type='number'
          {...register('totalPropagation', {
            valueAsNumber: true,
            min: { value: 0, message: t('analyticsSite.batch-modal.validation.no-negative') },
          })}
        />
        {errors.totalPropagation && (
          <span className='help-block text-danger'>{errors.totalPropagation.message}</span>
        )}
      </div>

      <div className='form-group'>
        <label className='form-label' htmlFor='batch-image'>
          {t('analyticsSite.batch-modal.images-label')}
        </label>
        <input
          type='file'
          id='batch-image'
          multiple
          onChange={e => {
            const newFiles = e.target.files ? Array.from(e.target.files) : []
            const currentFiles = Array.isArray(watch('images')) ? watch('images') : []
            const allFiles = [...currentFiles, ...newFiles]

            setValue('images', allFiles, { shouldValidate: true })
          }}
        />
        {Array.isArray(watch('images')) && watch('images').length > 0 && (
          <AssetGrid
            isEditable={{
              removeFile: (index: number) => {
                const updatedImages = watch('images').filter((_, i: number) => i !== index)
                setValue('images', updatedImages, { shouldValidate: true })
              },
            }}
            medias={watch('images').map(
              (file, i) => (new Asset({ id: i, asset: URL.createObjectURL(file) })),
            )}
          />
        )}
      </div>
    </div>
  )
}

export default BatchForm
