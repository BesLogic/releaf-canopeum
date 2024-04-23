import SiteSponsorProgress from '@components/analytics/SiteSponsorProgress'
import { LanguageContext } from '@components/context/LanguageContext'
import CustomIconBadge from '@components/CustomIconBadge'
import { appRoutes } from '@constants/routes.constant'
import type { SiteSummary } from '@services/api'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import CustomIcon from '../../components/icons/CustomIcon'
import classes from './AnalyticsSite.module.scss'

type Props = {
  readonly siteSummary: SiteSummary,
}

const AnalyticsSiteHeader = ({ siteSummary }: Props) => {
  const { t: translate } = useTranslation<'analytics'>()
  const { translateValue } = useContext(LanguageContext)

  return (
    <div className='bg-white rounded d-flex'>
      <div className='p-5'>
        <span>{translate('analyticsSite.location')}</span>
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

        <div className={`d-flex justify-content-between mt-4 ${classes.analyticsCountsContainer}`}>
          <div className='d-flex align-items-center gap-2 me-5'>
            <div className='bg-lightgreen rounded-circle d-flex justify-content-center align-items-center p-2'>
              <CustomIcon icon='sitePlantedIcon' size='5xl' />
            </div>
            <div className='d-flex flex-column'>
              <span className='text-primary fs-4 fw-bold'>{siteSummary.plantCount}</span>
              <span className='text-muted'>{translate('analytics.site-summary.planted')}</span>
            </div>
          </div>

          <div className='d-flex align-items-center gap-2 me-5'>
            <div className='bg-lightgreen rounded-circle d-flex justify-content-center align-items-center p-2'>
              <CustomIcon icon='siteSurvivedIcon' size='5xl' />
            </div>
            <div className='d-flex flex-column'>
              <span className='text-primary fs-4 fw-bold'>{siteSummary.survivedCount}</span>
              <span className='text-muted'>{translate('analytics.site-summary.survived')}</span>
            </div>
          </div>

          <div className='d-flex align-items-center gap-2 me-5'>
            <div className='bg-lightgreen rounded-circle d-flex justify-content-center align-items-center p-2'>
              <CustomIcon icon='sitePropagationIcon' size='5xl' />
            </div>
            <div className='d-flex flex-column'>
              <span className='text-primary fs-4 fw-bold'>{siteSummary.propagationCount}</span>
              <span className='text-muted'>{translate('analytics.site-summary.propagation')}</span>
            </div>
          </div>

          <div className='d-flex align-items-center gap-2 me-5'>
            <div className='bg-lightgreen rounded-circle d-flex justify-content-center align-items-center p-2'>
              <CustomIcon icon='siteVisitorsIcon' size='5xl' />
            </div>
            <div className='d-flex flex-column'>
              <span className='text-primary fs-4 fw-bold'>{siteSummary.visitorCount}</span>
              <span className='text-muted'>{translate('analytics.site-summary.visitors')}</span>
            </div>
          </div>
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
