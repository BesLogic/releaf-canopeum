import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type ConfirmationAction = 'cancel' | 'delete' | 'ok'

type Props = {
  readonly actions: ConfirmationAction[],
  readonly children: ReactNode,
  readonly onClose: (proceed: boolean) => void,
  readonly open: boolean,
  readonly title: string,
}

const ConfirmationDialog = ({ actions, children, onClose, open, title }: Props) => {
  const { t: translate } = useTranslation()

  const renderActionButton = (action: ConfirmationAction) => {
    let buttonClasses = 'btn'
    let buttonText = ''
    let proceed = false
    switch (action) {
      case 'delete': {
        buttonClasses += ' btn-outline-danger'
        buttonText = translate('generic.delete')

        break
      }
      case 'cancel': {
        buttonClasses += ' btn-outline-dark'
        buttonText = translate('generic.cancel')

        break
      }
      // action "ok"
      default: {
        buttonClasses += ' btn-outline-primary'
        buttonText = translate('generic.ok')
        proceed = true

        break
      }
    }

    return (
      <button className={buttonClasses} onClick={() => onClose(proceed)} type='button'>
        {buttonText}
      </button>
    )
  }

  return (
    <Dialog fullWidth maxWidth='xs' onClose={() => onClose(false)} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className='pb-5'>
        {children}
      </DialogContent>
      <DialogActions>
        {actions.map(action => renderActionButton(action))}
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
