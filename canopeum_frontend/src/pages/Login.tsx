import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import AuthPageLayout from '@components/auth/AuthPageLayout'
import Checkbox from '@components/Checkbox'
import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { appRoutes } from '@constants/routes.constant'
import useApiClient from '@hooks/ApiClientHook'
import { LoginUser } from '@services/api'
import { storeToken } from '@utils/auth.utils'
import type { InputValidationError } from '@utils/validators'

const Login = () => {
  const { authenticate } = useContext(AuthenticationContext)
  const { t: translate } = useTranslation()
  const { getApiClient } = useApiClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const [emailError, setEmailError] = useState<InputValidationError | undefined>()
  const [passwordError, setPasswordError] = useState<InputValidationError | undefined>()

  const [loginError, setLoginError] = useState<string | undefined>()

  const validateEmail = () => {
    if (!email) {
      setEmailError('required')

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

    setPasswordError(undefined)

    return true
  }

  const validateForm = () => {
    // Do not return directly the method calls;
    // we need each of them to be called before returning the result
    const emailValid = validateEmail()
    const passwordValid = validatePassword()

    return emailValid
      && passwordValid
  }

  const onLoginClick = async () => {
    const isFormValid = validateForm()
    if (!isFormValid) return

    try {
      const response = await getApiClient().authenticationClient.login(
        new LoginUser({
          email: email.trim(),
          password,
        }),
      )

      storeToken(response.token, rememberMe)
      authenticate(response.user)
    } catch {
      setLoginError(translate('auth.log-in-error'))
    }
  }

  return (
    <AuthPageLayout>
      <div style={{ flexGrow: '0.4', display: 'flex', alignItems: 'center' }}>
        <h1 style={{ textAlign: 'center' }}>{translate('auth.log-in-header-text')}</h1>
      </div>

      <div className='col-10 col-sm-6 col-md-8 col-xl-6 d-flex flex-column gap-4'>
        <div className='w-100'>
          <label htmlFor='email-input'>{translate('auth.email-label')}</label>
          <input
            aria-describedby='email'
            className={`form-control ${emailError && 'is-invalid'}`}
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
        </div>

        <div className='w-100'>
          <label htmlFor='password-input'>{translate('auth.password-label')}</label>
          <input
            className={`form-control ${passwordError && 'is-invalid'}`}
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
        </div>

        <div>
          <Checkbox
            checked={rememberMe}
            id='remember-me'
            onChange={(_value, isChecked) => setRememberMe(isChecked)}
            value='remember-me'
          >
            Remember Me
          </Checkbox>
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

          <Link className='w-100' to={appRoutes.register}>
            <button
              className='btn btn-outline-primary w-100'
              style={{ margin: '10px 0px 10px' }}
              type='button'
            >
              {translate('auth.sign-up')}
            </button>
          </Link>
        </div>
      </div>
    </AuthPageLayout>
  )
}

export default Login
