import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { BatchFormDto } from './BatchForm'
import BatchForm from '@components/analytics/batch-modal/BatchForm'
import { SnackbarContext } from '@components/context/SnackbarContext'
import { DEFAULT_BATCH_FORM_DTO } from '@constants/batchForm.constant'
import useApiClient from '@hooks/ApiClientHook'
import type { SiteSummaryDetail } from '@services/api'
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
      image,
    } = batch

    const sponsorLogoImage = sponsorLogo
      ? await assetFormatter(sponsorLogo)
      : undefined

    const batchImage = image
      ? await assetFormatter(image)
      : undefined

    try {
      await getApiClient().batchClient.create(
        site.id,
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
      <DialogTitle>
        <div className='fs-5 text-capitalize m-auto text-center'>
          {t('analyticsSite.batch-modal.create-title')}
        </div>
      </DialogTitle>

      <DialogContent className='pb-5'>
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
