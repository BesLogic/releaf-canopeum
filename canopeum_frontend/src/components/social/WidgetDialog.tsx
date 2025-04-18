import { Dialog, DialogActions, DialogContent } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { IWidget } from '@services/api'

type Props = {
  readonly open: [boolean, IWidget | undefined],
  readonly handleClose: (
    reason?: 'backdropClick' | 'delete' | 'escapeKeyDown' | 'save',
    data?: IWidget,
  ) => void,
}

const defaultWidget: IWidget = {
  id: 0,
}

const MAXIMUM_CHARS_PER_WIDGET_BODY = 500

const WidgetDialog = ({ handleClose, open }: Props) => {
  const { t } = useTranslation()
  const [innerWidget, setInnerWidget] = useState<IWidget>(open[1] ?? defaultWidget)

  useEffect(() => setInnerWidget(open[1] ?? defaultWidget), [open])

  return (
    <Dialog
      fullWidth
      maxWidth='sm'
      onClose={(_, reason) => handleClose(reason)}
      open={open[0]}
    >
      <DialogContent>
        <form>
          <div className='mb-3'>
            <label className='form-label' htmlFor='widget-title'>
              {t('social.widgets.title')}
            </label>
            <div className='d-flex align-items-center gap-1'>
              <input
                className='form-control'
                id='widget-title'
                maxLength={20}
                onChange={event =>
                  setInnerWidget(value => ({ ...value, title: event.target.value }))}
                type='text'
                value={innerWidget.title}
              />
              {innerWidget.id !== 0 && (
                <button
                  className='btn btn-link'
                  onClick={() => handleClose('delete', innerWidget)}
                  type='button'
                >
                  <span className='material-symbols-outlined text-danger'>delete</span>
                </button>
              )}
            </div>
          </div>
          <div className='mb-3'>
            <div className='position-relative'>
              <label
                className='form-label position-absolute'
                htmlFor='widget-body'
                style={{ bottom: 0, right: 0, marginRight: '.5rem', marginBottom: '.5rem' }}
              >
                {t('social.widgets.max_character', { count: MAXIMUM_CHARS_PER_WIDGET_BODY })}
              </label>

              <textarea
                className='form-control'
                id='widget-body'
                maxLength={1000}
                onChange={event =>
                  setInnerWidget(value => ({ ...value, body: event.target.value }))}
                rows={3}
                style={{ padding: '.75rem .75rem 2.25rem .75rem' }}
                value={innerWidget.body}
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
        <button
          className='btn btn-primary'
          onClick={() => handleClose('save', innerWidget)}
          type='button'
        >
          {t('generic.submit')}
        </button>
      </DialogActions>
    </Dialog>
  )
}

export default WidgetDialog
