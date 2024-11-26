import './AnalyticsSiteHeader.scss'

import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import SiteCountBadge from '@components/analytics/SiteCountBadge'
import SiteSponsorProgress from '@components/analytics/SiteSponsorProgress'
import { LanguageContext } from '@components/context/LanguageContext'
import CustomIconBadge from '@components/CustomIconBadge'
import IconBadge from '@components/IconBadge'
import SiteHeaderSponsors from '@components/SiteHeaderSponsors'
import { getImageNameByWMOCategories } from '@constants/weatherImageMap'
import { getSiteTypeIconKey } from '@models/SiteType'
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

      <div className='card-body d-flex flex-column gap-4'>
        <div>
          <h1 className='card-title mb-0'>{siteSummary.name}</h1>
          <div className='d-flex align-items-center gap-2'>
            <IconBadge iconKey={getSiteTypeIconKey(siteSummary.siteType.id)} />
            {/* <CustomIconBadge icon='siteTypeCanopeumIcon' /> */}
            <h4 className='fw-bold text-primary mb-0'>{translateValue(siteSummary.siteType)}</h4>
          </div>
        </div>

        <div className='row row-gap-3'>
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

        <SiteSponsorProgress progress={siteSummary.sponsorProgress} />

        <SiteHeaderSponsors sponsors={siteSummary.sponsors} />
      </div>
    </div>
  )
}

export default AnalyticsSiteHeader
