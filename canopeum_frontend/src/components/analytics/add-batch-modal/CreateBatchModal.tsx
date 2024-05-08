import FertilizersSelector from '@components/analytics/FertilizersSelector'
import MulchLayersSelector from '@components/analytics/MulchLayersSelector'
import SupportSpeciesSelector from '@components/analytics/SupportSpeciesSelector'
import TreeSpeciesSelector from '@components/analytics/TreeSpeciesSelector'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import type { IBatch, SiteSummary } from '@services/api'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  readonly open: boolean,
  readonly site: SiteSummary,
  readonly handleClose: () => void,
}

const defaultBatch: IBatch = {
  id: 0,
  name: '',
  size: 0,
  soilCondition: '',
  sponsor: '',
  fertilizers: [],
  mulchLayers: [],
  supportedSpecies: [],
  plantCount: 0,
  survivedCount: 0,
  replaceCount: 0,
  seedCollectedCount: 0,
  seeds: [],
  species: [],
  updatedAt: new Date(),
}

const CreateBatchModal = ({ open, site, handleClose }: Props) => {
  const { t: translate } = useTranslation()

  const [batch, setBatch] = useState<IBatch>(defaultBatch)

  const handleSubmitBatch = () => {
    console.log('batch:', batch)
  }

  return (
    <Dialog fullWidth maxWidth='sm' onClose={() => handleClose()} open={open}>
      <DialogTitle>
        <div className='fs-5 text-capitalize m-auto text-center'>
          {translate('analyticsSite.batch-modal.title')}
        </div>
      </DialogTitle>

      <DialogContent className='pb-5'>
        <form>
          <div className='d-flex flex-column gap-3'>
            <div>
              <label className='form-label' htmlFor='batch-name'>
                {translate('analyticsSite.batch-modal.name-label')}
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
                {translate('analyticsSite.batch-modal.sponsor-label')}
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
                {translate('analyticsSite.batch-modal.size-label')}
              </label>
              <div className='input-group'>
                <input
                  className='form-control'
                  id='size'
                  min={0}
                  onChange={event =>
                    setBatch(value => ({
                      ...value,
                      size: Number.parseInt(event.target.value, 10) || undefined,
                    }))}
                  type='number'
                  value={batch.size}
                />
                <span className='input-group-text'>
                  {translate('analyticsSite.batch-modal.feet-squared')}
                </span>
              </div>
            </div>

            <div>
              <TreeSpeciesSelector
                onChange={useCallback(
                  species => setBatch(current => ({ ...current, species })),
                  [],
                )}
              />
            </div>

            <div>
              <label className='form-label' htmlFor='soil-condition'>
                {translate('analyticsSite.batch-modal.soil-condition-label')}
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

            <div>
              <FertilizersSelector
                onChange={useCallback(
                  fertilizers => setBatch(current => ({ ...current, fertilizers })),
                  [],
                )}
              />
            </div>

            <div>
              <MulchLayersSelector
                onChange={useCallback(
                  mulchLayers => setBatch(current => ({ ...current, mulchLayers })),
                  [],
                )}
              />
            </div>

            <div>
              <SupportSpeciesSelector
                onChange={useCallback(
                  supportedSpecies => setBatch(current => ({ ...current, supportedSpecies })),
                  [],
                )}
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
          {translate('generic.cancel')}
        </button>

        <button className='btn btn-primary' onClick={() => handleSubmitBatch()} type='button'>
          {translate('generic.submit')}
        </button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateBatchModal
