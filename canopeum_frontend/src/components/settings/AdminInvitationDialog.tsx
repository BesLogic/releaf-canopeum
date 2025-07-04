import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SnackbarContext } from '@components/context/SnackbarContext'
import OptionQuantitySelector, { type SelectorOption, type SelectorOptionQuantity } from '@components/inputs/OptionQuantitySelector'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import { CreateUserInvitation } from '@services/api'
import { type InputValidationError, isValidEmail } from '@utils/validators'

type Props = {
  readonly open: boolean,
  readonly handleClose: () => void,
}

const AdminInvitationDialog = ({ open, handleClose }: Props) => {
  const { t: translate } = useTranslation()
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { getErrorMessage, displayUnhandledAPIError } = useErrorHandling()
  const { getApiClient } = useApiClient()

  const [availableSiteOptions, setAvailableSiteOptions] = useState<SelectorOption<number>[]>([])
  const [siteOptions, setSiteOptions] = useState<SelectorOption<number>[]>([])
  const [selected, setSelected] = useState<SelectorOptionQuantity<number>[]>([])

  const [invitationLink, setInvitationLink] = useState<string>()

  const [email, setEmail] = useState('')
  const [siteIds, setSiteIds] = useState<number[]>([])

  const [emailError, setEmailError] = useState<InputValidationError | undefined>()
  const [generateLinkError, setGenerateLinkError] = useState<string>()

  useEffect(() => {
    const fetchAllSites = async () => {
      const sites = await getApiClient().siteClient.all()
      const mappedSites = sites.map(site => ({ displayText: site.name, value: site.id }))

      setAvailableSiteOptions(mappedSites)
      setSiteOptions(mappedSites)
    }

    fetchAllSites().catch(displayUnhandledAPIError('errors.fetch-all-sites-failed'))
  }, [])

  const validateEmail = () => {
    if (!email) {
      setEmailError('required')

      return false
    }

    if (!isValidEmail(email)) {
      setEmailError('email')

      return false
    }

    setEmailError(undefined)

    return true
  }

  const validateForm = () =>
    // Do not return directly the method calls;
    // we need each of them to be called before returning the result
    validateEmail()

  const handleGenerateLinkClick = async () => {
    const isFormValid = validateForm()
    if (!isFormValid) return

    try {
      const createUserInvitation = new CreateUserInvitation({
        email,
        siteIds,
      })
      const response = await getApiClient().userInvitationClient.create(createUserInvitation)

      setInvitationLink(`${globalThis.location.origin}/register?code=${response.code}`)
    } catch (error: unknown) {
      setGenerateLinkError(getErrorMessage(
        error,
        translate('settings.manage-admins.generate-link-error'),
      ))
    }
  }

  const handleCopyLinkClick = () => {
    if (!invitationLink) return
    navigator.clipboard.writeText(invitationLink)
      .then(() =>
        openAlertSnackbar(`${translate('generic.copied-clipboard')}!`, { severity: 'info' })
      )
      .catch(displayUnhandledAPIError('errors.copy-to-clipboard-failed'))
  }

  const onCloseModal = () => {
    // Reset all fields before closing the modal
    setInvitationLink(undefined)
    setEmail('')
    setSiteIds([])
    setEmailError(undefined)
    setGenerateLinkError(undefined)

    handleClose()
  }

  const handleSiteChange = (selectedOptions: SelectorOptionQuantity<number>[]) => {
    const filtered = availableSiteOptions.filter(
      availableSiteOption =>
        !selectedOptions.some(
          selectedOption => selectedOption.option.value === availableSiteOption.value,
        ),
    )

    setSiteOptions(filtered)
    setSelected(selectedOptions)
  }

  const renderInvitationContent = () =>
    invitationLink
      ? (
        <div className='d-flex flex-column gap-3'>
          <span className='text-primary text-decoration-underline'>{invitationLink}</span>

          <div>
            <span>{translate('settings.manage-admins.copy-link-message')}</span>
            <span className='ms-1 fw-bold'>{email}</span>
          </div>
        </div>
      )
      : (
        <>
          <label aria-required htmlFor='email-input'>{translate('auth.email-label')}</label>
          <input
            aria-describedby='email'
            className={`form-control ${
              emailError
                ? 'is-invalid'
                : ''
            }`}
            id='email-input'
            onBlur={() => validateEmail()}
            onChange={event => setEmail(event.target.value)}
            type='email'
          />
          {emailError === 'required' && (
            <span className='help-block text-danger'>
              {translate('auth.email-error-required')}
            </span>
          )}
          {emailError === 'email' && (
            <span className='help-block text-danger'>
              {translate('auth.email-error-format')}
            </span>
          )}

          <div className='mt-4'>
            <OptionQuantitySelector
              id='sites-selector'
              label={`${translate('settings.manage-admins.assign-to-label')} *`}
              onChange={handleSiteChange}
              options={siteOptions}
              selected={selected}
            />
          </div>

          {generateLinkError && (
            <div className='mt-3'>
              <span className='help-block text-danger'>{generateLinkError}</span>
            </div>
          )}
        </>
      )

  const renderActionButton = () =>
    invitationLink
      ? (
        <button
          className='btn btn-primary'
          onClick={handleCopyLinkClick}
          type='button'
        >
          {translate('settings.manage-admins.copy-link')}
        </button>
      )
      : (
        <button
          className='btn btn-primary'
          onClick={handleGenerateLinkClick}
          type='button'
        >
          {translate('settings.manage-admins.generate-link')}
        </button>
      )

  return (
    <Dialog fullWidth maxWidth='sm' onClose={onCloseModal} open={open}>
      <DialogTitle>{translate('settings.manage-admins.invite-admin')}</DialogTitle>
      <DialogContent>{renderInvitationContent()}</DialogContent>
      <DialogActions>
        <button
          className='btn btn-outline-primary'
          onClick={onCloseModal}
          type='button'
        >
          {translate('generic.cancel')}
        </button>

        {renderActionButton()}
      </DialogActions>
    </Dialog>
  )
}

export default AdminInvitationDialog
