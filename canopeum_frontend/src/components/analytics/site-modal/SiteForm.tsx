import { useContext, useEffect, useState } from 'react'
import { type UseFormReturn, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import ImageUpload from '@components/analytics/ImageUpload'
import SiteCoordinates from '@components/analytics/site-modal/SiteCoordinates'
import type { SiteFormDto } from '@components/analytics/site-modal/siteModal.model'
import TreeSpeciesSelector from '@components/analytics/TreeSpeciesSelector'
import { LanguageContext } from '@components/context/LanguageContext'
import type { SiteType } from '@services/api'

/* eslint react/jsx-props-no-spreading: 0 --
use of register spreadability from 'react-hook-form'  */

type Props = {
  readonly availableSiteTypes: SiteType[],
  readonly form: UseFormReturn<SiteFormDto>,
}

const SiteForm = (
  { availableSiteTypes, form }: Props,
) => {
  const { t } = useTranslation()
  const { translateValue } = useContext(LanguageContext)

  const {
    register,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors },
  } = form

  const siteImage = useWatch({ name: 'siteImage', control })
  const [siteImageUrl, setSiteImageUrl] = useState<string>()

  useEffect(() => {
    if (siteImage instanceof File) {
      setSiteImageUrl(URL.createObjectURL(siteImage))
    }
  }, [siteImage])

  useEffect(() => {
    const image = getValues('siteImage')
    if (image instanceof File) {
      setSiteImageUrl(URL.createObjectURL(image))
    }

    register('siteImage', {
      required: t('analytics.site-modal.validation.image-required'),
      validate: {
        fileType: (file: File | undefined) =>
          !file
          || file.type.startsWith('image/')
          || t('analytics.site-modal.validation.invalid-file-type'),
      },
    })

    register('species', {
      validate: species =>
        species.length > 0
        || t('analytics.site-modal.validation.tree-species-required'),
    })
  }, [register, watch, getValues])

  return (
    <>
      <div className='form-group'>
        <label aria-required className='form-label' htmlFor='site-name'>
          {t('analytics.site-modal.site-name')}
        </label>
        <input
          className='form-control'
          id='site-name'
          {...register('siteName', {
            required: t('analytics.site-modal.validation.name-required'),
          })}
          type='text'
        />
        {errors.siteName && (
          <span className='help-block text-danger'>{errors.siteName.message}</span>
        )}
      </div>

      <div className='form-group'>
        <label aria-required className='form-label' htmlFor='site-type'>
          {t('analytics.site-modal.site-type')}
        </label>
        <select
          className='form-select'
          id='site-type'
          {...register('siteType', {
            required: t('analytics.site-modal.validation.site-type-required'),
          })}
        >
          {availableSiteTypes.map(value => (
            <option key={`available-specie-${value.id}`} value={value.id}>
              {translateValue(value)}
            </option>
          ))}
        </select>
      </div>

      <div className='form-group'>
        <label aria-required className='form-label' htmlFor='site-image'>
          {t('analytics.site-modal.site-image')}
        </label>
        <ImageUpload
          id='site-image-upload'
          imageUrl={siteImageUrl}
          onChange={(file: File | null) => {
            if (file) {
              setValue('siteImage', file, { shouldValidate: true })
              setSiteImageUrl(URL.createObjectURL(file))
            } else {
              setValue('siteImage', undefined, { shouldValidate: true })
            }
          }}
        />
        {errors.siteImage && (
          <span className='help-block text-danger'>{errors.siteImage.message}</span>
        )}
      </div>

      <SiteCoordinates
        latitude={watch('dmsLatitude')}
        longitude={watch('dmsLongitude')}
        onChange={(latitude, longitude) => {
          setValue('dmsLatitude', latitude, { shouldValidate: true })
          setValue('dmsLongitude', longitude, { shouldValidate: true })
        }}
      />

      <div className='form-group'>
        <label className='form-label' htmlFor='site-presentation'>
          {t('analytics.site-modal.site-presentation')}
        </label>
        <textarea
          className='form-control'
          id='site-presentation'
          maxLength={1000}
          {...register('presentation', {
            maxLength: {
              value: 1000,
              message: t('analytics.site-modal.validation.character-number-exceed'),
            },
          })}
        />
      </div>

      <div className='form-group'>
        <label aria-required className='form-label' htmlFor='site-size'>
          {t('analytics.site-modal.site-size')}
        </label>
        <div className='input-group'>
          <input
            className='form-control'
            id='site-size'
            {...register('size', {
              required: t('analytics.site-modal.validation.size-min'),
            })}
            type='number'
          />
          <span className='input-group-text'>{t('analytics.site-modal.feet-squared')}</span>
        </div>
        {
          // eslint-disable-next-line unicorn/explicit-length-check -- size is a property name
          errors.size
          && <span className='help-block text-danger'>{errors.size.message}</span>
        }
      </div>

      <div className='form-group'>
        <TreeSpeciesSelector
          label='analytics.site-modal.site-tree-species'
          onChange={species => setValue('species', species, { shouldValidate: true })}
          required
          species={watch('species')}
        />
        {errors.species && <span className='help-block text-danger'>{errors.species.message}</span>}
      </div>

      <div className='form-group'>
        <label className='form-label' htmlFor='site-research-partner'>
          {t('analytics.site-modal.site-research-partner')}
        </label>
        <div
          className='d-flex'
          id='site-research-partner'
        >
          <div className='col form-check form-check-inline'>
            <input
              checked={!!watch('researchPartner')}
              className='form-check-input'
              id='research-partner-yes'
              onChange={() => setValue('researchPartner', true, { shouldValidate: true })}
              type='radio'
            />
            <label className='form-check-label' htmlFor='research-partner-yes'>
              {t('analytics.site-modal.yes')}
            </label>
          </div>

          <div className='col form-check form-check-inline'>
            <input
              checked={!watch('researchPartner')}
              className='form-check-input'
              id='research-partner-no'
              name='research-partner'
              onChange={() => setValue('researchPartner', false, { shouldValidate: true })}
              type='radio'
            />
            <label className='form-check-label' htmlFor='research-partner-no'>
              {t('analytics.site-modal.no')}
            </label>
          </div>

          <div className='col' /> {/* spacer */}
        </div>
      </div>

      <div className='form-group'>
        <label className='form-label' htmlFor='site-map-visibility'>
          {t('analytics.site-modal.site-map-visibility')}
        </label>
        <div
          className='d-flex'
          id='site-map-visibility'
        >
          <div className='col form-check form-check-inline'>
            <input
              checked={!!watch('visibleOnMap')}
              className='form-check-input'
              id='map-visible'
              name='map-visibility'
              onChange={() => setValue('visibleOnMap', true, { shouldValidate: true })}
              type='radio'
            />
            <label className='form-check-label' htmlFor='map-visible'>
              {t('analytics.site-modal.visible')}
            </label>
          </div>

          <div className='col form-check form-check-inline'>
            <input
              checked={!watch('visibleOnMap')}
              className='form-check-input'
              id='map-invisible'
              name='map-visibility'
              onChange={() => setValue('visibleOnMap', false, { shouldValidate: true })}
              type='radio'
            />
            <label className='form-check-label' htmlFor='map-invisible'>
              {t('analytics.site-modal.invisible')}
            </label>
          </div>

          <div className='col' /> {/* spacer */}
        </div>
      </div>
    </>
  )
}

export default SiteForm
