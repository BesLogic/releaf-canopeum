import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BatchForm from '@components/analytics/batch-modal/BatchForm'
import { type BatchFormDto, DEFAULT_BATCH_FORM_DTO, transformToEditBatchDto } from '@components/analytics/batch-modal/batchModal.model'
import { SnackbarContext } from '@components/context/SnackbarContext'
import useApiClient from '@hooks/ApiClientHook'
import { type BatchDetail, type SiteSummaryDetail, Species } from '@services/api'
import { assetFormatter } from '@utils/assetFormatter'
import { useForm } from 'react-hook-form'

type Props = {
  readonly open: boolean,
  readonly site: SiteSummaryDetail,
  readonly handleClose: (reason?: 'create' | 'edit') => void,
  readonly batchToEdit?: BatchDetail,
}

const BatchModal = ({ open, site, handleClose, batchToEdit }: Props) => {
  const { t } = useTranslation()
  const { getApiClient } = useApiClient()
  const { openAlertSnackbar } = useContext(SnackbarContext)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm<BatchFormDto>({
    mode: 'onTouched',
    defaultValues: DEFAULT_BATCH_FORM_DTO,
  })

  useEffect(() => {
    const initForm = async () => {
      if (batchToEdit && batchToEdit !== null) {
        const batch = await transformToEditBatchDto(batchToEdit)
        reset(batch)
      } else {
        reset(DEFAULT_BATCH_FORM_DTO)
      }
    }

    initForm()
  }, [batchToEdit, reset])

  const handleSubmitBatch = async (formData: BatchFormDto) => {
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
      if (batchToEdit) {
        await getApiClient().batchClient.update(
          batchToEdit.id,
          name,
          sponsor?.name,
          sponsor?.url,
          sponsorLogoImage,
          size,
          soilCondition,
          survivedCount,
          replaceCount,
          totalPropagation,
          fertilizers.map(f => f.id),
          mulchLayers.map(m => m.id),
          seeds,
          species,
          supportedSpecies.map(s => s.id),
        )
        openAlertSnackbar(t('analyticsSite.batch-modal.feedback.edit-success'))
        handleClose('edit')
      } else {
        await getApiClient().batchClient.create(
          site!.id,
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
          fertilizers.map(f => f.id),
          mulchLayers.map(m => m.id),
          seeds,
          species,
          supportedSpecies.map(s => s.id),
        )
        openAlertSnackbar(t('analyticsSite.batch-modal.feedback.create-success'))
        reset()
        handleClose('create')
      }
    } catch {
      openAlertSnackbar(
        t(
          batchToEdit
            ? 'analyticsSite.batch-modal.feedback.edit-error'
            : 'analyticsSite.batch-modal.feedback.create-error',
        ),
        { severity: 'error' },
      )
    }
  }

  const handleCancel = () => handleClose()

  return (
    <form onSubmit={handleSubmit(handleSubmitBatch)}>
      <Dialog fullWidth maxWidth='sm' onClose={handleCancel} open={open}>
        <DialogTitle>
          {t(
            batchToEdit
              ? 'analyticsSite.batch-modal.edit-title'
              : 'analyticsSite.batch-modal.create-title',
          )}
        </DialogTitle>

        <DialogContent>
          <BatchForm
            register={register}
            setValue={setValue}
            watch={watch}
            trigger={trigger}
            errors={errors}
          />
        </DialogContent>

        <DialogActions>
          <button className='btn btn-outline-primary' onClick={handleCancel} type='button'>
            {t('generic.cancel')}
          </button>
          <button className='btn btn-primary' type='submit'>
            {t('generic.submit')}
          </button>
        </DialogActions>
      </Dialog>
    </form>
  )
}

export default BatchModal
