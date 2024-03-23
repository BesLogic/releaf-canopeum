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
      const response = await api().analytics.siteSummaries()
      setSiteSummaries(response)
    } catch (error: unknown) {
      setSiteSummariesError(ensureError(error))
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
        className='col-12 col-md-6 col-lg-4'
        key={site.name}
      >
        <div className="card h-100 py-3">
          <div className='card-body d-flex flex-column h-100'>
            <div className='d-flex align-items-center card-title'>
              <div className='bg-primary rounded-circle d-flex justify-content-center align-items-center p-1 me-2'>
                <span className='material-symbols-outlined text-light'>school</span>
              </div>
              <h5 className='mb-0'>{site.name ?? 'Unnamed site'}</h5>
            </div>

            <div className="card-subtitle my-1">
              <div className='d-flex align-items-center text-muted'>
                <span className='material-symbols-outlined fill-icon text-muted me-1'>location_on</span>
                <span>Missing Location</span>
              </div>
              <div className='d-flex align-items-center text-muted'>
                <span className='material-symbols-outlined fill-icon text-muted me-1'>person</span>
                <span>Missing Owner</span>
              </div>
            </div>

            <div className='card-text mt-2'>
              <div className='row my-2'>
                <div className="col-4 d-flex flex-column align-items-center">
                  <div className='bg-primary rounded-circle d-flex justify-content-center align-items-center p-2'>
                    <span className='material-symbols-outlined text-light'>psychiatry</span>
                  </div>
                  <span>{site.plantCount}</span>
                  <span className='text-muted'>Planted</span>
                </div>

                <div className="col-4 d-flex flex-column align-items-center">
                  <div className='bg-primary rounded-circle d-flex justify-content-center align-items-center p-2'>
                    <span className='material-symbols-outlined text-light'>forest</span>
                  </div>
                  <span>{site.survivedCount}</span>
                  <span className='text-muted'>Survived</span>
                </div>

                <div className="col-4 d-flex flex-column align-items-center">
                  <div className='bg-primary rounded-circle d-flex justify-content-center align-items-center p-2'>
                    <span className='material-symbols-outlined text-light'>forest</span>
                  </div>
                  <span>{site.propagationCount}</span>
                  <span className='text-muted'>Propagation</span>
                </div>
              </div>

              <div className="mt-4 d-flex align-items-center">
                <div className="flex-grow-1 progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${site.progress}%` }}
                    aria-valuenow={site.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>

                <span className='text-primary ms-2'>{Math.round(site.progress)}% Sponsored</span>
              </div>
            </div>
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
