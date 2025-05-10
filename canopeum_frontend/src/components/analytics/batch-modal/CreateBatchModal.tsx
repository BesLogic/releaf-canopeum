import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BatchForm from '@components/analytics/batch-modal/BatchForm'
import { type BatchFormDto, DEFAULT_BATCH_FORM_DTO } from '@components/analytics/batch-modal/batchModal.model'
import { SnackbarContext } from '@components/context/SnackbarContext'
import useApiClient from '@hooks/ApiClientHook'
import type { FileParameter, SiteSummaryDetail } from '@services/api'
import { assetFormatter } from '@utils/assetFormatter'

type Props = {
  readonly open: boolean,
  readonly site: SiteSummaryDetail,
  readonly handleClose: (reason?: 'create') => void,
}

const CreateBatchModal = ({ open, site, handleClose }: Props) => {
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

    const batchImages = await Promise
      .all(images.map(async img => assetFormatter(img)))
      .then(assets => assets.filter(img => img != null))

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
        batchImages,
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

      <DialogContent>
        <BatchForm handleBatchChange={handleBatchChange} />
      </DialogContent>

      <DialogActions>
        <button
          className='btn btn-outline-primary'
          onClick={() => handleCancel()}
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

export default CreateBatchModal
