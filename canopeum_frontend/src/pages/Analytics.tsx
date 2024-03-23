import { useEffect, useState } from 'react'

import type { SiteSummary } from '../services/api'
import api from '../services/apiInterface'
import { ensureError } from '../services/errors'

const Analytics = () => {
  const [siteSummaries, setSiteSummaries] = useState<SiteSummary[]>([])
  const [isLoadingSiteSummaries, setIsLoadingSiteSummaries] = useState(false)
  const [siteSummariesError, setSiteSummariesError] = useState<Error | undefined>(undefined)

  const fetchSites = async () => {
    setIsLoadingSiteSummaries(true)
    try {
      const response = await api.siteSummary()
      setSiteSummaries(response)
    } catch (error_: unknown) {
      setSiteSummariesError(ensureError(error_))
    } finally {
      setIsLoadingSiteSummaries(false)
    }
  }

  useEffect((): void => {
    void fetchSites()
  }, [])

  const renderSiteCards = () => {
    if (isLoadingSiteSummaries) {
      return <p>Loading...</p>
    }

    if (siteSummariesError) {
      return <p>Error: {siteSummariesError.message}</p>
    }

    return siteSummaries.map(site => (
      <div
        className='col-12 col-md-6 col-lg-3'
        key={site.name}
      >
        <div className='card h-100'>
          <div className='card-body d-flex flex-column h-100'>
            <h5 className='card-title'>{site.name ?? 'Unnamed site'}</h5>
            <p className='card-text'>
              Site summary content here.
            </p>
          </div>
        </div>
      </div>
    ))
  }

  const renderSuccessRatesChart = () => (
    <div>
      <span>Chart to be rendered here</span>
    </div>
  )

  return (
    <div>
      <div className='container pt-3 d-flex flex-column gap-2'>
        <div className='d-flex justify-content-between'>
          <h1 className='text-light'>Manage my Sites</h1>

          <button className='btn btn-secondary' type='button'>Create a New Site</button>
        </div>

        <div className='mt-2 row gx-3 gy-3'>
          {renderSiteCards()}
        </div>

        <div className='mt-4 bg-white rounded p-3'>
          <h2>Average Annual Success Rate Per Site</h2>
          {renderSuccessRatesChart()}
        </div>

        <div className='mt-4 bg-white rounded p-3'>
          <div className='d-flex justify-content-between'>
            <h2>Batch Tracking</h2>
            <div>
              <span>Filters Go Here</span>
            </div>
          </div>
          {renderSuccessRatesChart()}
        </div>
      </div>
    </div>
  )
}

export default Analytics
