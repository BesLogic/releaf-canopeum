import type { SiteSummary } from '@services/api'
import api from '@services/apiInterface'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Icon } from '../components/icons/Icon'
import classes from './AnalyticsSite.module.scss'

const AnalyticsSite = () => {
  const { t: translate } = useTranslation<'analytics'>()
  const { siteId: siteIdFromParams } = useParams()

  const [site, setSite] = useState<SiteSummary | undefined>()

  const fetchSite = async (siteId: number) => setSite(await api().analytics.siteSummary(siteId))

  useEffect(() => {
    if (!siteIdFromParams) return

    const siteIdNumber = Number.parseInt(siteIdFromParams, 10)
    if (!siteIdNumber) return

    void fetchSite(siteIdNumber)
  }, [siteIdFromParams])

  if (!site) {
    return <div>Loading...</div>
  }

  return (
    <div className='container py-3 d-flex flex-column gap-4'>
      <div className='bg-white rounded d-flex'>
        <div className='p-5'>
          <span>{translate('analyticsSite.location')}</span>
        </div>

        <div className='site-info-container py-4 px-5 flex-grow-1'>
          <div className='d-flex justify-content-between'>
            <div>
              <h2>{site.name}</h2>
            </div>

            <button className='btn btn-primary' type='button'>{translate('analyticsSite.social-page')}</button>
          </div>

          <div className={`d-flex justify-content-between mt-4 ${classes.analyticsCountsContainer}`}>
            <div className='d-flex align-items-center gap-2 me-5'>
              <div className='bg-lightgreen rounded-circle d-flex justify-content-center align-items-center p-2'>
                <Icon icon='sitePlantedIcon' size='5xl' />
              </div>
              <div className='d-flex flex-column'>
                <span className='text-primary fs-4 fw-bold'>{site.plantCount}</span>
                <span className='text-muted'>{translate('analytics.site-summary.planted')}</span>
              </div>
            </div>

            <div className='d-flex align-items-center gap-2 me-5'>
              <div className='bg-lightgreen rounded-circle d-flex justify-content-center align-items-center p-2'>
                <Icon icon='siteSurvivedIcon' size='5xl' />
              </div>
              <div className='d-flex flex-column'>
                <span className='text-primary fs-4 fw-bold'>{site.survivedCount}</span>
                <span className='text-muted'>{translate('analytics.site-summary.survived')}</span>
              </div>
            </div>

            <div className='d-flex align-items-center gap-2 me-5'>
              <div className='bg-lightgreen rounded-circle d-flex justify-content-center align-items-center p-2'>
                <Icon icon='sitePropagationIcon' size='5xl' />
              </div>
              <div className='d-flex flex-column'>
                <span className='text-primary fs-4 fw-bold'>{site.propagationCount}</span>
                <span className='text-muted'>{translate('analytics.site-summary.propagation')}</span>
              </div>
            </div>

            <div className='d-flex align-items-center gap-2 me-5'>
              <div className='bg-lightgreen rounded-circle d-flex justify-content-center align-items-center p-2'>
                <Icon icon='siteVisitorsIcon' size='5xl' />
              </div>
              <div className='d-flex flex-column'>
                <span className='text-primary fs-4 fw-bold'>{site.visitorCount}</span>
                <span className='text-muted'>{translate('analytics.site-summary.visitors')}</span>
              </div>
            </div>
          </div>

          <div className='mt-3'>
            <div className='d-flex align-items-flex-end fw-bold'>
              <span className='material-symbols-outlined'>group</span>
              <span className='ms-1 me-2'>{translate('analyticsSite.sponsors')}:</span>
              {site.sponsors.map(sponsor => <span className='me-4' key={sponsor}>{sponsor}</span>)}
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white rounded py-3 px-4 d-flex'>
        <h4>{translate('analyticsSite.batch-tracking')}</h4>
      </div>
    </div>
  )
}

export default AnalyticsSite
