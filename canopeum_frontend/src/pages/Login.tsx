/* eslint-disable react/jsx-props-no-spreading -- Needed for react hook forms */
import { useContext, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import AuthPageLayout from '@components/auth/AuthPageLayout'
import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { appRoutes } from '@constants/routes.constant'
import { formClasses } from '@constants/style'
import useApiClient from '@hooks/ApiClientHook'
import { ApiException, LoginUser } from '@services/api'
import { storeToken } from '@utils/auth.utils'

type LoginFormInputs = {
  email: string,
  password: string,
  rememberMe: boolean,
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<LoginFormInputs>({ mode: 'onTouched' })

  const onSubmit: SubmitHandler<LoginFormInputs> = async formData => {
    try {
      const response = await getApiClient().authenticationClient.login(
        new LoginUser({
          email: formData.email.trim(),
          password: formData.password,
        }),
      )

      storeToken(response.token, formData.rememberMe)
      authenticate(response.user)
    } catch (error) {
      let errorMessage = 'auth.log-in-error'
      if (error instanceof ApiException && (error.response.includes('Invalid credentials'))){
        errorMessage = 'auth.log-in-invalid-credentials'
      }

      setLoginError(translate(errorMessage))
    }
  }

  const { authenticate } = useContext(AuthenticationContext)
  const { t: translate } = useTranslation()
  const { getApiClient } = useApiClient()

  const [loginError, setLoginError] = useState<string | undefined>()

  return (
    <AuthPageLayout>
      <div style={{ flexGrow: '0.4', display: 'flex', alignItems: 'center' }}>
        <h1 style={{ textAlign: 'center' }}>{translate('auth.log-in-header-text')}</h1>
      </div>

      <form
        className='col-10 col-sm-8 col-xl-6 d-flex flex-column gap-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='w-100'>
          <label htmlFor='email-input'>{translate('auth.email-label')}</label>
          <input
            className={`form-control ${
              touchedFields.email && errors.email
                ? formClasses.invalidFieldClass
                : ''
            }`}
            id='email-input'
            type='email'
            {...register('email', {
              required: { value: true, message: translate('auth.email-error-required') },
            })}
          />
          {errors.email && <span className='help-block text-danger'>{errors.email.message}</span>}
        </div>

        <div className='w-100'>
          <label htmlFor='password-input'>{translate('auth.password-label')}</label>
          <input
            className={`form-control ${
              touchedFields.password && errors.password
                ? formClasses.invalidFieldClass
                : ''
            }`}
            id='password-input'
            type='password'
            {...register('password', {
              required: { value: true, message: translate('auth.password-error-required') },
            })}
          />
          {errors.password && (
            <span className='help-block text-danger'>{errors.password.message}</span>
          )}
        </div>

        <div>
          {/* TODO: Make a component, this is extracted from the Checkbox  */}
          {/* component until everything uses React Hook Forms */}
          <div className='form-check'>
            <input
              className='form-check-input'
              id='remember-me'
              type='checkbox'
              {...register('rememberMe')}
            />
            <label className='form-check-label' htmlFor='remember-me'>
              {translate('auth.remember-me')}
            </label>
          </div>
        </div>

        {loginError && <span className='help-block text-danger'>{loginError}</span>}

        <div className='mt-4'>
          <button className='btn btn-primary w-100 my-2' type='submit'>
            {translate('auth.log-in')}
          </button>

          <Link
            className='btn btn-outline-primary w-100 my-2 text-decoration-none'
            to={appRoutes.register}
            type='button'
          >
            {translate('auth.sign-up')}
          </Link>
        </div>
      </form>
    </AuthPageLayout>
  )
}

export default Login
