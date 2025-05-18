import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SnackbarContext } from '@components/context/SnackbarContext'
import UrlTextField from '@components/inputs/UrlTextField'
import useApiClient from '@hooks/ApiClientHook'
import { Announcement, type IAnnouncement, PatchedAnnouncement } from '@services/api'

type Props = {
  readonly announcement: Announcement,
  readonly isOpen: boolean,
  readonly handleClose: (contact: Announcement | null) => void,
}

const SiteAnnouncementModal = ({ announcement, isOpen, handleClose }: Props) => {
  const { t } = useTranslation()
  const [editedAnnouncement, setEditedAnnouncement] = useState<IAnnouncement>(
    announcement,
  )
  const [isFormValid, setIsFormValid] = useState<boolean>(true)
  const { getApiClient } = useApiClient()
  const { openAlertSnackbar } = useContext(SnackbarContext)

  useEffect(() => {
    if (!isOpen) setEditedAnnouncement(announcement)
  }, [isOpen, announcement])

  const handleSubmitSiteAnnouncement = async () => {
    try {
      await getApiClient().announcementClient.update(
        announcement.id,
        new PatchedAnnouncement(editedAnnouncement),
      )
    } catch {
      openAlertSnackbar(
        t('social.announcement.feedback.edit-error'),
        { severity: 'error' },
      )

      return
    }
    openAlertSnackbar(
      t('social.announcement.feedback.edit-success'),
    )
    handleClose(new Announcement(editedAnnouncement))
  }

  return (
    <Dialog fullWidth maxWidth='sm' onClose={() => handleClose(null)} open={isOpen}>
      <DialogTitle>{t('social.announcement.title')}</DialogTitle>
      <DialogContent>
        <form className='d-flex flex-column'>
          <div className='d-flex flex-column gap-4'>
            <div>
              <label className='form-label' htmlFor='address'>
                {t('social.announcement.body')}
              </label>
              <textarea
                className='form-control'
                id='body'
                maxLength={1000}
                onChange={event =>
                  setEditedAnnouncement(value => ({ ...value, body: event.target.value }))}
                rows={5}
                value={editedAnnouncement.body}
              />
            </div>
            <div>
              <label className='form-label' htmlFor='link'>
                {t('social.announcement.link')}
              </label>
              <UrlTextField
                attributes={{ id: 'link' }}
                isValid={value => setIsFormValid(value)}
                onChange={eventValue =>
                  setEditedAnnouncement(value => ({ ...value, link: eventValue }))}
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

        <button
          className='btn btn-primary'
          disabled={!isFormValid}
          onClick={async () => handleSubmitSiteAnnouncement()}
          type='button'
        >
          {t('generic.edit')}
        </button>
      </DialogActions>
    </Dialog>
  )
}

export default SiteAnnouncementModal
