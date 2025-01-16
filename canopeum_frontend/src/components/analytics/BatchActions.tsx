import { useContext, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dropdown, Popover, Whisper } from 'rsuite'
import type { OverlayTriggerHandle } from 'rsuite/esm/internals/Picker'

import EditBatchModal from '@components/analytics/batch-modal/EditBatchModal'
import { SnackbarContext } from '@components/context/SnackbarContext'
import ConfirmationDialog from '@components/dialogs/ConfirmationDialog'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import type { BatchDetail } from '@services/api'

type Props = {
  readonly onEdit: () => void,
  readonly onDelete: () => void,
  readonly batchDetail: BatchDetail,
}

const BatchActions = ({ onEdit, onDelete, batchDetail }: Props) => {
  const { t: translate } = useTranslation()
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { getApiClient } = useApiClient()
  const { getErrorMessage } = useErrorHandling()

  const whisperRef = useRef<OverlayTriggerHandle>(null)

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [batchToEdit, setBatchToEdit] = useState<BatchDetail | null>(null)

  const deleteBatch = async () => {
    whisperRef.current?.close()

    await getApiClient().batchClient.delete(batchDetail.id)
    openAlertSnackbar(
      translate('analyticsSite.delete-batch.success', { batchName: batchDetail.name }),
    )
    onDelete()
  }

  const handleConfirmDeleteClose = (proceed: boolean) => {
    setConfirmDeleteOpen(false)
    if (proceed) {
      deleteBatch().catch((error: unknown) =>
        openAlertSnackbar(
          getErrorMessage(
            error,
            translate('analyticsSite.delete-batch.error', { batchName: batchDetail.name }),
          ),
          { severity: 'error' },
        )
      )
    }
  }

  return (
    <>
      <Whisper
        placement='auto'
        ref={whisperRef}
        speaker={
          <Popover full>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setBatchToEdit(batchDetail)}>
                {translate('analyticsSite.edit-batch')}
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setConfirmDeleteOpen(true)}>
                {translate('analyticsSite.delete-batch.title')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Popover>
        }
        trigger='click'
      >
        <button
          className='bg-lightgreen text-center rounded-circle unstyled-button'
          type='button'
        >
          <span className='material-symbols-outlined text-primary align-middle'>
            more_horiz
          </span>
        </button>
      </Whisper>
      {batchToEdit && (
        <EditBatchModal
          batchToEdit={batchToEdit}
          handleClose={reason => {
            setBatchToEdit(null)
            if (reason === 'edit') onEdit()
          }}
        />
      )}
      <ConfirmationDialog
        actions={['cancel', 'delete']}
        onClose={handleConfirmDeleteClose}
        open={confirmDeleteOpen}
        title={translate('analyticsSite.delete-batch.title')}
      >
        {translate('analyticsSite.delete-batch.message', {
          batchName: batchDetail.name,
        })}
      </ConfirmationDialog>
    </>
  )
}

export default BatchActions
