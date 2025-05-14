import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BatchModal from '@components/analytics/batch-modal/BatchModal'
import BatchTable from '@components/analytics/BatchTable'
import { LanguageContext } from '@components/context/LanguageContext'
import { SnackbarContext } from '@components/context/SnackbarContext'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import type { BatchDetail, SiteSummaryDetail } from '@services/api'

type Props = {
  readonly siteSummary: SiteSummaryDetail,
  readonly fetchSite: (siteId: number) => Promise<void>,
}

const AnalyticsSiteBatches = ({ siteSummary, fetchSite }: Props) => {
  const { t: translate } = useTranslation()
  const { formatDate } = useContext(LanguageContext)
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { getApiClient } = useApiClient()
  const { displayUnhandledAPIError } = useErrorHandling()

  const [isModalBatchOpen, setIsModalBatchOpen] = useState(false)

  const [lastModifiedBatchDate, setLastModifiedBatchDate] = useState<Date | undefined>()
  const [batchToEdit, setBatchToEdit] = useState<BatchDetail | undefined>()

  useEffect(() => {
    if (siteSummary.batches.length === 0) {
      setLastModifiedBatchDate(undefined)
    } else {
      const lastModifiedBatch = siteSummary
        .batches
        .map(batch => batch.updatedAt ?? new Date())
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

  const handleBatchDelete = async (batchId: number) =>
    getApiClient().batchClient.delete(batchId).then(async () => {
      openAlertSnackbar(
        translate('analyticsSite.delete-batch.success', {
          batchName: siteSummary.batches.find(batch => batch.id === batchId)?.name,
        }),
      )

      await fetchSite(siteSummary.id).catch(() =>
        displayUnhandledAPIError('errors.fetch-site-data-failed')
      )
    }).catch(() =>
      displayUnhandledAPIError(
        'analyticsSite.delete-batch.error',
        { batchName: siteSummary.batches.find(batch => batch.id === batchId)?.name },
      )
    )

  return (
    <>
      <div className='card py-4 px-5'>
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
            onClick={() => {
              setBatchToEdit(undefined)
              setIsModalBatchOpen(true)
            }}
            type='button'
          >
            <span className='material-symbols-outlined fill-icon me-2'>add</span>
            <span>{translate('analyticsSite.add-new-batch')}</span>
          </button>
        </div>

        <BatchTable
          batches={siteSummary.batches}
          onBatchDelete={(batchId: number) => void handleBatchDelete(batchId)}
          onBatchUpdate={(batchId: number) => {
            setBatchToEdit(siteSummary.batches.find(batch => batch.id === batchId))
            setIsModalBatchOpen(true)
          }}
        />
      </div>

      <BatchModal
        batchToEdit={batchToEdit}
        handleClose={hasChanged => {
          setIsModalBatchOpen(false)
          if (hasChanged) {
            fetchSite(siteSummary.id).catch(
              displayUnhandledAPIError('analyticsSite.batch-modal.feedback.create-error'),
            )
          }
        }}
        open={isModalBatchOpen}
        site={siteSummary}
      />
    </>
  )
}

export default AnalyticsSiteBatches
