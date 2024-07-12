import { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import LoadingPage from './LoadingPage'
import CreateBatch from '@components/analytics/add-batch-modal/CreateBatchModal'
import AnalyticsSiteHeader from '@components/analytics/AnalyticsSiteHeader'
import BatchTable from '@components/analytics/BatchTable'
import { LanguageContext } from '@components/context/LanguageContext'
import useApiClient from '@hooks/ApiClientHook'
import type { SiteSummary } from '@services/api'

const AnalyticsSite = () => {
  const { t: translate } = useTranslation<'analytics'>()
  const { siteId: siteIdFromParams } = useParams()
  const { formatDate } = useContext(LanguageContext)
  const { getApiClient } = useApiClient()

  const [siteSummary, setSiteSummary] = useState<SiteSummary | undefined>()
  const [lastModifiedBatchDate, setLastModifiedBatchDate] = useState<Date | undefined>()

  const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false)
  const [wasCreateBatchOpened, setWasCreateBatchOpened] = useState(false)

  const fetchSite = useCallback(
    async (siteId: number) => setSiteSummary(await getApiClient().siteClient.summary(siteId)),
    [getApiClient],
  )

  useEffect(() => {
    if (!siteIdFromParams) return

    const siteIdNumber = Number.parseInt(siteIdFromParams, 10)
    if (!siteIdNumber) return

    void fetchSite(siteIdNumber)
  }, [fetchSite, siteIdFromParams])

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

  useEffect(() => {
    if (!isCreateBatchOpen) return

    setWasCreateBatchOpened(true)
  }, [isCreateBatchOpen])

  if (!siteSummary) {
    return <LoadingPage />
  }

  return (
    <div className='page-container d-flex flex-column gap-4'>
      <AnalyticsSiteHeader siteSummary={siteSummary} />

      <div className='bg-cream rounded py-4 px-5'>
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

          <button
            className='unstyled-button text-primary d-flex align-items-center'
            onClick={() => setIsCreateBatchOpen(true)}
            type='button'
          >
            <span className='material-symbols-outlined fill-icon me-2'>add</span>
            <span>{translate('analyticsSite.add-new-batch')}</span>
          </button>
        </div>

        <BatchTable batches={siteSummary.batches} />
      </div>

      {wasCreateBatchOpened && (
        <CreateBatch
          handleClose={reason => {
            setIsCreateBatchOpen(false)
            if (reason === 'create') void fetchSite(siteSummary.id)
          }}
          open={isCreateBatchOpen}
          site={siteSummary}
        />
      )}
    </div>
  )
}

export default AnalyticsSite
