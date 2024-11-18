import './AnalyticsSiteHeader.scss'

import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import SiteCountBadge from '@components/analytics/SiteCountBadge'
import SiteSponsorProgress from '@components/analytics/SiteSponsorProgress'
import BatchSponsorLogo from '@components/batches/BatchSponsorLogo'
import { LanguageContext } from '@components/context/LanguageContext'
import CustomIconBadge from '@components/CustomIconBadge'
import { getImageNameByWMOCategories } from '@constants/weatherImageMap'
import type { SiteSummaryDetail } from '@services/api'

type Props = {
  readonly siteSummary: SiteSummaryDetail,
}

const AnalyticsSiteHeader = ({ siteSummary }: Props) => {
  const { t: translate } = useTranslation<'analytics'>()
  const { translateValue } = useContext(LanguageContext)

  return (
    <div className='card m-0 header-card'>
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
            ), url(${getImageNameByWMOCategories(siteSummary.weather.description) ?? ''})
          `,
        }}
      >
        <h2 className='fs-6 text-center'>{siteSummary.coordinate.address}</h2>

        <span style={{ fontSize: '300%' }}>{`${siteSummary.weather.temperature}°C`}</span>

        <div className='d-flex flex-column text-center'>
          <span>{siteSummary.weather.description}</span>
          <span>{`Humidity ${siteSummary.weather.humidity}%`}</span>
        </div>
      </div>

      <div className='site-info-container pb-4 pt-5 px-5 flex-grow-1'>
        <div>
          <h2>{siteSummary.name}</h2>
          <div className='d-flex align-items-center'>
            <CustomIconBadge icon='siteTypeCanopeumIcon' />
            <span className='ms-2'>{translateValue(siteSummary.siteType)}</span>
          </div>
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

        <div
          className='d-flex align-items-center fw-bold overflow-x-auto pb-2 mt-4'
          style={{ maxWidth: '800px' }}
        >
          <span className='material-symbols-outlined'>group</span>
          <span className='ms-1 me-2'>{translate('analyticsSite.sponsors')}:</span>
          <div className='d-flex gap-4'>
            {siteSummary.sponsors.map(sponsor => (
              <BatchSponsorLogo key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
        </div>

        <div className='mt-1'>
          <SiteSponsorProgress progress={siteSummary.sponsorProgress} />
        </div>
      </div>
    </div>
  )
}

export default AnalyticsSiteHeader
