import { appRoutes } from '@constants/routes.constant'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import type { Post } from '@services/api'
import { useTranslation } from 'react-i18next'

type Props = {
  readonly onClose: (proceed: boolean) => void,
  readonly open: boolean,
  readonly post: Post,
}

const SharePostDialog = ({ onClose, open, post }: Props) => {
  const { t: translate } = useTranslation()

  // TODO(NicolasDontigny): use config url
  const shareUrl = `http://localhost:5173${appRoutes.postDetail(post.id)}`

  return (
    <Dialog fullWidth maxWidth='xs' onClose={() => onClose(false)} open={open}>
      <DialogTitle>Share post</DialogTitle>
      <DialogContent className='pb-5'>
        <div>
          <div>
            <span>Share Post!</span>
          </div>
          <div>
            <span>{shareUrl}</span>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <button className='btn btn-outline-primary' type='button'>Cancel</button>
        <button className='btn btn-primary' type='button'>Copy Link</button>
      </DialogActions>
    </Dialog>
  )
}

export default SharePostDialog
