import { useTranslation } from 'react-i18next'
import { Link, matchPath, useLocation } from 'react-router-dom'

import { appRoutes } from '@constants/routes.constant'

type Props = {
  readonly siteId: number,
}

const SiteAdminTabs = ({ siteId }: Props) => {
  const { t: translate } = useTranslation()
  const location = useLocation()

  const isAnalyticsActive = matchPath(appRoutes.site(siteId), location.pathname)
  const isSocialActive = matchPath(appRoutes.siteSocial(siteId), location.pathname)

  return (
    <div className='site-tabs'>
      <ul className='nav nav-underline nav-dark justify-content-center gap-0'>
        <li className='nav-item'>
          <Link
            className={`nav-link ${
              isAnalyticsActive
                ? 'active'
                : ''
            }`}
            to={appRoutes.site(siteId)}
          >
            <span>{translate('analyticsSite.site-tabs.analytics')}</span>
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            className={`nav-link ${
              isSocialActive
                ? 'active'
                : ''
            }`}
            to={appRoutes.siteSocial(siteId)}
          >
            <span>{translate('analyticsSite.site-tabs.social')}</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default SiteAdminTabs
