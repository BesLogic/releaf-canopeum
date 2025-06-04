import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import PopupState from 'material-ui-popup-state'
import { bindMenu, bindTrigger, type PopupState as PopupStateType } from 'material-ui-popup-state/hooks'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

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

const BatchActionsPopup = (
  { popupState, onEdit, onDelete, batchDetail }: Props & { readonly popupState: PopupStateType },
) => {
  const { t: translate } = useTranslation()
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { getApiClient } = useApiClient()
  const { displayUnhandledAPIError } = useErrorHandling()

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [batchToEdit, setBatchToEdit] = useState<BatchDetail | null>(null)

  const deleteBatch = async () => {
    popupState.close()
    await getApiClient().batchClient.delete(batchDetail.id)
    openAlertSnackbar(
      translate('analyticsSite.delete-batch.success', { batchName: batchDetail.name }),
    )
    onDelete()
  }

  const handleConfirmDeleteClose = (proceed: boolean) => {
    setConfirmDeleteOpen(false)
    if (proceed) {
      deleteBatch().catch(
        displayUnhandledAPIError(
          'analyticsSite.delete-batch.error',
          { batchName: batchDetail.name },
        ),
      )
    }
  }

  return (
    <>
      {/* eslint-disable react/jsx-props-no-spreading -- Needed for MUI trigger */}
      <button
        className='bg-lightgreen text-center rounded-circle unstyled-button'
        type='button'
        {...bindTrigger(popupState)}
      >
        {/* eslint-enable react/jsx-props-no-spreading */}
        <span className='material-symbols-outlined text-primary align-middle'>
          more_horiz
        </span>
      </button>
      <Menu
        {...bindMenu(popupState)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => {
            popupState.close()
            setBatchToEdit(batchDetail)
          }}
        >
          {translate('analyticsSite.edit-batch')}
        </MenuItem>
        <MenuItem onClick={() => setConfirmDeleteOpen(true)}>
          {translate('analyticsSite.delete-batch.title')}
        </MenuItem>
      </Menu>

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

const BatchActions = (props: Props) => (
  <PopupState popupId={`batch-actions-${props.batchDetail.id}`} variant='popover'>
    {popupState => <BatchActionsPopup popupState={popupState} {...props} />}
  </PopupState>
)

export default BatchActions
