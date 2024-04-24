import { appRoutes } from '@constants/routes.constant'
import type { MaterialIcon } from 'material-icons'
import { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { AuthenticationContext } from './context/AuthenticationContext'

type NavbarItem = {
  icon: MaterialIcon,
  linkTo: string,
}

const NAVBAR_ITEMS: NavbarItem[] = [
  {
    icon: 'home',
    linkTo: appRoutes.home,
  },
  {
    icon: 'donut_small',
    linkTo: appRoutes.sites,
  },
  {
    icon: 'pin_drop',
    linkTo: appRoutes.map,
  },
  {
    icon: 'style',
    linkTo: appRoutes.utilities,
  },
]

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
      navigate(appRoutes.login)
    }
  }, [isAuthenticated, navigate, logout])

  return (
    <nav className='navbar sticky-top navbar-expand-lg navbar-dark bg-primary'>
      <div className='container-fluid'>
        <Link className='navbar-brand' to={appRoutes.home}>
          <img
            alt='Logo'
            className='navbar-logo'
            src='/Releaf_Logo.svg'
            style={{ transition: 'all .5s' }}
          />
        </Link>

        <button
          aria-controls='main-navbar'
          aria-expanded='false'
          aria-label='Toggle navigation'
          className='navbar-toggler'
          data-bs-target='#main-navbar'
          data-bs-toggle='collapse'
          type='button'
        >
          <span className='navbar-toggler-icon' />
        </button>

        <div
          className='collapse navbar-collapse justify-content-between w-100 gap-3'
          id='main-navbar'
        >
          <ul className='navbar-nav gap-3 align-items-center'>
            {isAuthenticated && (NAVBAR_ITEMS.map(item => (
              <li
                className={`nav-item ${
                  location.pathname === item.linkTo
                    ? 'active'
                    : ''
                }`}
                key={item.icon}
              >
                <Link className='nav-link' to={item.linkTo}>
                  <span className='material-symbols-outlined text-light'>{item.icon}</span>
                </Link>
              </li>
            )))}
          </ul>

          <ul className='navbar-nav gap-3 align-items-center'>
            {isAuthenticated && (
              <li
                className={`nav-item ${
                  location.pathname === appRoutes.userManagment
                    ? 'active'
                    : ''
                }`}
              >
                <Link className='nav-link' to={appRoutes.userManagment}>
                  <span className='material-symbols-outlined text-light'>account_circle</span>
                </Link>
              </li>
            )}

            {!isAuthenticated && (
              <li className='nav-item'>
                <Link to={appRoutes.login}>
                  <button
                    className='btn btn-primary'
                    onClick={() => onLoginLogoutbuttonClick()}
                    style={{ width: 100 }}
                    type='button'
                  >
                    Log In
                  </button>
                </Link>
              </li>
            )}

            <li className='nav-item'>
              <button
                className='btn btn-primary'
                id='change-language-button'
                onClick={handleChangeLanguage}
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
