/* eslint-disable max-lines -- Could be fixed by creating a global Input component */
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { SnackbarContext } from '@components/context/SnackbarContext'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import { ChangePassword, type IPatchedUpdateUser, PatchedUpdateUser } from '@services/api'
import { type InputValidationError, isValidEmail, isValidPassword, mustMatch } from '@utils/validators'

const EditProfile = () => {
  const { t: translate } = useTranslation()
  const { currentUser, updateUser } = useContext(AuthenticationContext)
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { getApiClient } = useApiClient()
  const { getErrorMessage } = useErrorHandling()

  const [username, setUsername] = useState(currentUser?.username ?? '')
  const [email, setEmail] = useState(currentUser?.email ?? '')

  const [doChangePassword, setDoChangePassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')

  const [usernameError, setUsernameError] = useState<InputValidationError | undefined>()
  const [emailError, setEmailError] = useState<InputValidationError | undefined>()
  const [currentPasswordError, setCurrentPasswordError] = useState<
    InputValidationError | undefined
  >()
  const [newPasswordError, setNewPasswordError] = useState<InputValidationError | undefined>()
  const [newPasswordConfirmationError, setNewPasswordConfirmationError] = useState<
    InputValidationError | undefined
  >()

  const [saveProfileError, setSaveProfileError] = useState<string>()
  const [changesToSave, setChangesToSave] = useState(false)

  useEffect(() => {
    if (changesToSave) return

    setUsername(currentUser?.username ?? '')
    setEmail(currentUser?.email ?? '')
  }, [currentUser, changesToSave])

  useEffect(() => {
    if (!currentUser) return

    setChangesToSave(
      username !== currentUser.username || email !== currentUser.email || doChangePassword,
    )
  }, [username, email, currentUser, doChangePassword])

  const validateUsername = () => {
    if (!username) {
      setUsernameError('required')

      return false
    }

    setUsernameError(undefined)

    return true
  }

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

  const validateCurrentPassword = () => {
    if (!doChangePassword) return true

    if (!currentPassword) {
      setCurrentPasswordError('required')

      return false
    }

    setCurrentPasswordError(undefined)

    return true
  }

  const validateNewPassword = () => {
    if (!doChangePassword) return true

    if (!newPassword) {
      setNewPasswordError('required')

      return false
    }

    if (!isValidPassword(newPassword)) {
      setNewPasswordError('password')

      return false
    }

    setNewPasswordError(undefined)

    return true
  }

  const validateNewPasswordConfirmation = () => {
    if (!doChangePassword) return true

    if (!newPasswordConfirmation) {
      setNewPasswordConfirmationError('required')

      return false
    }

    if (!mustMatch(newPasswordConfirmation, newPassword)) {
      setNewPasswordConfirmationError('mustMatch')

      return false
    }

    setNewPasswordConfirmationError(undefined)

    return true
  }

  const resetChangePassword = () => {
    // Reset the change password section
    setCurrentPassword('')
    setNewPassword('')
    setNewPasswordConfirmation('')
    setCurrentPasswordError(undefined)
    setNewPasswordError(undefined)
    setNewPasswordConfirmationError(undefined)
    setDoChangePassword(false)
  }

  const validateForm = () => {
    // Do not return directly the method calls;
    // we need each of them to be called before returning the result
    const usernameValid = validateUsername()
    const emailValid = validateEmail()
    if (!doChangePassword) {
      return usernameValid && emailValid
    }

    const currentPasswordValid = validateCurrentPassword()
    const newPasswordValid = validateNewPassword()
    const newPasswordConfirmationValid = validateNewPasswordConfirmation()

    return usernameValid
      && emailValid
      && currentPasswordValid
      && newPasswordValid
      && newPasswordConfirmationValid
  }

  const handleCancel = () => {
    if (!currentUser) return

    setUsername(currentUser.username)
    setEmail(currentUser.email)
    setUsernameError(undefined)
    setEmailError(undefined)

    resetChangePassword()
  }

  const handleSaveProfile = async () => {
    if (!currentUser) return

    const isFormValid = validateForm()
    if (!isFormValid) return

    try {
      const updateUserBody: IPatchedUpdateUser = { username, email }
      if (doChangePassword) {
        updateUserBody.changePassword = new ChangePassword({
          currentPassword,
          newPassword,
          newPasswordConfirmation,
        })
      }
      const updatedInfo = new PatchedUpdateUser(updateUserBody)
      const updatedUser = await getApiClient().userClient.update(currentUser.id, updatedInfo)
      updateUser(updatedUser)
      openAlertSnackbar(translate('settings.edit-profile.profile-saved'), { severity: 'success' })

      setSaveProfileError(undefined)
      resetChangePassword()
    } catch (error: unknown) {
      setSaveProfileError(
        getErrorMessage(error, translate('settings.edit-profile.save-profile-error')),
      )
    }
  }

  return (
    <div className='d-flex flex-column h-100'>
      <h2 className='text-light'>{translate('settings.edit-profile.title')}</h2>

      <div className='bg-cream rounded-2 mt-4 px-4 py-3 flex-grow-1 row m-0 justify-content-center'>
        <div className='
          h-100
          col-12
          col-lg-8
          col-xl-6
          m-0
          d-flex
          flex-column
          justify-content-between
          py-3
          gap-2
        '>
          <form className='form'>
            <div className='mb-4'>
              <label className='form-label' htmlFor='username'>
                {translate('auth.username-label')}
              </label>

              <input
                className='form-control'
                id='username'
                onBlur={() => validateUsername()}
                onChange={event => setUsername(event.target.value)}
                type='text'
                value={username}
              />
              {usernameError && (
                <span className='help-block text-danger'>
                  {translate('auth.username-error-required')}
                </span>
              )}
            </div>

            <div className='mb-4'>
              <label className='form-label' htmlFor='email'>{translate('auth.email-label')}</label>
              <input
                className='form-control'
                id='email'
                onBlur={() => validateEmail()}
                onChange={event => setEmail(event.target.value)}
                type='email'
                value={email}
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
            </div>

            <button
              className='btn btn-primary'
              onClick={() => setDoChangePassword(previous => !previous)}
              type='button'
            >
              {doChangePassword
                ? 'Keep Same Password'
                : 'Change Password'}
            </button>

            {doChangePassword && (
              <>
                <div className='mb-4 mt-4'>
                  <label htmlFor='password-input'>
                    {translate('settings.edit-profile.current-password')}
                  </label>

                  <input
                    className={`form-control ${
                      currentPasswordError
                        /* eslint-disable-next-line sonarjs/no-duplicate-string --
                        Could be fixed by creating a global Input component */
                        ? 'is-invalid'
                        : ''
                    }`}
                    id='password-input'
                    onBlur={() => validateCurrentPassword()}
                    onChange={event => setCurrentPassword(event.target.value)}
                    type='password'
                  />
                  {currentPasswordError === 'required' && (
                    <span className='help-block text-danger'>
                      {translate('auth.password-error-required')}
                    </span>
                  )}
                </div>

                <div className='mb-4'>
                  <label htmlFor='password-input'>
                    {translate('settings.edit-profile.new-password')}
                  </label>

                  <input
                    className={`form-control ${
                      newPasswordError
                        ? 'is-invalid'
                        : ''
                    }`}
                    id='password-input'
                    onBlur={() => validateNewPassword()}
                    onChange={event => setNewPassword(event.target.value)}
                    type='password'
                  />
                  {newPasswordError === 'required' && (
                    <span className='help-block text-danger'>
                      {translate('auth.password-error-required')}
                    </span>
                  )}
                  {newPasswordError === 'password' && (
                    <span className='help-block text-danger'>
                      {translate('auth.password-error-format')}
                    </span>
                  )}
                </div>

                <div className='mb-4'>
                  <label htmlFor='confirmation-password-input'>
                    {translate('settings.edit-profile.new-password-confirmation')}
                  </label>
                  <input
                    className={`form-control ${
                      newPasswordConfirmationError
                        ? 'is-invalid'
                        : ''
                    }`}
                    id='confirmation-password-input'
                    onBlur={() => validateNewPasswordConfirmation()}
                    onChange={event => setNewPasswordConfirmation(event.target.value)}
                    type='password'
                  />
                  {newPasswordConfirmationError === 'required' && (
                    <span className='help-block text-danger'>
                      {translate('auth.password-confirmation-error-required')}
                    </span>
                  )}
                  {newPasswordConfirmationError === 'mustMatch' && (
                    <span className='help-block text-danger'>
                      {translate('auth.password-error-must-match')}
                    </span>
                  )}
                </div>
              </>
            )}

            {saveProfileError && (
              <div className='mb-4'>
                <span className='help-block text-danger'>{saveProfileError}</span>
              </div>
            )}
          </form>

          <div className='form-actions d-flex justify-content-between align-items-center gap-5'>
            <button
              className='btn btn-outline-primary flex-grow-1'
              disabled={!changesToSave}
              onClick={handleCancel}
              type='button'
            >
              {translate('generic.cancel')}
            </button>
            <button
              className='btn btn-primary flex-grow-1'
              disabled={!changesToSave}
              onClick={handleSaveProfile}
              type='button'
            >
              {translate('generic.submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
