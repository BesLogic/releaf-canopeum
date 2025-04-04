import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BatchForm from '@components/analytics/batch-modal/BatchForm'
import { type BatchFormDto, DEFAULT_BATCH_FORM_DTO } from '@components/analytics/batch-modal/batchModal.model'
import { SnackbarContext } from '@components/context/SnackbarContext'
import useApiClient from '@hooks/ApiClientHook'
import type { SiteSummaryDetail } from '@services/api'
import { assetFormatter } from '@utils/assetFormatter'
import { useForm } from 'react-hook-form'

type Props = {
  readonly open: boolean,
  readonly site: SiteSummaryDetail,
  readonly handleClose: (reason?: 'create') => void,
}

const CreateBatchModal = ({ open, site, handleClose }: Props) => {
  const { t } = useTranslation()
  const { getApiClient } = useApiClient()
  const { openAlertSnackbar } = useContext(SnackbarContext)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BatchFormDto>({
    defaultValues: DEFAULT_BATCH_FORM_DTO,
  })

  const handleSubmitBatch = async (formData: BatchFormDto) => {
    console.log('formData', formData)
    const {
      name,
      size,
      soilCondition,
      sponsor,
      fertilizers,
      mulchLayers,
      supportedSpecies,
      survivedCount,
      replaceCount,
      totalPropagation,
      seeds,
      species,
      image,
    } = formData

    const sponsorLogoImage = sponsor?.logo
      ? await assetFormatter(sponsor.logo)
      : undefined

    const batchImage = image
      ? await assetFormatter(image)
      : undefined

    try {
      await getApiClient().batchClient.create(
        site.id,
        name,
        sponsor?.name,
        sponsor?.url,
        sponsorLogoImage,
        size,
        soilCondition,
        survivedCount,
        replaceCount,
        totalPropagation,
        batchImage,
        fertilizers.map(fertilizer => fertilizer.id),
        mulchLayers.map(mulchLayer => mulchLayer.id),
        seeds,
        species,
        supportedSpecies.map(supportedSpecie => supportedSpecie.id),
      )
    } catch {
      openAlertSnackbar(
        t('analyticsSite.batch-modal.feedback.create-error'),
        { severity: 'error' },
      )

      return false
    }

    openAlertSnackbar(
      t('analyticsSite.batch-modal.feedback.create-success'),
    )
    handleClose('create')

    return true
  }

  const handleCancel = () => handleClose()

  return (
    <Dialog fullWidth maxWidth='sm' onClose={handleCancel} open={open}>
      <DialogTitle>{t('analyticsSite.batch-modal.create-title')}</DialogTitle>
      <form onSubmit={handleSubmit(handleSubmitBatch)}>
        <DialogContent>
          <BatchForm
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />
        </DialogContent>

        <DialogActions>
          <button
            className='btn btn-outline-primary'
            onClick={() => handleCancel()}
            type='button'
          >
            {t('generic.cancel')}
          </button>

          <button
            className='btn btn-primary'
            type='submit'
          >
            {t('generic.submit')}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateBatchModal
