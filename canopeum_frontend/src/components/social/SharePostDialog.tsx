import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SnackbarContext } from '@components/context/SnackbarContext'
import { appRoutes } from '@constants/routes.constant'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import type { Post } from '@services/api'

type Props = {
  readonly onClose: () => void,
  readonly open: boolean,
  readonly post: Post,
}

const SharePostDialog = ({ onClose, open, post }: Props) => {
  const { t: translate } = useTranslation()
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { displayUnhandledAPIError } = useErrorHandling()

  const [shareUrl, setShareUrl] = useState('')

  useEffect(
    () => setShareUrl(`${globalThis.location.origin}${appRoutes.postDetail(post.id)}`),
    [post],
  )

  const handleCopyLinkClick = () => {
    if (!shareUrl) return

    navigator.clipboard.writeText(shareUrl)
      .then(() =>
        openAlertSnackbar(`${translate('generic.copied-clipboard')}!`, { severity: 'info' })
      )
      .catch(displayUnhandledAPIError('errors.copy-to-clibboard-failed'))
  }

  return (
    <Dialog fullWidth maxWidth='sm' onClose={onClose} open={open}>
      <DialogTitle>
        {translate('social.share-dialog.title')}
        <button
          className='
            btn
            unstyled-button
            position-absolute
            top-0
            end-0
          '
          onClick={onClose}
          type='button'
        >
          <span className='material-symbols-outlined'>cancel</span>
        </button>
      </DialogTitle>
      <DialogContent>
        <div>
          <div>
            <span>{translate('social.share-dialog.message')}</span>
          </div>

          <div className='mt-3'>
            <span className='text-primary text-decoration-underline'>{shareUrl}</span>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <button
          className='btn btn-primary'
          onClick={handleCopyLinkClick}
          type='button'
        >
          {translate('social.share-dialog.copy-link')}
        </button>
      </DialogActions>
    </Dialog>
  )
}

export default SharePostDialog
