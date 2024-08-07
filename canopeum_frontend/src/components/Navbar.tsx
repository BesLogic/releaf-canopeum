import type { MaterialIcon } from 'material-icons'
import { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { AuthenticationContext } from './context/AuthenticationContext'
import { appRoutes } from '@constants/routes.constant'
import type { RoleEnum } from '@services/api'

type NavbarItem = {
  icon: MaterialIcon,
  linkTo: string,
  label: string,
  roles: (RoleEnum | undefined)[],
}

const NAVBAR_ITEMS: NavbarItem[] = [
  {
    icon: 'home',
    linkTo: appRoutes.home,
    label: 'home',
    roles: ['User', 'SiteManager', 'MegaAdmin'],
  },
  {
    icon: 'donut_small',
    linkTo: appRoutes.sites,
    label: 'sites',
    roles: ['SiteManager', 'MegaAdmin'],
  },
  {
    icon: 'pin_drop',
    linkTo: appRoutes.map,
    label: 'map',
    roles: ['User', 'SiteManager', 'MegaAdmin'],
  },
  // For development purposes
  // {
  //   icon: 'style',
  //   linkTo: appRoutes.utilities,
  //   label: 'utilities',
  //   roles: ['SiteManager', 'MegaAdmin'],
  // },
]

const Navbar = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method -- Unmarked 3rd party method
  const { i18n: { changeLanguage, language }, t: translate } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(language)
  const { currentUser } = useContext(AuthenticationContext)

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
          <ul className='navbar-nav gap-3'>
            {isAuthenticated && (NAVBAR_ITEMS.map(item => (
              <li
                className={`nav-item ${
                  location.pathname === item.linkTo
                    ? 'active'
                    : ''
                } ${
                  item.roles.includes(currentUser?.role)
                    ? 'd-inline'
                    : 'd-none'
                }`}
                key={item.icon}
              >
                <Link className='nav-link' to={item.linkTo}>
                  <span className='material-symbols-outlined text-light'>{item.icon}</span>
                  <span className='nav-link-label text-light'>
                    {translate(`navbar.${item.label}`)}
                  </span>
                </Link>
              </li>
            )))}
          </ul>

          <ul className='navbar-nav gap-3'>
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
                  <span className='nav-link-label text-light'>{translate('navbar.settings')}</span>
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
                    {translate('navbar.log-in')}
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
