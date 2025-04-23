/* eslint-disable react/jsx-props-no-spreading -- Good practice for React Hook Form */
import { useCallback, useContext, useEffect, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'

import AuthPageLayout from '@components/auth/AuthPageLayout'
import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { appRoutes } from '@constants/routes.constant'
import { formClasses } from '@constants/style'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import type { UserInvitation } from '@services/api'
import { ApiException, RegisterUser } from '@services/api'
import { storeToken } from '@utils/auth.utils'
import { emailRegex, passwordRegex } from '@utils/validators'

type RegisterFormInputs = {
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
}

const processRegisterError = (_responseText: string): string => {
  let errorMessage = 'auth.sign-up-error'
  // These come from Django AUTH_PASSWORD_VALIDATORS
  if (_responseText.includes('The password is too similar to the')) {
    errorMessage = 'auth.sign-up-password-too-similar'
  } else if (_responseText.includes('This password is too short')) {
    errorMessage = 'auth.sign-up-password-too-short'
  } else if (_responseText.includes('This password is too common')) {
    errorMessage = 'auth.sign-up-password-too-common'
  } else if (_responseText.includes('This password is entirely numeric')) {
    errorMessage = 'auth.sign-up-password-numeric'
  }

  return errorMessage
}

const Register = () => {
  const [searchParams, _setSearchParams] = useSearchParams()
  const { authenticate } = useContext(AuthenticationContext)
  const { t: translate } = useTranslation()
  const { getApiClient } = useApiClient()
  const { displayUnhandledAPIError } = useErrorHandling()

  const [registrationError, setRegistrationError] = useState<string | undefined>()
  const [codeInvalid, setCodeInvalid] = useState(false)
  const [codeExpired, setCodeExpired] = useState(false)

  const [userInvitation, setUserInvitation] = useState<UserInvitation>()

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setValue,
  } = useForm<RegisterFormInputs>({ mode: 'onTouched' })
  const onSubmit: SubmitHandler<RegisterFormInputs> = async formData => {
    try {
      const response = await getApiClient().authenticationClient.register(
        new RegisterUser({
          email: formData.email.trim(),
          username: formData.username.trim(),
          password: formData.password,
          passwordConfirmation: formData.confirmPassword,
          code: userInvitation?.code,
        }),
      )

      authenticate(response.user)
      // By default, do not "remember" the user outside of the browser's session on Registration
      // They will get to chose that option the next time they log in
      const rememberMe = false
      storeToken(response.token, rememberMe)
    } catch (error) {
      let errorMessage = 'auth.sign-up-error'
      if (error instanceof ApiException) {
        errorMessage = processRegisterError(error.response)
      }
      setRegistrationError(translate(errorMessage))
    }
  }

  const fetchUserInvitation = useCallback(async (code: string) => {
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
      setValue('email', userInvitationResponse.email)
    } catch {
      setCodeInvalid(true)
      setCodeExpired(false)
      setUserInvitation(undefined)
    }
  }, [getApiClient])

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) return

    fetchUserInvitation(code).catch(displayUnhandledAPIError('errors.fetch-user-invitation-failed'))
  }, [searchParams, fetchUserInvitation])

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) return

    fetchUserInvitation(code).catch(displayUnhandledAPIError('errors.fetch-user-invitation-failed'))
  }, [searchParams, fetchUserInvitation])

  return (
    <AuthPageLayout>
      <>
        <div style={{ flexGrow: '0.5', display: 'flex', alignItems: 'center' }}>
          <h1 style={{ textAlign: 'center' }}>{translate('auth.sign-up-header-text')}</h1>
        </div>

        <form
          className='col-10 col-sm-8 col-xl-6 d-flex flex-column gap-4'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='w-100'>
            <label aria-required htmlFor='username'>{translate('auth.username-label')}</label>
            <input
              aria-describedby='emailHelp'
              className={`form-control ${
                touchedFields.username && errors.username
                  ? formClasses.invalidFieldClass
                  : ''
              }`}
              {...register('username', {
                required: { value: true, message: translate('auth.username-error-required') },
              })}
            />
            {errors.username && (
              <span className='help-block text-danger'>
                {errors.username.message}
              </span>
            )}
          </div>
          <div className='w-100'>
            <label aria-required htmlFor='email'>{translate('auth.email-label')}</label>
            <input
              aria-describedby='email'
              className={`form-control ${
                touchedFields.email && errors.email
                  ? formClasses.invalidFieldClass
                  : ''
              }`}
              disabled={!!userInvitation}
              id='email'
              type='email'
              {...register('email', {
                required: { value: true, message: translate('auth.email-error-required') },
                pattern: { value: emailRegex, message: translate('auth.email-error-format') },
              })}
            />
            {errors.email && (
              <span className='help-block text-danger'>
                {errors.email.message}
              </span>
            )}
          </div>
          <div className='w-100'>
            <label aria-required htmlFor='password-input'>{translate('auth.password-label')}</label>
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
                pattern: { value: passwordRegex, message: translate('auth.password-error-format') },
              })}
            />
            {errors.password && (
              <span className='help-block text-danger'>
                {errors.password.message}
              </span>
            )}
          </div>
          <div className='w-100'>
            <label aria-required htmlFor='confirmation-password-input'>
              {translate('auth.password-confirmation-label')}
            </label>
            <input
              className={`form-control ${
                touchedFields.confirmPassword && errors.confirmPassword
                  ? formClasses.invalidFieldClass
                  : ''
              }`}
              id='confirmation-password-input'
              type='password'
              {...register('confirmPassword', {
                required: {
                  value: true,
                  message: translate('auth.password-confirmation-error-required'),
                },
                validate: {
                  mustMatch: (value, formValues) =>
                    value === formValues.password ||
                    translate('auth.password-error-must-match'),
                },
              })}
            />
            {errors.confirmPassword && (
              <span className='help-block text-danger'>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          <button
            className='btn btn-primary'
            style={{ margin: '40px 0px 10px' }}
            type='submit'
          >
            {translate('auth.create-account')}
          </button>

          {registrationError && <span className='help-block text-danger'>{registrationError}</span>}
          {codeInvalid && (
            <span className='help-block text-danger'>{translate('auth.code-invalid')}</span>
          )}
          {codeExpired && (
            <span className='help-block text-danger'>{translate('auth.invitation-expired')}</span>
          )}

          <div className='mt-4 text-center'>
            <span>{translate('auth.already-have-an-account')}</span>
            <Link className='ms-2' to={appRoutes.login}>
              <span className='text-primary text-decoration-underline'>
                {translate('auth.log-in')}
              </span>
            </Link>
          </div>
        </form>
      </>
    </AuthPageLayout>
  )
}

export default Register
