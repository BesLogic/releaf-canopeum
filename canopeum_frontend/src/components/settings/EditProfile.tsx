import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { SnackbarContext } from '@components/context/SnackbarContext'
import { PatchedUpdateUser } from '@services/api'
import getApiClient from '@services/apiInterface'
import { type InputValidationError, isValidEmail } from '@utils/validators'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const EditProfile = () => {
  const { t: translate } = useTranslation()
  const { currentUser, updateUser } = useContext(AuthenticationContext)
  const { openAlertSnackbar } = useContext(SnackbarContext)

  const [username, setUsername] = useState(currentUser?.username ?? '')
  const [email, setEmail] = useState(currentUser?.email ?? '')

  const [usernameError, setUsernameError] = useState<InputValidationError | undefined>()
  const [emailError, setEmailError] = useState<InputValidationError | undefined>()

  const [changesToSave, setChangesToSave] = useState(false)

  useEffect(() => {
    if (changesToSave) return

    setUsername(currentUser?.username ?? '')
    setEmail(currentUser?.email ?? '')
  }, [currentUser, changesToSave])

  useEffect(() => {
    if (!currentUser) return

    setChangesToSave(username !== currentUser.username || email !== currentUser.email)
  }, [username, email, currentUser])

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

  const validateForm = () => {
    // Do not return directly the method calls;
    // we need each of them to be called before returning the result
    const usernameValid = validateUsername()
    const emailValid = validateEmail()

    return usernameValid && emailValid
  }

  const handleCancel = () => {
    if (!currentUser) return

    setUsername(currentUser.username)
    setEmail(currentUser.email)
    setUsernameError(undefined)
    setEmailError(undefined)
  }

  const handleSaveProfile = async () => {
    if (!currentUser) return

    const isFormValid = validateForm()
    if (!isFormValid) return

    const updatedInfo = new PatchedUpdateUser({ username, email })
    const updatedUser = await getApiClient().userClient.update(currentUser.id, updatedInfo)
    updateUser(updatedUser)
    openAlertSnackbar(translate('settings.edit-profile.profile-saved'), { severity: 'success' })
  }

  return (
    <div className='d-flex flex-column h-100'>
      <h2 className='text-light'>{translate('settings.edit-profile.title')}</h2>

      <div className='bg-white rounded-2 mt-4 px-4 py-3 flex-grow-1 row m-0 justify-content-center'>
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
              {translate('generic.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
