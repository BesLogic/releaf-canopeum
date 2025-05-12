import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import facebookLogo from '@assets/icons/facebook-contact-logo.svg'
import instagramLogo from '@assets/icons/instagram-contact-logo.svg'
import linkedinLogo from '@assets/icons/linkedin-contact-logo.svg'
import xLogo from '@assets/icons/x-contact-logo.svg'
import { SnackbarContext } from '@components/context/SnackbarContext'
import EmailTextField from '@components/inputs/EmailTextField'
import PhoneTextField from '@components/inputs/PhoneTextField'
import UrlTextField from '@components/inputs/UrlTextField'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import type { Contact, PatchedContact } from '@services/api'

type Props = {
  readonly contact: Contact,
  readonly isOpen: boolean,
  readonly handleClose: (contact: Contact | null) => void,
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
  const [isFormValid, setIsFormValid] = useState<boolean>(true)
  const { getApiClient } = useApiClient()
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { displayUnhandledAPIError } = useErrorHandling()

  useEffect(() => {
    if (!isOpen) setEditedContact(contact)
  }, [isOpen, contact])

  const handleSubmitSiteContact = () =>
    getApiClient()
      .contactClient
      .update(contact.id, editedContact as PatchedContact)
      .then(() => {
        openAlertSnackbar(t('social.contact.feedback.edit-success'))
        handleClose(editedContact as Contact)
      })
      .catch(displayUnhandledAPIError('social.contact.feedback.edit-error'))

  return (
    <Dialog fullWidth maxWidth='sm' onClose={() => handleClose(null)} open={isOpen}>
      <DialogTitle>{t('social.contact.title')}</DialogTitle>
      <DialogContent>
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
                attributes={{ id: 'email' }}
                isValid={value => setIsFormValid(value)}
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
                attributes={{ id: 'phone' }}
                isValid={value => setIsFormValid(value)}
                onChange={eventValue =>
                  setEditedContact(value => ({ ...value, phone: eventValue }))}
                value={editedContact.phone}
              />
            </div>
            <div className='d-flex'>
              <img alt='facebook-logo' className='px-2' src={facebookLogo} />
              <UrlTextField
                attributes={{ id: 'facebookLink' }}
                isValid={value => setIsFormValid(value)}
                onChange={eventValue =>
                  setEditedContact(value => ({ ...value, facebookLink: eventValue }))}
                value={editedContact.facebookLink}
              />
            </div>
            <div className='d-flex'>
              <img alt='x-logo' className='px-2' src={xLogo} />
              <UrlTextField
                attributes={{ id: 'xLink' }}
                isValid={value => setIsFormValid(value)}
                onChange={eventValue =>
                  setEditedContact(value => ({ ...value, xLink: eventValue }))}
                value={editedContact.xLink}
              />
            </div>
            <div className='d-flex'>
              <img alt='instagram-logo' className='px-2' src={instagramLogo} />
              <UrlTextField
                attributes={{ id: 'instagramLink' }}
                isValid={value => setIsFormValid(value)}
                onChange={eventValue =>
                  setEditedContact(value => ({ ...value, instagramLink: eventValue }))}
                value={editedContact.instagramLink}
              />
            </div>
            <div className='d-flex'>
              <img alt='linkedin-logo' className='px-2' src={linkedinLogo} />
              <UrlTextField
                attributes={{ id: 'linkedinLink' }}
                isValid={value => setIsFormValid(value)}
                onChange={eventValue =>
                  setEditedContact(value => ({ ...value, linkedinLink: eventValue }))}
                value={editedContact.linkedinLink}
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
          onClick={() => handleSubmitSiteContact()}
          type='button'
        >
          {t('generic.edit')}
        </button>
      </DialogActions>
    </Dialog>
  )
}

export default SiteContactModal
