import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BatchForm, { type BatchFormDto } from '@components/analytics/batch-modal/BatchForm'
import { SnackbarContext } from '@components/context/SnackbarContext'
import { DEFAULT_BATCH_FORM_DTO } from '@constants/batchForm.constant'
import useApiClient from '@hooks/ApiClientHook'
import type { BatchDetail } from '@services/api'
import { assetFormatter } from '@utils/assetFormatter'

type Props = {
  readonly batchToEdit: BatchDetail,
  readonly handleClose: (reason?: 'edit') => void,
}

const BatchModal = ({ batchToEdit, handleClose }: Props) => {
  const { t } = useTranslation()
  const { getApiClient } = useApiClient()
  const { openAlertSnackbar } = useContext(SnackbarContext)

  const [batch, setBatch] = useState<BatchFormDto>(DEFAULT_BATCH_FORM_DTO)

  const handleBatchChange = (batchFormDto: BatchFormDto) => setBatch(batchFormDto)

  const handleSubmitBatch = async () => {
    const {
      name,
      size,
      soilCondition,
      sponsorName,
      sponsorWebsiteUrl,
      sponsorLogo,
      fertilizers,
      mulchLayers,
      supportedSpecies,
      plantCount,
      survivedCount,
      replaceCount,
      totalNumberSeed,
      totalPropagation,
      seeds,
      species,
      // image,
    } = batch

    const sponsorLogoImage = sponsorLogo
      ? await assetFormatter(sponsorLogo)
      : undefined

    try {
      await getApiClient().batchClient.update(
        batchToEdit.id,
        name,
        sponsorName,
        sponsorWebsiteUrl,
        sponsorLogoImage,
        size,
        soilCondition,
        plantCount,
        survivedCount,
        replaceCount,
        totalNumberSeed,
        totalPropagation,
        fertilizers.map(fertilizer => fertilizer.id),
        mulchLayers.map(layer => layer.id),
        seeds,
        species,
        supportedSpecies.map(specie => specie.id),
        // image,
      )
    } catch {
      openAlertSnackbar(
        t('analyticsSite.batch-modal.feedback.edit-error'),
        { severity: 'error' },
      )

      return
    }
    openAlertSnackbar(
      t('analyticsSite.batch-modal.feedback.edit-success'),
    )

    handleClose('edit')
  }

  const onCancel = () => handleClose()

  return (
    <Dialog fullWidth maxWidth='sm' onClose={onCancel} open={!!batchToEdit}>
      <DialogTitle>
        <div className='fs-5 text-capitalize m-auto text-center'>
          {t('analyticsSite.batch-modal.edit-title')}
        </div>
      </DialogTitle>

      <DialogContent className='pb-5'>
        <BatchForm
          handleBatchChange={handleBatchChange}
          initialBatch={batchToEdit}
        />
      </DialogContent>

      <DialogActions>
        <button
          className='btn btn-outline-primary'
          onClick={() => onCancel()}
          type='button'
        >
          {t('generic.cancel')}
        </button>

        <button className='btn btn-primary' onClick={async () => handleSubmitBatch()} type='button'>
          {t('generic.submit')}
        </button>
      </DialogActions>
    </Dialog>
  )
}

export default BatchModal
