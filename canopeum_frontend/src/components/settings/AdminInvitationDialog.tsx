import { Dialog, DialogContent } from '@mui/material'
import { useTranslation } from 'react-i18next'

type Props = {
  readonly open: boolean,
  readonly handleClose: () => void,
}

const AdminInvitationDialog = ({ open, handleClose }: Props) => {
  const { t: translate } = useTranslation()

  return (
    <Dialog fullWidth maxWidth='sm' onClose={handleClose} open={open}>
      <DialogContent className='pb-5'>
        <div>
          <span>HELLO</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AdminInvitationDialog
