import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BatchForm from '@components/analytics/batch-modal/BatchForm'
import { type BatchFormDto, DEFAULT_BATCH_FORM_DTO } from '@components/analytics/batch-modal/batchModal.model'
import { SnackbarContext } from '@components/context/SnackbarContext'
import useApiClient from '@hooks/ApiClientHook'
import type { BatchDetail, FileParameter } from '@services/api'
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
    } = batch

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
        mulchLayers.map(layer => layer.id),
        seeds,
        species,
        supportedSpecies.map(specie => specie.id),
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
      <DialogTitle>{t('analyticsSite.batch-modal.edit-title')}</DialogTitle>

      <DialogContent>
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
