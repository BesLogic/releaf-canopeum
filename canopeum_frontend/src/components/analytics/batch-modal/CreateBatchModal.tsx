import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { BatchFormDto } from './BatchForm'
import BatchForm from '@components/analytics/batch-modal/BatchForm'
import FertilizersSelector from '@components/analytics/FertilizersSelector'
import ImageUpload from '@components/analytics/ImageUpload'
import MulchLayersSelector from '@components/analytics/MulchLayersSelector'
import SupportSpeciesSelector from '@components/analytics/SupportSpeciesSelector'
import TreeSpeciesSelector from '@components/analytics/TreeSpeciesSelector'
import { SnackbarContext } from '@components/context/SnackbarContext'
import useApiClient from '@hooks/ApiClientHook'
import type { FertilizerType, MulchLayerType, Seeds, SiteSummary, Species, TreeType } from '@services/api'
import { assetFormatter } from '@utils/assetFormatter'

type Props = {
  readonly open: boolean,
  readonly site: SiteSummary,
  readonly handleClose: (reason?: 'create') => void,
}

type CreateBatchSponsorDto = {
  name: string,
  websiteUrl: string,
  logo: File,
}

type CreateBatchDto = {
  siteId: number,
  name?: string,
  sponsor?: CreateBatchSponsorDto,
  size?: number,
  soilCondition?: string,
  plantCount?: number,
  survivedCount?: number,
  replaceCount?: number,
  totalNumberSeed?: number,
  totalPropagation?: number,
  image?: File,
  fertilizers: FertilizerType[],
  mulchLayers: MulchLayerType[],
  seeds: Seeds[],
  species: Species[],
  supportedSpecies: TreeType[],
}

const defaultCreateBatch: CreateBatchDto = {
  siteId: 0,
  name: undefined,
  size: undefined,
  soilCondition: undefined,
  sponsor: undefined,
  supportedSpecies: [],
  plantCount: undefined,
  survivedCount: undefined,
  replaceCount: undefined,
  totalNumberSeed: undefined,
  totalPropagation: undefined,
  image: undefined,
  fertilizers: [],
  mulchLayers: [],
  seeds: [],
  species: [],
}

const CreateBatchModal = ({ open, site, handleClose }: Props) => {
  const { t } = useTranslation()
  const { getApiClient } = useApiClient()
  const { openAlertSnackbar } = useContext(SnackbarContext)

  const [batch, setBatch] = useState<BatchFormDto>(defaultCreateBatch)

  const handleBatchChange = (batchFormDto: BatchFormDto) => {
    console.log('BATCH CHANGE batchFormDto:', batchFormDto)

    setBatch(batchFormDto)
  }

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
    resetBatch()
    handleClose('create')

    return true
  }

  const resetBatch = () => {
    console.log('RESET HERE')
  }

  const onClose = () => {
    resetBatch()
    handleClose()
  }

  return (
    <Dialog fullWidth maxWidth='sm' onClose={onClose} open={open}>
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
          onClick={() => onClose()}
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
