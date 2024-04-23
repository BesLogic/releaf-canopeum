import AuthPageLayout from '@components/auth/AuthPageLayout'
import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { appRoutes } from '@constants/routes.constant'
import type { UserInvitation } from '@services/api'
import { RegisterUser } from '@services/api'
import getApiClient from '@services/apiInterface'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'

import { type InputValidationError, isValidEmail, isValidPassword, mustMatch } from '../utils/validators'

const Register = () => {
  const [searchParams, _setSearchParams] = useSearchParams()
  const { authenticate, storeToken } = useContext(AuthenticationContext)
  const { t: translate } = useTranslation()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const [usernameError, setUsernameError] = useState<InputValidationError | undefined>()
  const [emailError, setEmailError] = useState<InputValidationError | undefined>()
  const [passwordError, setPasswordError] = useState<InputValidationError | undefined>()
  const [passwordConfirmationError, setPasswordConfirmationError] = useState<
    InputValidationError | undefined
  >()

  const [registrationError, setRegistrationError] = useState<string | undefined>(undefined)
  const [codeInvalid, setCodeInvalid] = useState(false)
  const [codeExpired, setCodeExpired] = useState(false)

  const [userInvitation, setUserInvitation] = useState<UserInvitation>()

  const fetchUserInvitation = async (code: string) => {
    try {
      const userInvitationResponse = await getApiClient().userInvitationClient.detail(code)
      if (userInvitationResponse.expiresAt <= new Date()) {
        setCodeExpired(true)
        setCodeInvalid(false)
        setUserInvitation(undefined)

        return
      }

      setCodeExpired(false)
      setCodeInvalid(false)
      setUserInvitation(userInvitationResponse)
      setEmail(userInvitationResponse.email)
    } catch {
      setCodeInvalid(true)
      setCodeExpired(false)
      setUserInvitation(undefined)
    }
  }

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) return

    void fetchUserInvitation(code)
  }, [searchParams])

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

  const validatePassword = () => {
    if (!password) {
      setPasswordError('required')

      return false
    }

    if (!isValidPassword(password)) {
      setPasswordError('password')

      return false
    }

    setPasswordError(undefined)

    return true
  }

  const validatePasswordConfirmation = () => {
    if (!passwordConfirmation) {
      setPasswordConfirmationError('required')

      return false
    }

    if (!mustMatch(password, passwordConfirmation)) {
      setPasswordConfirmationError('mustMatch')

      return false
    }

    setPasswordConfirmationError(undefined)

    return true
  }

  const validateForm = () => {
    // Do not return directly the method calls;
    // we need each of them to be called before returning the result
    const usernameValid = validateUsername()
    const emailValid = validateEmail()
    const passwordValid = validatePassword()
    const passwordConfirmationValid = validatePasswordConfirmation()

    return usernameValid &&
      emailValid &&
      passwordValid &&
      passwordConfirmationValid
  }

  const onCreateAccountClick = async () => {
    const isFormValid = validateForm()
    if (!isFormValid) return

    try {
      const response = await getApiClient().authenticationClient.register(
        new RegisterUser({
          email: email.trim(),
          username: username.trim(),
          password,
          passwordConfirmation,
          code: userInvitation?.code,
        }),
      )

      authenticate(response.user)
      // By default, do not "remember" the user outside of the browser's session on Registration
      // They will get to chose that option the next time they log in
      const rememberMe = false
      storeToken(response.token, rememberMe)
    } catch {
      setRegistrationError(translate('auth.sign-up-error'))
    }
  }

  return (
    <AuthPageLayout>
      <>
        <div style={{ flexGrow: '0.5', display: 'flex', alignItems: 'center' }}>
          <h1 style={{ textAlign: 'center' }}>{translate('auth.sign-up-header-text')}</h1>
        </div>

        <div className='d-flex flex-column gap-4' style={{ width: '60%' }}>
          <div className='w-100'>
            <label htmlFor='username-input'>{translate('auth.username-label')}</label>
            <input
              aria-describedby='emailHelp'
              // eslint-disable-next-line sonarjs/no-duplicate-string -- Create an Input Component?
              className={`form-control ${usernameError && 'is-invalid'} `}
              id='username-input'
              onBlur={() => validateUsername()}
              onChange={event => setUsername(event.target.value)}
              type='text'
            />
            {usernameError && (
              <span className='help-block text-danger'>
                {translate('auth.username-error-required')}
              </span>
            )}
          </div>

          <div className='w-100'>
            <label htmlFor='email-input'>{translate('auth.email-label')}</label>
            <input
              aria-describedby='email'
              className={`form-control ${emailError && 'is-invalid'} `}
              disabled={!!userInvitation}
              id='email-input'
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

          <div className='w-100'>
            <label htmlFor='password-input'>{translate('auth.password-label')}</label>
            <input
              className={`form-control ${passwordError && 'is-invalid'} `}
              id='password-input'
              onBlur={() => validatePassword()}
              onChange={event => setPassword(event.target.value)}
              type='password'
            />
            {passwordError === 'required' && (
              <span className='help-block text-danger'>
                {translate('auth.password-error-required')}
              </span>
            )}
            {passwordError === 'password' && (
              <span className='help-block text-danger'>
                {translate('auth.password-error-format')}
              </span>
            )}
          </div>

          <div className='w-100'>
            <label htmlFor='confirmation-password-input'>
              {translate('auth.password-confirmation-label')}
            </label>
            <input
              className={`form-control ${passwordConfirmationError && 'is-invalid'}`}
              id='confirmation-password-input'
              onBlur={() => validatePasswordConfirmation()}
              onChange={event => setPasswordConfirmation(event.target.value)}
              type='password'
            />
            {passwordConfirmationError === 'required' && (
              <span className='help-block text-danger'>
                {translate('auth.password-confirmation-error-required')}
              </span>
            )}
            {passwordConfirmationError === 'mustMatch' && (
              <span className='help-block text-danger'>
                {translate('auth.password-error-must-match')}
              </span>
            )}
          </div>

          {registrationError && <span className='help-block text-danger'>{registrationError}</span>}
          {codeInvalid && (
            <span className='help-block text-danger'>{translate('auth.code-invalid')}</span>
          )}
          {codeExpired && (
            <span className='help-block text-danger'>{translate('auth.invitation-expired')}</span>
          )}

          <button
            className='btn btn-primary'
            onClick={onCreateAccountClick}
            style={{ margin: '40px 0px 10px' }}
            type='submit'
          >
            {translate('auth.create-account')}
          </button>

          <div className='mt-4 text-center'>
            <span>{translate('auth.already-have-an-account')}</span>
            <Link className='ms-2' to={appRoutes.login}>
              <span className='text-primary text-decoration-underline'>
                {translate('auth.log-in')}
              </span>
            </Link>
          </div>
        </div>
      </>
    </AuthPageLayout>
  )
}

export default Register
