import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  readonly children: ReactNode,
  readonly confirmText?: string
  readonly onClose: (proceed: boolean) => void,
  readonly open: boolean,
  readonly title: string,
}

const ConfirmationDialog = ({ children, confirmText, onClose, open, title }: Props) => {
  const { t: translate } = useTranslation()

  return (
    <Dialog fullWidth maxWidth='xs' onClose={() => onClose(false)} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className='pb-5'>
        {children}
      </DialogContent>
      <DialogActions>
        <button className="btn btn-outline-danger" onClick={() => onClose(false)} type='button'>
          {translate('generic.cancel')}
        </button>
        <button className="btn btn-outline-success" onClick={() => onClose(true)} type='button'>
          {confirmText ?? translate('generic.ok')}
        </button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
