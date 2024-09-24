/* eslint-disable max-lines -- disable max-lines */
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import FertilizersSelector from '@components/analytics/FertilizersSelector'
import ImageUpload from '@components/analytics/ImageUpload'
import MulchLayersSelector from '@components/analytics/MulchLayersSelector'
import SupportSpeciesSelector from '@components/analytics/SupportSpeciesSelector'
import TreeSpeciesSelector from '@components/analytics/TreeSpeciesSelector'
import { SnackbarContext } from '@components/context/SnackbarContext'
import useApiClient from '@hooks/ApiClientHook'
import type { BatchSponsor, BatchSupportedSpecies, FertilizerType, MulchLayerType, Seeds, SiteSummary, Species } from '@services/api'
import { assetFormatter } from '@utils/assetFormatter'
import { floorNumberValue } from '@utils/formUtils'

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
  supportedSpecies: BatchSupportedSpecies[],
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

  const [batch, setBatch] = useState<CreateBatchDto>(defaultCreateBatch)
  const [batchImageURL, setBatchImageURL] = useState<string>()
  const [sponsorLogoUrl, setSponsorLogoUrl] = useState<string>()

  const handleSubmitBatch = async () => {
    const {
      name,
      size,
      soilCondition,
      sponsor,
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

    const batchImage = image
      ? await assetFormatter(image)
      : undefined

    try {
      await getApiClient().batchClient.create(
        site.id,
        name,
        sponsor,
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

      return
    }
    openAlertSnackbar(
      t('analyticsSite.batch-modal.feedback.create-success'),
    )
    resetBatch()
    handleClose('create')
  }

  const onImageUpload = (file: File) => {
    setBatch(value => ({ ...value, image: file }))
    setBatchImageURL(URL.createObjectURL(file))
  }

  const onSponsorLogoUpload = (file: File) => {
    // Update sponsor value here?
    setBatch(value => ({
      ...value,
      sponsor: {
        name: value.sponsor?.name ?? '',
        websiteUrl: value.sponsor?.websiteUrl ?? '',
        logo: file,
      },
    }))
    setSponsorLogoUrl(URL.createObjectURL(file))
  }

  const onClose = () => {
    resetBatch()
    handleClose()
  }

  const resetBatch = () => {
    setBatch({ ...defaultCreateBatch })
    setBatchImageURL(undefined)
  }

  return (
    <Dialog fullWidth maxWidth='sm' onClose={onClose} open={open}>
      <DialogTitle>
        <div className='fs-5 text-capitalize m-auto text-center'>
          {t('analyticsSite.batch-modal.create-title')}
        </div>
      </DialogTitle>

      <DialogContent className='pb-5'>
        <form>
          <div className='d-flex flex-column gap-3'>
            <div>
              <label className='form-label' htmlFor='batch-name'>
                {t('analyticsSite.batch-modal.name-label')}
              </label>
              <input
                className='form-control'
                id='batch-name'
                onChange={event => setBatch(value => ({ ...value, name: event.target.value }))}
                type='text'
                value={batch.name}
              />
            </div>

            <div>
              <label className='form-label text-capitalize' htmlFor='sponsor-name'>
                {t('analyticsSite.batch-modal.sponsor-name-label')}
              </label>
              <input
                className='form-control'
                id='sponsor-name'
                onChange={event =>
                  setBatch(value => ({
                    ...value,
                    sponsor: value.sponsor
                      ? { ...value.sponsor }
                      : undefined,
                  }))}
                type='text'
                value={batch.sponsor?.name}
              />
            </div>

            <div>
              <label className='form-label text-capitalize' htmlFor='sponsor-website-url'>
                {t('analyticsSite.batch-modal.sponsor-website-url-label')}
              </label>
              <input
                className='form-control'
                id='sponsor-website-url'
                onChange={event => setBatch(value => ({ ...value, sponsor: undefined }))}
                type='text'
                value={batch.sponsor?.websiteUrl}
              />
            </div>

            <div>
              <label className='form-label text-capitalize' htmlFor='sponsor-logo'>
                {t('analyticsSite.batch-modal.sponsor-logo-label')}
              </label>
              <ImageUpload imageUrl={sponsorLogoUrl} onChange={onSponsorLogoUpload} />
            </div>

            <div>
              <label className='form-label text-capitalize' htmlFor='size'>
                {t('analyticsSite.batch-modal.size-label')}
              </label>
              <div className='input-group'>
                <input
                  className='form-control'
                  id='size'
                  min={0}
                  onChange={event =>
                    setBatch(value => ({
                      ...value,
                      size: Number.parseInt(event.target.value, 10),
                    }))}
                  type='number'
                  value={floorNumberValue(batch.size)}
                />
                <span className='input-group-text'>
                  {t('analyticsSite.batch-modal.feet-squared')}
                </span>
              </div>
            </div>

            <div>
              <TreeSpeciesSelector
                label='analyticsSite.batch-modal.number-of-trees-label'
                onChange={useCallback(
                  species =>
                    setBatch(current => ({
                      ...current,
                      species,
                    })),
                  [],
                )}
                species={batch.species}
              />
            </div>

            <div>
              <label className='form-label' htmlFor='soil-condition'>
                {t('analyticsSite.batch-modal.soil-condition-label')}
              </label>
              <input
                className='form-control'
                id='soil-condition'
                onChange={event =>
                  setBatch(value => ({ ...value, soilCondition: event.target.value }))}
                type='text'
                value={batch.soilCondition}
              />
            </div>

            <FertilizersSelector
              fertilizers={batch.fertilizers}
              onChange={useCallback(
                fertilizers =>
                  setBatch(current => ({
                    ...current,
                    fertilizers,
                  })),
                [],
              )}
            />

            <MulchLayersSelector
              mulchLayers={batch.mulchLayers}
              onChange={useCallback(
                mulchLayers =>
                  setBatch(current => ({
                    ...current,
                    mulchLayers,
                  })),
                [],
              )}
            />

            <SupportSpeciesSelector
              onChange={useCallback(
                supportedSpecies =>
                  setBatch(current => ({
                    ...current,
                    supportedSpecies,
                  })),
                [],
              )}
              species={batch.supportedSpecies}
            />

            <div>
              <label className='form-label text-capitalize' htmlFor='total-number-of-plants'>
                {t('analyticsSite.batch-modal.total-number-of-plants-label')}
              </label>
              <input
                className='form-control'
                id='total-number-of-plants'
                onChange={event =>
                  setBatch(value => ({
                    ...value,
                    plantCount: Number.parseInt(event.target.value, 10),
                  }))}
                type='number'
                value={floorNumberValue(batch.plantCount)}
              />
            </div>

            <div>
              <label className='form-label text-capitalize' htmlFor='survived'>
                {t('analyticsSite.batch-modal.survived-label')}
              </label>
              <input
                className='form-control'
                id='survived'
                onChange={event =>
                  setBatch(value => ({
                    ...value,
                    survivedCount: Number.parseInt(event.target.value, 10),
                  }))}
                type='number'
                value={floorNumberValue(batch.survivedCount)}
              />
            </div>

            <div>
              <label className='form-label text-capitalize' htmlFor='replaced'>
                {t('analyticsSite.batch-modal.replaced-label')}
              </label>
              <input
                className='form-control'
                id='replaced'
                onChange={event =>
                  setBatch(value => ({
                    ...value,
                    replaceCount: Number.parseInt(event.target.value, 10),
                  }))}
                type='number'
                value={floorNumberValue(batch.replaceCount)}
              />
            </div>

            <div>
              <TreeSpeciesSelector
                label='analyticsSite.batch-modal.seeds-per-species-label'
                onChange={useCallback(
                  species =>
                    setBatch(current => ({
                      ...current,
                      seeds: species,
                    })),
                  [],
                )}
                species={batch.seeds}
              />
            </div>

            <div>
              <label className='form-label text-capitalize' htmlFor='totalNumberSeed'>
                {t('analyticsSite.batch-modal.total-seeds-label')}
              </label>
              <input
                className='form-control'
                id='totalNumberSeed'
                onChange={event =>
                  setBatch(value => ({
                    ...value,
                    totalNumberSeed: Number.parseInt(event.target.value, 10),
                  }))}
                type='number'
                value={floorNumberValue(batch.totalNumberSeed)}
              />
            </div>

            <div>
              <label className='form-label text-capitalize' htmlFor='propagation'>
                {t('analyticsSite.batch-modal.propagation-label')}
              </label>
              <input
                className='form-control'
                id='propagation'
                onChange={event =>
                  setBatch(value => ({
                    ...value,
                    totalPropagation: Number.parseInt(event.target.value, 10),
                  }))}
                type='number'
                value={floorNumberValue(batch.totalPropagation)}
              />
            </div>

            <div className='mb-3'>
              <label className='form-label text-capitalize' htmlFor='batch-image'>
                {t('analyticsSite.batch-modal.images-label')}
              </label>
              <ImageUpload imageUrl={batchImageURL} onChange={onImageUpload} />
            </div>
          </div>
        </form>
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
