import BatchTable from '@components/analytics/BatchTable'
import SiteSuccessRatesChart from '@components/analytics/SiteSuccessRatesChart'
import SiteSummaryCard from '@components/analytics/SiteSummaryCard'
import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { LanguageContext } from '@components/context/LanguageContext'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SiteSummary, User } from '../services/api'
import getApiClient from '../services/apiInterface'

const Analytics = () => {
  const { t } = useTranslation()
  const { formatDate } = useContext(LanguageContext)
  const { currentUser } = useContext(AuthenticationContext)
  const [siteSummaries, setSiteSummaries] = useState<SiteSummary[]>([])
  const [adminList, setAdminList] = useState<User[]>([])

  const fetchSites = async () => setSiteSummaries(await getApiClient().summaryClient.all())
  const fetchAdmins = async () => setAdminList(await getApiClient().userClient.allAdmins())

  useEffect((): void => {
    void fetchSites()
    if (currentUser?.role !== 'MegaAdmin') return

    void fetchAdmins()
  }, [])

  const renderBatches = () =>
    siteSummaries.map(site => {
      const lastModifiedBatchDate = site.batches.length > 0
        ? site
          .batches
          .map(batch => batch.updatedAt)
          .sort((a, b) =>
            a > b
              ? -1
              : 1
          )[0]
        : undefined

      return (
        <div className='accordion-item mb-3 rounded' key={site.id}>
          <h2 className='accordion-header rounded' id={`heading-${site.id}`}>
            <button
              aria-controls={`collapse-${site.id}`}
              aria-expanded='true'
              className='accordion-button collapsed rounded'
              data-bs-target={`#collapse-${site.id}`}
              data-bs-toggle='collapse'
              type='button'
            >
              <div className='d-flex justify-content-between w-100 pe-3 fs-5'>
                <span>{site.name}</span>
                <span style={{ opacity: .5 }}>
                  {t('analytics.last-update')}: {lastModifiedBatchDate
                    ? formatDate(lastModifiedBatchDate)
                    : 'N/A'}
                </span>
                <span className='text-capitalize'>
                  {site.batches.length} {t('analytics.batches', { count: site.batches.length })}
                </span>
              </div>
            </button>
          </h2>
          <div
            aria-labelledby={`heading-${site.id}`}
            className='accordion-collapse collapse'
            data-bs-parent='#accordion-batches'
            id={`collapse-${site.id}`}
          >
            <div className='accordion-body'>
              <BatchTable batches={site.batches} />
            </div>
          </div>
        </div>
      )
    })

  return (
    <div>
      <div className='container d-flex flex-column gap-2' style={{ padding: '1rem 10rem' }}>
        <div className='d-flex justify-content-between'>
          <h1 className='text-light'>Manage my Sites</h1>

          <button className='btn btn-secondary' type='button'>Create a New Site</button>
        </div>

        <div className='mt-2 row gx-3 gy-3 pb-3'>
          {siteSummaries.map(site => <SiteSummaryCard admins={adminList} key={`site-${site.id}-card`} site={site} />)}
        </div>

        <div className='mt-4 bg-white rounded p-3'>
          <h5>Average Annual Success Rate Per Site</h5>
          <SiteSuccessRatesChart siteSummaries={siteSummaries} />
        </div>

        <div className='mt-4'>
          <div className='bg-white rounded p-3 px-4'>
            <div className='d-flex justify-content-between'>
              <div className='fs-5'>Batch Tracking</div>
              <div>
                <span>Filters Go Here</span>
              </div>
            </div>
          </div>
          <div className='accordion mt-4' id='accordion-batches'>
            {renderBatches()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
