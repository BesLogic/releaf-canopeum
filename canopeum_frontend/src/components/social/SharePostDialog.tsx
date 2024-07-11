import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SnackbarContext } from '@components/context/SnackbarContext'
import { APP_CONFIG } from '@config/config'
import { appRoutes } from '@constants/routes.constant'
import type { Post } from '@services/api'

type Props = {
  readonly onClose: () => void,
  readonly open: boolean,
  readonly post: Post,
}

const SharePostDialog = ({ onClose, open, post }: Props) => {
  const { t: translate } = useTranslation()
  const { openAlertSnackbar } = useContext(SnackbarContext)

  const [shareUrl, setShareUrl] = useState('')

  useEffect(
    () => setShareUrl(`${APP_CONFIG.appBaseUrl}${appRoutes.postDetail(post.id)}`),
    [post],
  )

  const handleCopyLinkClick = () => {
    if (!shareUrl) return

    void navigator.clipboard.writeText(shareUrl)
    openAlertSnackbar(`${translate('generic.copied-clipboard')}!`, { severity: 'info' })
  }

  return (
    <Dialog fullWidth maxWidth='sm' onClose={onClose} open={open}>
      <DialogTitle>{translate('social.share-dialog.title')}</DialogTitle>
      <DialogContent className='pb-5'>
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
          className='btn btn-outline-primary'
          onClick={onClose}
          type='button'
        >
          {translate('generic.cancel')}
        </button>
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
