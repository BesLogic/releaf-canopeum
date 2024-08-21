import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import type { Contact, PatchedContact } from '@services/api'
import { useTranslation } from 'react-i18next'
import { useContext, useState } from 'react'
import useApiClient from '@hooks/ApiClientHook'
import { SnackbarContext } from '@components/context/SnackbarContext'
import facebookLogo from '@assets/icons/facebook-contact-logo.svg'
import instagramLogo from '@assets/icons/instagram-contact-logo.svg'
import linkedinLogo from '@assets/icons/linkedin-contact-logo.svg'
import xLogo from '@assets/icons/x-contact-logo.svg'
import UrlTextField from '@components/inputs/UrlTextField'
import EmailTextField from '@components/inputs/EmailTextField'
import PhoneTextField from '@components/inputs/PhoneTextField'

type Props = {
  readonly contact: Contact,
  isOpen: boolean,
  handleClose: (contact: Contact | null) => void,
}

type EditSiteContactDto = {
  address?: string,
  email?: string,
  phone?: string,
  facebookLink?: string,
  xLink?: string,
  instagramLink?: string,
  linkedinLink?: string,
}

const SiteContactModal = ({ contact, isOpen, handleClose }: Props) => {
  const { t } = useTranslation()
  const [editedContact, setEditedContact] = useState<EditSiteContactDto>(contact)
  const { getApiClient } = useApiClient()
  const { openAlertSnackbar } = useContext(SnackbarContext)

  const handleSubmitSiteContact = async () => {
    await getApiClient().contactClient.update(contact.id, editedContact as PatchedContact).then(
      () => {
        openAlertSnackbar(
          t('social.contact.feedback.edit-success'),
        )
        handleClose(editedContact as Contact)
      },
    ).catch((error: unknown) => {
      console.error(error)

      openAlertSnackbar(
        t('social.contact.feedback.edit-error'),
        { severity: 'error' },
      )
    })
  }

  return (
    <Dialog fullWidth maxWidth='sm' open={isOpen} onClose={() => handleClose(null)}>
      <DialogTitle>{t('social.contact.title')}</DialogTitle>
      <DialogContent className='pb-5'>
        <form className='d-flex flex-column'>
          <div className='d-flex flex-column gap-4'>
            <div>
              <label className='form-label' htmlFor='address'>
                {t('social.contact.address')}
              </label>
              <input
                className='form-control'
                id='address'
                onChange={event =>
                  setEditedContact(value => ({ ...value, address: event.target.value }))}
                type='text'
                value={editedContact.address}
              />
            </div>
            <div>
              <label className='form-label' htmlFor='email'>
                {t('social.contact.email')}
              </label>
              <EmailTextField
                attributes={{ className: 'form-control', id: 'email' }}
                onChange={eventValue =>
                  setEditedContact(value => ({ ...value, email: eventValue }))}
                value={editedContact.email}
              />
            </div>
            <div>
              <label className='form-label' htmlFor='phone'>
                {t('social.contact.phone')}
              </label>
              <PhoneTextField
                attributes={{ className: 'form-control', id: 'phone' }}
                onChange={eventValue =>
                  setEditedContact(value => ({ ...value, phone: eventValue }))}
                value={editedContact.phone}
              />
            </div>
            <div className='d-flex'>
              <img alt='facebook-logo' className='px-2' src={facebookLogo} />
              <UrlTextField
                value={editedContact.facebookLink}
                attributes={{
                  className: 'form-control',
                  id: 'facebookLink',
                }}
                onChange={eventValue =>
                  setEditedContact(value => ({ ...value, facebookLink: eventValue }))}
              />
            </div>
            <div className='d-flex'>
              <img alt='x-logo' className='px-2' src={xLogo} />
              <UrlTextField
                value={editedContact.xLink}
                attributes={{
                  className: 'form-control',
                  id: 'xLink',
                }}
                onChange={eventValue =>
                  setEditedContact(value => ({ ...value, xLink: eventValue }))}
              />
            </div>
            <div className='d-flex'>
              <img alt='instagram-logo' className='px-2' src={instagramLogo} />
              <UrlTextField
                value={editedContact.instagramLink}
                attributes={{ className: 'form-control', id: 'instagramLink' }}
                onChange={eventValue =>
                  setEditedContact(value => ({ ...value, instagramLink: eventValue }))}
              />
            </div>
            <div className='d-flex'>
              <img alt='linkedin-logo' className='px-2' src={linkedinLogo} />
              <UrlTextField
                value={editedContact.linkedinLink}
                attributes={{
                  className: 'form-control',
                  id: 'linkedinLink',
                }}
                onChange={eventValue =>
                  setEditedContact(value => ({ ...value, linkedinLink: eventValue }))}
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
          onClick={async () => handleSubmitSiteContact()}
          type='button'
        >
          {t('generic.edit')}
        </button>
      </DialogActions>
    </Dialog>
  )
}

export default SiteContactModal
