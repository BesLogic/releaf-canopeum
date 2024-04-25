import './AnalyticsSiteHeader.scss'

import SiteCountBadge from '@components/analytics/SiteCountBadge'
import SiteSponsorProgress from '@components/analytics/SiteSponsorProgress'
import { LanguageContext } from '@components/context/LanguageContext'
import CustomIconBadge from '@components/CustomIconBadge'
import { appRoutes } from '@constants/routes.constant'
import type { SiteSummary } from '@services/api'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type Props = {
  readonly siteSummary: SiteSummary,
}

const DUMMY_WEATHER_IMAGE_URL =
  'https://s3-alpha-sig.figma.com/img/3323/1a79/39fa0b7c7c6287bee10bf03f964802b4?Expires=1714953600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=prNydsvieeG2h4vbOPKOFCA44pA3jp2CCg3NYadugITUgTv0xUoS9M58d4gnX9aUN73bP2cJqAWzeAOYhrMieCcEgx93tmgyHBi3uyTStGR0R~oIz34-KouN7RkchWMpwy6lIMPbaInHSwtwbrnqkkjCl6O0bvQLPZQeOE~E-nqk59fe7eiH47rZHpmOGNZqz8C9x14-4vx8tH5GVWokIqHz1MxOhLoR-o-fGuUDfLR0ZTSJD0uYVtnQoctCboejXlCSVDcEd959ZfwuAIRvyO8xs1RJugq45Su3GtfC7FKHY0pNMzCN~wRoHj1q9Ac~QNe8OSL-HEglV3f2ac-Bcg__'

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
            ), url(${DUMMY_WEATHER_IMAGE_URL})
          `,
        }}
      >
        <h2 className='text-light'>{translate('analyticsSite.location')}</h2>

        <span style={{ fontSize: '300%' }}>33°C</span>

        <div className='d-flex flex-column text-center'>
          <span>Light Rain</span>
          <span>Humidity 87%</span>
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
          <div className='d-flex align-items-flex-end fw-bold'>
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
