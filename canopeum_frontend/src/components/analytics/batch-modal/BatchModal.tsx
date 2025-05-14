import { Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import BatchForm from '@components/analytics/batch-modal/BatchForm'
import { type BatchFormDto, DEFAULT_BATCH_FORM_DTO, transformToEditBatchDto } from '@components/analytics/batch-modal/batchModal.model'
import { SnackbarContext } from '@components/context/SnackbarContext'
import useApiClient from '@hooks/ApiClientHook'
import type { BatchDetail, FileParameter, SiteSummaryDetail } from '@services/api'
import { assetFormatter } from '@utils/assetFormatter'

type Props = {
  readonly open: boolean,
  readonly site: SiteSummaryDetail,
  readonly handleClose: (hasChanged: boolean) => void,
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
    reset,
    formState: { errors },
  } = useForm<BatchFormDto>({
    mode: 'onTouched',
    defaultValues: DEFAULT_BATCH_FORM_DTO,
    shouldFocusError: true,
  })

  useEffect(
    () =>
      void initForm().catch(() =>
        console.error('Oops an error occured during initialization the form')
      ),
    [
      batchToEdit,
      reset,
    ],
  )

  const initForm = async () => {
    if (batchToEdit) {
      const batch = await transformToEditBatchDto(batchToEdit)
      reset(batch)
    } else {
      reset(DEFAULT_BATCH_FORM_DTO)
    }
  }

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
      images,
    } = formData

    const sponsorLogoImage = sponsor?.logo
      ? await assetFormatter(sponsor.logo)
      : undefined

    let batchImages: FileParameter[] | undefined

    if (images.length > 0) {
      const assets = await Promise.all(
        [...images].map(async img => assetFormatter(img)),
      )
      batchImages = assets.filter((img): img is FileParameter => img !== undefined)
    }

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
          batchImages ?? [],
          fertilizers.map(fertilizer => fertilizer.id),
          mulchLayers.map(mulchLayer => mulchLayer.id),
          seeds,
          species,
          supportedSpecies.map(supportedSpecie => supportedSpecie.id),
        )
        openAlertSnackbar(t('analyticsSite.batch-modal.feedback.edit-success'))
      } else {
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
          batchImages ?? [],
          fertilizers.map(fertilizer => fertilizer.id),
          mulchLayers.map(mulchLayer => mulchLayer.id),
          seeds,
          species,
          supportedSpecies.map(supportedSpecie => supportedSpecie.id),
        )
        openAlertSnackbar(t('analyticsSite.batch-modal.feedback.create-success'))
        reset()
      }
      handleClose(true)
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

  const handleCancel = () => handleClose(false)

  return (
    <Dialog fullWidth maxWidth='sm' onClose={handleCancel} open={open}>
      <DialogTitle>
        {t(
          batchToEdit
            ? 'analyticsSite.batch-modal.edit-title'
            : 'analyticsSite.batch-modal.create-title',
        )}
      </DialogTitle>

      <Divider />

      <form onSubmit={handleSubmit(handleSubmitBatch)}>
        <DialogContent>
          <BatchForm
            errors={errors}
            register={register}
            setValue={setValue}
            watch={watch}
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
      </form>
    </Dialog>
  )
}

export default BatchModal
