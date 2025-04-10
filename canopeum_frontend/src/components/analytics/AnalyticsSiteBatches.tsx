import BatchModal from '@components/analytics/batch-modal/BatchModal'
import BatchTable from '@components/analytics/BatchTable'
import { LanguageContext } from '@components/context/LanguageContext'
import { SnackbarContext } from '@components/context/SnackbarContext'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import type { BatchDetail, SiteSummaryDetail } from '@services/api'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  siteSummary: SiteSummaryDetail,
  fetchSite: (siteId: number) => Promise<void>,
}

const AnalyticsSiteBatches = ({ siteSummary, fetchSite }: Props) => {
  const { t: translate } = useTranslation()
  const { formatDate } = useContext(LanguageContext)
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { getApiClient } = useApiClient()
  const { displayUnhandledAPIError } = useErrorHandling()

  const [isModalBatchOpen, setIsModalBatchOpen] = useState(false)

  const [lastModifiedBatchDate, setLastModifiedBatchDate] = useState<Date | undefined>()
  const [batchToEdit, setBatchToEdit] = useState<BatchDetail | undefined>(undefined)

  useEffect(() => {
    if (!siteSummary || siteSummary.batches.length === 0) {
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

  const handleBatchDelete = (batchId: number) => {
    getApiClient().batchClient.delete(batchId).then(() => {
      openAlertSnackbar(
        translate('analyticsSite.delete-batch.success', {
          batchName: siteSummary.batches.find(batch => batch.id === batchId)?.name,
        }),
      )

      fetchSite(siteSummary.id).catch(
        displayUnhandledAPIError('analyticsSite.batch-modal.feedback.delete-error'),
      )
    }).catch(_ => {
      displayUnhandledAPIError(
        'analyticsSite.delete-batch.error',
        { batchName: siteSummary.batches.find(batch => batch.id === batchId)?.name },
      ), displayUnhandledAPIError('analyticsSite.batch-modal.feedback.delete-error')
    })
  }

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
          siteId={siteSummary.id}
          onBatchUpdate={(batchId: number) => {
            setBatchToEdit(siteSummary.batches.find(batch => batch.id === batchId))
            setIsModalBatchOpen(true)
          }}
          onBatchDelete={(batchId: number) => {
            handleBatchDelete(batchId)
          }}
        />
      </div>

      <BatchModal
        handleClose={reason => {
          setIsModalBatchOpen(false)
          switch (reason) {
            case 'create':
              fetchSite(siteSummary.id).catch(
                displayUnhandledAPIError('analyticsSite.batch-modal.feedback.create-error'),
              )
              break
            case 'edit':
              fetchSite(siteSummary.id).catch(
                displayUnhandledAPIError('analyticsSite.batch-modal.feedback.edit-error'),
              )
              break
          }
        }}
        open={isModalBatchOpen}
        site={siteSummary}
        batchToEdit={batchToEdit}
      />
    </>
  )
}

export default AnalyticsSiteBatches
