import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SnackbarContext } from '@components/context/SnackbarContext'
import UrlTextField from '@components/inputs/UrlTextField'
import useApiClient from '@hooks/ApiClientHook'
import type { Announcement, PatchedAnnouncement } from '@services/api'

type Props = {
  readonly announcement: Announcement,
  readonly isOpen: boolean,
  readonly handleClose: (contact: Announcement | null) => void,
}

type EditSiteAnnouncementDto = {
  body?: string,
  link?: string,
}

const SiteAnnouncementModal = ({ announcement, isOpen, handleClose }: Props) => {
  const { t } = useTranslation()
  const [editedAnnouncement, setEditedAnnouncement] = useState<EditSiteAnnouncementDto>(
    announcement,
  )
  const [isFormValid, setIsFormValid] = useState<boolean>(true)
  const { getApiClient } = useApiClient()
  const { openAlertSnackbar } = useContext(SnackbarContext)

  const handleSubmitSiteAnnouncement = async () => {
    try {
      await getApiClient().announcementClient.update(
        announcement.id,
        editedAnnouncement as PatchedAnnouncement,
      )
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
    <Dialog fullWidth maxWidth='sm' onClose={() => handleClose(null)} open={isOpen}>
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
                id='body'
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
                attributes={{
                  className: 'form-control',
                  id: 'link',
                }}
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