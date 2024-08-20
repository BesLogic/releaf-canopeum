import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import type { Announcement, PatchedAnnouncement } from '@services/api';
import { useTranslation } from 'react-i18next'
import { useContext, useState } from 'react';
import useApiClient from '@hooks/ApiClientHook';
import { SnackbarContext } from '@components/context/SnackbarContext'
type Props = {
  readonly announcement: Announcement,
  isOpen: boolean,
  handleClose: (contact: Announcement | null) => void,
}

type EditSiteAnnouncementDto = {
  body?: string,
  link?: string,
}

const SiteAnnouncementModal = ({ announcement, isOpen, handleClose }: Props) => {
  const { t } = useTranslation()
  const [editedAnnouncement, setEditedAnnouncement] = useState<EditSiteAnnouncementDto>(announcement)
  const { getApiClient } = useApiClient()
  const { openAlertSnackbar } = useContext(SnackbarContext)

  const handleSubmitSiteAnnouncement = async () => {

    try {
      await getApiClient().announcementClient.update(announcement.id, editedAnnouncement as PatchedAnnouncement)
    } catch (error: unknown) {
      console.error(error)

      openAlertSnackbar(
        t('social.announcement.feedback.edit-error'),
        { severity: 'error' },
      )

      return
    }
    openAlertSnackbar(
      t('social.announcement.feedback.edit-success'),
    )
    handleClose(editedAnnouncement as Announcement)
  }

  return (
    <Dialog fullWidth maxWidth='sm' open={isOpen} onClose={() => handleClose(null)} >
      <DialogTitle>{t('social.announcement.title')}</DialogTitle>
      <DialogContent className='pb-5'>
        <form className='d-flex flex-column'>
          <div className='d-flex flex-column gap-4'>
            <div>
              <label className='form-label' htmlFor='address'>
                {t('social.announcement.body')}
              </label>
              <textarea
                className='form-control'
                rows={5}
                id='body'
                onChange={event => setEditedAnnouncement(value => ({ ...value, body: event.target.value }))}
                value={editedAnnouncement.body}
              />
            </div>
            <div>
              <label className='form-label' htmlFor='link'>
                {t('social.announcement.link')}
              </label>
              <input
                className='form-control'
                id='link'
                onChange={event => setEditedAnnouncement(value => ({ ...value, link: event.target.value }))}
                type='text'
                value={editedAnnouncement.link}
              />
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <button
          className='btn btn-outline-primary'
          onClick={() => handleClose(null)}
          type='button'
        >
          {t('generic.cancel')}
        </button>

        <button className='btn btn-primary' onClick={async () => handleSubmitSiteAnnouncement()} type='button'>
          {t('generic.edit')}
        </button>
      </DialogActions>
    </Dialog>
  )
};

export default SiteAnnouncementModal;
