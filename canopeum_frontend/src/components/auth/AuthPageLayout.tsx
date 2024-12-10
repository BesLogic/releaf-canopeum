import './AuthPageLayout.scss'

import type { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { appRoutes } from '@constants/routes.constant'

const AuthPageLayout = ({ children }: PropsWithChildren) => {
  const { t: translate } = useTranslation()

  return (
    <div className='d-flex bg-primary vh-100'>
      <div className='d-none d-md-block col-md-6 login-background' />

      <div className='
        col-12
        col-md-6
        d-flex
        flex-column
        align-items-center
        bg-white
        px-3
        py-4
        overflow-y-auto
      '>
        {children}
        <Link
          className='mt-4 link-inner-underline text-primary '
          to={appRoutes.map}
        >
          <span className='material-symbols-outlined text-decoration-none align-top'>
            arrow_back
          </span>
          <span className='ms-1'>{translate('auth.back-to-map')}</span>
        </Link>
      </div>
    </div>
  )
}

export default AuthPageLayout
