import { AuthenticationContext, UserRole } from '@components/context/AuthenticationContext'
import { AuthUser } from '@services/api'
import api from '@services/apiInterface'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const isLoginEntryValide = (entry: string | undefined) => entry !== undefined && entry !== ''

const Login = () => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const [userNameInError, setUserNameInError] = useState(false)
  const [passwordInError, setPasswordInError] = useState(false)

  const [loginError, setLoginError] = useState<string | undefined>(undefined)

  const { authenticate, isAuthenticated } = useContext(AuthenticationContext)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const onLoginClick = async () => {
    if (!userName) {
      setUserNameInError(true)
    }

    if (!password) {
      setPasswordInError(true)
    }

    if (isLoginEntryValide(userName) && isLoginEntryValide(password)) {
      try {
        const response = await api().auth.login(
          new AuthUser({
            username: userName,
            password,
            id: 1,
          }),
        )
        authenticate({
          email: response.email ?? '',
          firstname: response.firstName ?? '',
          image: '',
          lastname: response.lastName ?? '',
          role: UserRole.MegaAdmin, // TODO (Vincent) set the user role
        })
      } catch {
        setLoginError('Error while login')
      }
    }
  }

  return (
    <div className='d-flex' style={{ height: '100vh' }}>
      <div style={{ width: '55%' }} />
      <div className='d-flex flex-column bg-white px-3 py-2' style={{ width: '45%', alignItems: 'center' }}>
        <div style={{ flexGrow: '0.3', display: 'flex', alignItems: 'center' }}>
          <h1 style={{ textAlign: 'center' }}>Log In to Your Account</h1>
        </div>

        <div className='d-flex flex-column' style={{ width: '60%' }}>
          <div style={{ width: '100%', margin: '20px 0px 20px 0px' }}>
            <label htmlFor='exampleInputEmail1'>Email address</label>
            <input
              aria-describedby='emailHelp'
              className={`form-control ${userNameInError && !isLoginEntryValide(userName) && 'is-invalid'} `}
              id='exampleInputEmail1'
              onChange={event => setUserName(event.target.value)}
              type='email'
            />
            {userNameInError && !isLoginEntryValide(userName) && (
              <span className='help-block text-danger'>
                Please enter a email address
              </span>
            )}
          </div>

          <div style={{ width: '100%', margin: '20px 0px 20px 0px' }}>
            <label htmlFor='exampleInputPassword1'>Password</label>
            <input
              className={`form-control ${passwordInError && !isLoginEntryValide(password) && 'is-invalid'} `}
              id='exampleInputPassword1'
              onChange={event => setPassword(event.target.value)}
              type='password'
            />
            {passwordInError && !isLoginEntryValide(password) && (
              <span className='help-block text-danger'>Please enter a password</span>
            )}
          </div>
          {loginError && <span className='help-block text-danger'>{loginError}</span>}
          <button
            className='btn btn-primary'
            onClick={onLoginClick}
            style={{ margin: '40px 0px 10px' }}
            type='submit'
          >
            Log In
          </button>
          <button className='btn btn-outline-primary' style={{ margin: '10px 0px 10px' }} type='button'>Sign in</button>
        </div>
      </div>
    </div>
  )
}

export default Login
