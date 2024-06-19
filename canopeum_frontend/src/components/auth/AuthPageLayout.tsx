import { appRoutes } from '@constants/routes.constant'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type Props = {
  readonly children: ReactNode,
}

const AuthPageLayout = ({ children }: Props) => {
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
        bg-cream
        px-3
        py-4
        overflow-y-auto
      '>
        {children}
        <div className='mt-4'>
          <Link className='d-flex align-items-center' to={appRoutes.map}>
            <span className='material-symbols-outlined text-primary'>arrow_back</span>
            <span className='text-primary'>
              {translate('auth.back-to-map')}
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AuthPageLayout
