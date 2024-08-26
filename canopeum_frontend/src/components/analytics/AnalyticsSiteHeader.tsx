import './AnalyticsSiteHeader.scss'

import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import SiteCountBadge from '@components/analytics/SiteCountBadge'
import SiteSponsorProgress from '@components/analytics/SiteSponsorProgress'
import { LanguageContext } from '@components/context/LanguageContext'
import CustomIconBadge from '@components/CustomIconBadge'
import { appRoutes } from '@constants/routes.constant'
import type { SiteDetailSummary } from '@services/api'
import { getImageNameByWMOCategories } from '@constants/weatherImageMap'

type Props = {
  readonly siteSummary: SiteDetailSummary,
}

const AnalyticsSiteHeader = ({ siteSummary }: Props) => {
  const { t: translate } = useTranslation<'analytics'>()
  const { translateValue } = useContext(LanguageContext)

  return (
    <div className='bg-cream rounded d-flex m-0 header-card'>
      <div
        className='
          weather-container
          d-flex
          flex-column
          justify-content-center
          align-items-center
          gap-3
          text-light
        '
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(0, 0, 0, 0.6),
              rgba(0, 0, 0, 0.6)
            ), url(${getImageNameByWMOCategories(siteSummary.weather.description)})
          `,
        }}
      >
        <h2 className='text-light fs-6 text-center'>{siteSummary.coordinate.address}</h2>

        <span style={{ fontSize: '300%' }}>{`${siteSummary.weather.temperature}°C`}</span>

        <div className='d-flex flex-column text-center'>
          <span>{siteSummary.weather.description}</span>
          <span>{`Humidity ${siteSummary.weather.humidity}%`}</span>
        </div>
      </div>

      <div className='site-info-container pb-4 pt-5 px-5 flex-grow-1'>
        <div className='d-flex justify-content-between align-items-start'>
          <div>
            <h2>{siteSummary.name}</h2>
            <div className='d-flex align-items-center'>
              <CustomIconBadge icon='siteTypeCanopeumIcon' />
              <span className='ms-2'>{translateValue(siteSummary.siteType)}</span>
            </div>
          </div>

          <Link className='nav-link' to={appRoutes.siteSocial(siteSummary.id)}>
            <button className='btn btn-primary' type='button'>
              {translate('analyticsSite.social-page')}
            </button>
          </Link>
        </div>

        <div
          className='row justify-content-between mt-4 row-gap-3'
          style={{ maxWidth: '880px' }}
        >
          <SiteCountBadge
            count={siteSummary.plantCount}
            icon='sitePlantedIcon'
            label={translate('analytics.site-summary.planted')}
          />
          <SiteCountBadge
            count={siteSummary.survivedCount}
            icon='siteSurvivedIcon'
            label={translate('analytics.site-summary.survived')}
          />
          <SiteCountBadge
            count={siteSummary.propagationCount}
            icon='sitePropagationIcon'
            label={translate('analytics.site-summary.propagation')}
          />
          <SiteCountBadge
            count={siteSummary.visitorCount ?? 0}
            icon='siteVisitorsIcon'
            label={translate('analytics.site-summary.visitors')}
          />
        </div>

        <div className='mt-4'>
          <div
            className='d-flex align-items-flex-end fw-bold overflow-x-auto'
            style={{ maxWidth: '800px' }}
          >
            <span className='material-symbols-outlined'>group</span>
            <span className='ms-1 me-2'>{translate('analyticsSite.sponsors')}:</span>
            {siteSummary.sponsors.map(sponsor => (
              <span className='me-4' key={sponsor}>{sponsor}</span>
            ))}
          </div>
        </div>

        <div className='mt-1'>
          <SiteSponsorProgress progress={siteSummary.progress} />
        </div>
      </div>
    </div>
  )
}

export default AnalyticsSiteHeader
