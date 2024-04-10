import AuthPageLayout from '@components/auth/AuthPageLayout';
import { AuthenticationContext } from '@components/context/AuthenticationContext';
import { LoginUser } from '@services/api'
import getApiClient from '@services/apiInterface'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom'

import useLogin from '../hooks/LoginHook';

const isLoginEntryValid = (entry: string | undefined) => entry !== undefined && entry !== ''

const Login = () => {
  const navigate = useNavigate()
  const { authenticateUser } = useLogin()
  const { t: translate } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const [loginError, setLoginError] = useState<string | undefined>(undefined)

  const { isAuthenticated } = useContext(AuthenticationContext)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const onLoginClick = async () => {
    if (!email) {
      setEmailError(true)
    }

    if (!password) {
      setPasswordError(true)
    }

    if (isLoginEntryValid(email) && isLoginEntryValid(password)) {
      try {
        const response = await getApiClient().authenticationClient.login(
          new LoginUser({
            email,
            password,
          }),
        )
        sessionStorage.setItem('token', response.access)
        sessionStorage.setItem('refreshToken', response.refresh)

        authenticateUser(response.access)
      } catch {
        setLoginError(translate('auth.log-in-error'))
      }
    }
  }

  return (
    <AuthPageLayout>
      <div style={{ flexGrow: '0.4', display: 'flex', alignItems: 'center' }}>
        <h1 style={{ textAlign: 'center' }}>{translate('auth.log-in-header-text')}</h1>
      </div>

      <div className='d-flex flex-column gap-4' style={{ width: '60%' }}>
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
        {loginError && <span className='help-block text-danger'>{loginError}</span>}

        <div className='w-100'>
          <button
            className='btn btn-primary w-100'
            onClick={onLoginClick}
            style={{ margin: '40px 0px 10px' }}
            type='submit'
          >
            {translate('auth.log-in')}
          </button>

          <Link className='w-100' to='/register'>
            <button
              className='btn btn-outline-primary w-100'
              style={{ margin: '10px 0px 10px' }}
              type='button'
            >{translate('auth.sign-up')}</button>
          </Link>
        </div>
      </div>
    </AuthPageLayout>
  )
}

export default Login
