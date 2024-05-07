import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import type { IBatch, SiteSummary } from '@services/api'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  readonly open: boolean,
  readonly site: SiteSummary,
  readonly handleClose: () => void,
}

const defaultBatch: IBatch = {
  id: 0,
  name: '',
  size: '',
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
          <div className='mb-3'>
            <label className='form-label text-capitalize' htmlFor='batch-name'>
              {translate('analyticsSite.batch-modal.batch-name')}
            </label>
            <input
              className='form-control'
              id='batch-name'
              onChange={event => setBatch(value => ({ ...value, name: event.target.value }))}
              type='text'
              value={batch.name}
            />
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
        <button className='btn btn-primary' onClick={() => handleClose()} type='button'>
          {translate('generic.submit')}
        </button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateBatchModal
