import AuthPageLayout from '@components/auth/AuthPageLayout';
import { AuthenticationContext } from '@components/context/AuthenticationContext';
import { RegisterUser } from '@services/api'
import getApiClient from '@services/apiInterface'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom'

import useLogin from '../hooks/LoginHook';

const isLoginEntryValid = (entry: string | undefined) => entry !== undefined && entry !== ''

const Register = () => {
  const navigate = useNavigate()
  const { authenticateUser } = useLogin()
  const { t: translate } = useTranslation()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const [usernameError, setUsernameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [passwordConfirmationError, setPasswordConfirmationError] = useState(false)

  const [registrationError, setRegistrationError] = useState<string | undefined>(undefined)

  const { isAuthenticated } = useContext(AuthenticationContext)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const onCreateAccountClick = async () => {
    if (!username) {
      setUsernameError(true)
    }

    if (!email) {
      setEmailError(true)
    }

    if (!password) {
      setPasswordError(true)
    }

    if (!passwordConfirmation) {
      setPasswordConfirmationError(true)
    }

    if (isLoginEntryValid(username) && isLoginEntryValid(password)) {
      try {
        const response = await getApiClient().authenticationClient.register(
          new RegisterUser({
            email,
            username,
            password,
            passwordConfirmation,
          }),
        )
        sessionStorage.setItem('token', response.access)
        sessionStorage.setItem('refreshToken', response.refresh)

        authenticateUser(response.access)
      } catch {
        setRegistrationError(translate('auth.sign-up-error'))
      }
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
              className={`form-control ${usernameError && !isLoginEntryValid(username) && 'is-invalid'} `}
              id='username-input'
              onChange={event => setUsername(event.target.value)}
              type="text"
            />
            {usernameError && !isLoginEntryValid(username) && (
              <span className='help-block text-danger'>
                {translate('auth.username-error-required')}
              </span>
            )}
          </div>

          <div className='w-100'>
            <label htmlFor='email-input'>{translate('auth.email-label')}</label>
            <input
              aria-describedby='email'
              className={`form-control ${emailError && !isLoginEntryValid(email) && 'is-invalid'} `}
              id='email-input'
              onChange={event => setEmail(event.target.value)}
              type='email'
            />
            {emailError && !isLoginEntryValid(email) && (
              <span className='help-block text-danger'>
                {translate('auth.email-error-required')}
              </span>
            )}
          </div>

          <div className='w-100'>
            <label htmlFor='password-input'>{translate('auth.password-label')}</label>
            <input
              className={`form-control ${passwordError && !isLoginEntryValid(password) && 'is-invalid'} `}
              id='password-input'
              onChange={event => setPassword(event.target.value)}
              type='password'
            />
            {passwordError && !isLoginEntryValid(password) && (
              <span className='help-block text-danger'>
                {translate('auth.password-error-required')}
              </span>
            )}
          </div>

          <div className='w-100'>
            <label htmlFor='confirmation-password-input'>{translate('auth.password-confirmation-label')}</label>
            <input
              className={`form-control ${passwordConfirmationError &&
                !isLoginEntryValid(passwordConfirmation) &&
                'is-invalid'
                }`}
              id='confirmation-password-input'
              onChange={event => setPasswordConfirmation(event.target.value)}
              type='password'
            />
            {passwordConfirmationError && !isLoginEntryValid(passwordConfirmation) && (
              <span className='help-block text-danger'>
                {translate('auth.password-error-must-match')}
              </span>
            )}
          </div>

          {registrationError && <span className='help-block text-danger'>{registrationError}</span>}

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
            <Link className='ms-2' to='/login'>
              <span className='text-primary text-decoration-underline'>{translate('auth.log-in')}</span>
            </Link>
          </div>
        </div>
      </>
    </AuthPageLayout>
  )
}

export default Register
