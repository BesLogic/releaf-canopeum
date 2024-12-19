import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { AuthenticationContext } from './context/AuthenticationContext'
import { SnackbarContext } from '@components/context/SnackbarContext'
import { appRoutes } from '@constants/routes.constant'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import type { RoleEnum } from '@services/api'

type NavbarItem = {
  icon: string,
  linkTo: string,
  label: string,
  roles: RoleEnum[],
}

const NAVBAR_ITEMS: NavbarItem[] = [
  {
    icon: 'home',
    linkTo: appRoutes.home,
    label: 'home',
    roles: ['User', 'ForestSteward', 'MegaAdmin'],
  },
  {
    icon: 'donut_small',
    linkTo: appRoutes.sites,
    label: 'sites',
    roles: ['ForestSteward', 'MegaAdmin'],
  },
  {
    icon: 'pin_drop',
    linkTo: appRoutes.map,
    label: 'map',
    roles: ['User', 'ForestSteward', 'MegaAdmin'],
  },
  // For development purposes
  // {
  //   icon: 'style',
  //   linkTo: appRoutes.utilities,
  //   label: 'utilities',
  //   roles: ['ForestSteward', 'MegaAdmin'],
  // },
]

const Navbar = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method -- Unmarked 3rd party method
  const { i18n: { changeLanguage, language }, t: translate } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(language)
  const { currentUser } = useContext(AuthenticationContext)
  const { getErrorMessage } = useErrorHandling()
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const location = useLocation()

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === 'en'
      ? 'fr'
      : 'en'
    setCurrentLanguage(newLanguage)
    changeLanguage(newLanguage).catch((error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        translate('errors.change-language-failed')
      )
      openAlertSnackbar(errorMessage,  { severity: 'error' })
    })
  }

  const { isAuthenticated, showLogoutModal } = useContext(AuthenticationContext)

  return (
    <nav className='navbar sticky-top navbar-expand-lg navbar-dark bg-primary'>
      <div className='container'>
        <Link className='navbar-brand' to={appRoutes.home}>
          <img
            alt='Releaf Logo'
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
          className='collapse navbar-collapse justify-content-between w-100'
          id='main-navbar'
        >
          <div className='navbar-nav nav-underline'>
            {isAuthenticated && currentUser && (NAVBAR_ITEMS.filter(item =>
              item.roles.includes(currentUser.role)
            ).map(item => (
              <Link
                className={`nav-item nav-link ${
                  // startsWith because we still want to show the active tab for sub-pages
                  location.pathname.startsWith(item.linkTo)
                    ? 'active'
                    : ''}`}
                key={item.icon}
                to={item.linkTo}
              >
                <span className='material-symbols-outlined icon-lg'>{item.icon}</span>
                <span className='nav-link-label'>
                  {translate(`navbar.${item.label}`)}
                </span>
              </Link>
            )))}
          </div>

          <div className='navbar-nav nav-underline'>
            {isAuthenticated && (
              <Link
                className={`nav-item nav-link ${
                  (Object.values(appRoutes.userManagment) as string[]).includes(location.pathname)
                    ? 'active'
                    : ''
                }`}
                to={appRoutes.userManagment.myProfile}
              >
                <span className='material-symbols-outlined icon-lg'>account_circle</span>
                <span className='nav-link-label'>{translate('navbar.settings')}</span>
              </Link>
            )}

            {isAuthenticated
              ? (
                <button
                  className='nav-item btn btn-primary'
                  onClick={showLogoutModal}
                  type='button'
                >
                  {translate('auth.log-out')}
                </button>
              )
              : (
                <Link
                  className='nav-item btn btn-primary text-decoration-none'
                  to={appRoutes.login}
                >
                  {translate('auth.log-in')}
                </Link>
              )}

            <button
              className='nav-item btn btn-primary'
              onClick={handleChangeLanguage}
              type='button'
            >
              {language}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
export default Navbar
