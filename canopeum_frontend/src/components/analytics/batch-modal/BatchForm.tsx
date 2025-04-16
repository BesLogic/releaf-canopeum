import { useEffect, useState } from 'react'
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { BatchFormDto } from '@components/analytics/batch-modal/batchModal.model'
import FertilizersSelector from '@components/analytics/FertilizersSelector'
import ImageUpload from '@components/analytics/ImageUpload'
import MulchLayersSelector from '@components/analytics/MulchLayersSelector'
import SupportSpeciesSelector from '@components/analytics/SupportSpeciesSelector'
import TreeSpeciesSelector from '@components/analytics/TreeSpeciesSelector'
import AssetGrid from '@components/assets/AssetGrid'
import { Asset } from '@services/api'
import { mapSum } from '@utils/arrayUtils'

/* eslint react/jsx-props-no-spreading: 0 --
use of register spreadability from 'react-hook-form'  */

const sponsorLogoRequiredKey = 'analyticsSite.batch-modal.validation.sponsor-logo-required'
const sponsorUrlPatternKey = 'analyticsSite.batch-modal.validation.sponsor-url-pattern'
const noNegative = 'analyticsSite.batch-modal.validation.no-negative'
const sponsorUrlPrefix = 'https://'
const sponsorLogoProperty = 'sponsor.logo'

type Props = {
  readonly initialBatch?: BatchFormDto,
  readonly register: UseFormRegister<BatchFormDto>,
  readonly setValue: UseFormSetValue<BatchFormDto>,
  readonly watch: UseFormWatch<BatchFormDto>,
  readonly errors: FieldErrors<BatchFormDto>,
}

const BatchForm = ({ register, setValue, watch, errors }: Props) => {
  const { t } = useTranslation()

  const [sponsorLogoUrl, setSponsorLogoUrl] = useState<string>()

  useEffect(() => {
    const imagePreview = watch(value => {
      const logo = value.sponsor?.logo
      if (logo instanceof File) {
        setSponsorLogoUrl(URL.createObjectURL(logo))
      }
    })

    return () => imagePreview.unsubscribe()
  }, [register])

  useEffect(() => {
    register(sponsorLogoProperty, {
      required: t(sponsorLogoRequiredKey),
      validate: {
        fileType: (file: File | undefined) =>
          !file
          || file.type.startsWith('image/')
          || t('analyticsSite.batch-modal.validation.invalid-file-type'),
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
          <span className='input-group-text'>{sponsorUrlPrefix}</span>
          <input
            className='form-control '
            id='sponsor-website-url'
            {...register('sponsor.url', {
              required: t('analyticsSite.batch-modal.validation.sponsor-url-required'),
              pattern: {
                value: /^([\w-]+\.)+\w{2,}(\/.*)?$/u,
                message: t(sponsorUrlPatternKey),
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
              setValue(sponsorLogoProperty, file, { shouldValidate: true })
              setSponsorLogoUrl(URL.createObjectURL(file))
            } else {
              setValue(sponsorLogoProperty, undefined, { shouldValidate: true })
            }
          }}
        />
        {errors.sponsor?.logo && (
          <span className='help-block text-danger'>{errors.sponsor.logo.message}</span>
        )}
      </div>

      <div className='form-group'>
        <label aria-required className='form-label' htmlFor='size'>
          {t('analyticsSite.batch-modal.size-label')}
        </label>
        <div className='input-group'>
          <input
            className='form-control'
            id='size'
            min={0}
            step={1}
            type='number'
            {...register('size', {
              required: t('analyticsSite.batch-modal.validation.size-min'),
              min: { value: 0, message: t('analyticsSite.batch-modal.validation.size-min') },
            })}
          />
          <span className='input-group-text'>
            {t('analyticsSite.batch-modal.feet-squared')}
          </span>
        </div>
        {
          // eslint-disable-next-line unicorn/explicit-length-check -- size is a property name
          errors.size
          && <span className='help-block text-danger'>{errors.size.message}</span>
        }
      </div>

      <div className='form-group'>
        <TreeSpeciesSelector
          label='analyticsSite.batch-modal.number-of-trees-label'
          onChange={species => {
            const total = mapSum(species, 'quantity')
            setValue('species', species)
            setValue('plantCount', total)
          }}
          required
          species={watch('species')}
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
          onChange={fertilizers => setValue('fertilizers', fertilizers)}
        />
      </div>

      <div className='form-group'>
        <MulchLayersSelector
          mulchLayers={watch('mulchLayers')}
          onChange={mulchLayers => setValue('mulchLayers', mulchLayers)}
        />
      </div>

      <div className='form-group'>
        <SupportSpeciesSelector
          onChange={supportedSpecies => setValue('supportedSpecies', supportedSpecies)}
          species={watch('supportedSpecies')}
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
            min: { value: 0, message: t(noNegative) },
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
            min: { value: 0, message: t(noNegative) },
          })}
        />
      </div>

      <div className='form-group'>
        <TreeSpeciesSelector
          label='analyticsSite.batch-modal.seeds-per-species-label'
          onChange={species => {
            const total = mapSum(species, 'quantity')
            setValue('seeds', species)
            setValue('totalNumberSeeds', total)
          }}
          species={watch('seeds')}
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
            min: { value: 0, message: t(noNegative) },
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
          id='batch-image'
          multiple
          onChange={event => {
            const newFiles = event.target.files
              ? [...event.target.files]
              : []
            const currentFiles = Array.isArray(watch('images'))
              ? watch('images')
              : []
            const allFiles = [...currentFiles, ...newFiles]

            setValue('images', allFiles, { shouldValidate: true })
          }}
          type='file'
        />
        {Array.isArray(watch('images')) && watch('images').length > 0 && (
          <AssetGrid
            isEditable={{
              removeFile: (index: number) => {
                const updatedImages = watch('images')
                  .filter((_, index_: number) => index_ !== index)
                setValue('images', updatedImages, { shouldValidate: true })
              },
            }}
            medias={watch('images').map(
              (file, index) => (new Asset({ id: index, asset: URL.createObjectURL(file) })),
            )}
          />
        )}
      </div>
    </div>
  )
}

export default BatchForm
