import AnalyticsSiteHeader from '@components/analytics/AnalyticsSiteHeader'
import BatchTable from '@components/analytics/BatchTable'
import type { SiteSummary } from '@services/api'
import api from '@services/apiInterface'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

const lastUpdatedDateOptions = {}

const AnalyticsSite = () => {
  const { t: translate } = useTranslation<'analytics'>()
  const { siteId: siteIdFromParams } = useParams()

  const [siteSummary, setSiteSummary] = useState<SiteSummary | undefined>()
  const [lastModifiedBatchDate, setLastModifiedBatchDate] = useState<Date | undefined>()

  const fetchSite = async (siteId: number) => setSiteSummary(await api().analytics.siteSummary(siteId))

  useEffect(() => {
    if (!siteIdFromParams) return

    const siteIdNumber = Number.parseInt(siteIdFromParams, 10)
    if (!siteIdNumber) return

    void fetchSite(siteIdNumber)
  }, [siteIdFromParams])

  useEffect(() => {
    if (!siteSummary || siteSummary.batches.length === 0) {
      setLastModifiedBatchDate(undefined)

      return
    }

    const dates = siteSummary.batches.map(batch => batch.updatedOn)
    console.log('dates:', dates)
    const lastModifiedBatch = siteSummary.batches.map(batch => batch.updatedOn).reduce((a, b) =>
      a > b
        ? a
        : b
    )
    console.log('lastModifiedBatch:', lastModifiedBatch)
    setLastModifiedBatchDate(lastModifiedBatch)

    return (): void => {
      setSiteSummary(undefined)
    }
  }, [siteSummary])

  if (!siteSummary) {
    return <div>Loading...</div>
  }

  return (
    <div className='container py-3 d-flex flex-column gap-4'>
      <AnalyticsSiteHeader siteSummary={siteSummary} />

      <div className='bg-white rounded py-4 px-5'>
        <div className='d-flex justify-content-between mb-3'>
          <h4>{translate('analyticsSite.batch-tracking')} ({siteSummary.batches.length})</h4>

          <div className='text-muted'>
            <span className='me-2'>{translate('analytics.last-update')}:</span>
            <span>
              {lastModifiedBatchDate?.toLocaleString('fr-CA') ?? 'N/A'}
            </span>
          </div>

          <div className='text-primary'>
            <span className='material-symbols-outlined fill-icon me-2'>add</span>
            <span>Add a New Batch</span>
          </div>
        </div>

        <BatchTable batches={siteSummary.batches} />
      </div>
    </div>
  )
}

export default AnalyticsSite
