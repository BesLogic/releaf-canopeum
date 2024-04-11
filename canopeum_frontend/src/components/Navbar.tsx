import { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { AuthenticationContext } from './context/AuthenticationContext'

const Navbar = () => {
  const { i18n: { changeLanguage, language } } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(language)

  const location = useLocation()

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === 'en'
      ? 'fr'
      : 'en'
    setCurrentLanguage(newLanguage)
    void changeLanguage(newLanguage)
  }

  const { isAuthenticated, logout } = useContext(AuthenticationContext)
  const navigate = useNavigate()

  const onLoginLogoutbuttonClick = useCallback(() => {
    if (isAuthenticated) {
      logout()
    } else {
      navigate('/login')
    }
  }, [isAuthenticated, navigate, logout])

  return (
    <nav className='navbar navbar-expand-lg bg-primary'>
      <div className='container'>
        <Link to='/home'>
          <img alt='Logo' className='navbar-logo' src='/Releaf_Logo.svg' style={{ transition: 'all .5s' }} />
        </Link>
        <button
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
          className='navbar-toggler'
          data-target='#navbarNav'
          data-toggle='collapse'
          type='button'
        >
          <span className='navbar-toggler-icon' />
        </button>
        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav d-flex w-100 ms-3 gap-3 fs-4'>
            {isAuthenticated && (
              <>
                <li
                  className={`nav-item ${
                    location.pathname === '/home'
                      ? 'active'
                      : ''
                  }`}
                >
                  <Link className='nav-link' to='/home'>
                    <span className='material-symbols-outlined text-light'>home</span>
                  </Link>
                </li>
                <li
                  className={`nav-item ${
                    location.pathname === '/analytics'
                      ? 'active'
                      : ''
                  }`}
                >
                  <Link className='nav-link' to='/analytics'>
                    <span className='material-symbols-outlined text-light'>donut_small</span>
                  </Link>
                </li>
                <li
                  className={`nav-item ${
                    location.pathname === '/map'
                      ? 'active'
                      : ''
                  }`}
                >
                  <Link className='nav-link' to='/map'>
                    <span className='material-symbols-outlined text-light'>pin_drop</span>
                  </Link>
                </li>
                <li
                  className={`nav-item ${
                    location.pathname === '/utilities'
                      ? 'active'
                      : ''
                  }`}
                >
                  <Link className='nav-link' to='/utilities'>
                    <span className='material-symbols-outlined text-light'>style</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
          <ul className='navbar-nav ms-3 gap-3'>
            {isAuthenticated && (
              <li
                className={`nav-item ${
                  location.pathname === '/user-management'
                    ? 'active'
                    : ''
                }`}
              >
                <Link className='nav-link' to='/user-management'>
                  <span className='material-symbols-outlined text-light'>account_circle</span>
                </Link>
              </li>
            )}

            {!isAuthenticated && (
              <li>
                <button
                  className='btn btn-primary'
                  onClick={() => onLoginLogoutbuttonClick()}
                  style={{ width: 100 }}
                  type='button'
                >
                  Log In
                </button>
              </li>
            )}

            <li>
              <button
                className='btn btn-primary'
                onClick={handleChangeLanguage}
                style={{ minWidth: '44px' }}
                type='button'
              >
                {language}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
export default Navbar
