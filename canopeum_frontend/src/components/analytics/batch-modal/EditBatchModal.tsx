/* eslint-disable max-lines -- disable max-lines */
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import FertilizersSelector from '@components/analytics/FertilizersSelector'
import MulchLayersSelector from '@components/analytics/MulchLayersSelector'
import SupportSpeciesSelector from '@components/analytics/SupportSpeciesSelector'
import TreeSpeciesSelector from '@components/analytics/TreeSpeciesSelector'
import { SnackbarContext } from '@components/context/SnackbarContext'
import useApiClient from '@hooks/ApiClientHook'
import { type BatchDetail, type Batchfertilizer, type BatchMulchLayer, type BatchSupportedSpecies, Seeds, Species } from '@services/api'
import { floorNumberValue } from '@utils/formUtils'

type Props = {
  readonly batchToEdit: BatchDetail,
  readonly handleClose: (reason?: 'edit') => void,
}

type EditBatchDto = {
  id: number,
  name?: string,
  sponsor?: string,
  size?: number,
  soilCondition?: string,
  plantCount?: number,
  survivedCount?: number,
  replaceCount?: number,
  totalNumberSeed?: number,
  totalPropagation?: number,
  // TODO: image?: File,
  fertilizers: Batchfertilizer[],
  mulchLayers: BatchMulchLayer[],
  seeds: Seeds[],
  species: Species[],
  supportedSpecies: BatchSupportedSpecies[],
}

const transformToEditBatchDto = (batchDetail: BatchDetail): EditBatchDto => ({
  ...batchDetail,
  seeds: batchDetail.seeds.map(seed => new Seeds(seed)),
  species: batchDetail.species.map(specie => new Species(specie)),
})

const BatchModal = ({ batchToEdit, handleClose }: Props) => {
  const { t } = useTranslation()
  const { getApiClient } = useApiClient()
  const { openAlertSnackbar } = useContext(SnackbarContext)

  const [batch, setBatch] = useState<EditBatchDto>(transformToEditBatchDto(batchToEdit))

  const handleSubmitBatch = async () => {
    const {
      id,
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
      // image,
    } = batch

    // TODO:
    // const batchImage = image
    //   ? await assetFormatter(image)
    //   : undefined

    try {
      await getApiClient().batchClient.update(
        id,
        name,
        sponsor,
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
    resetBatch()
    handleClose('edit')
  }

  const onClose = () => {
    resetBatch()
    handleClose()
  }

  const resetBatch = () => setBatch(transformToEditBatchDto(batchToEdit))

  return (
    <Dialog fullWidth maxWidth='sm' onClose={onClose} open={!!batchToEdit}>
      <DialogTitle>
        <div className='fs-5 text-capitalize m-auto text-center'>
          {t('analyticsSite.batch-modal.edit-title')}
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
              <label className='form-label text-capitalize' htmlFor='sponsor'>
                {t('analyticsSite.batch-modal.sponsor-label')}
              </label>
              <input
                className='form-control'
                id='sponsor'
                onChange={event => setBatch(value => ({ ...value, sponsor: event.target.value }))}
                type='text'
                value={batch.sponsor}
              />
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
          </div>
        </form>
      </DialogContent>

      <DialogActions>
        <button
          className='btn btn-outline-primary'
          onClick={() => handleClose()}
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
