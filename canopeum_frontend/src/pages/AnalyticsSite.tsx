import AnalyticsSiteHeader from '@components/analytics/AnalyticsSiteHeader'
import BatchTable from '@components/analytics/BatchTable'
import { LanguageContext } from '@components/context/LanguageContext'
import type { SiteSummary } from '@services/api'
import getApiClient from '@services/apiInterface'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

const AnalyticsSite = () => {
  const { t: translate } = useTranslation<'analytics'>()
  const { siteId: siteIdFromParams } = useParams()
  const { formatDate } = useContext(LanguageContext)

  const [siteSummary, setSiteSummary] = useState<SiteSummary | undefined>()
  const [lastModifiedBatchDate, setLastModifiedBatchDate] = useState<Date | undefined>()

  const fetchSite = async (siteId: number) => setSiteSummary(await getApiClient().siteClient.summary(siteId))

  useEffect(() => {
    if (!siteIdFromParams) return

    const siteIdNumber = Number.parseInt(siteIdFromParams, 10)
    if (!siteIdNumber) return

    void fetchSite(siteIdNumber)
  }, [siteIdFromParams])

  useEffect(() => {
    if (!siteSummary || siteSummary.batches.length === 0) {
      setLastModifiedBatchDate(undefined)
    } else {
      const lastModifiedBatch = siteSummary
        .batches
        .map(batch => batch.updatedAt)
        .sort((a, b) =>
          a > b
            ? -1
            : 1
        )
      setLastModifiedBatchDate(lastModifiedBatch[0])
    }

    return (): void => {
      setLastModifiedBatchDate(undefined)
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
              {lastModifiedBatchDate
                ? formatDate(lastModifiedBatchDate)
                : 'N/A'}
            </span>
          </div>

          <div className='text-primary d-flex align-items-center'>
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
