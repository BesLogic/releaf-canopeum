import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dropdown, Popover, Whisper } from 'rsuite'
import type { OverlayTriggerHandle } from 'rsuite/esm/internals/Picker'

import ConfirmationDialog from '@components/dialogs/ConfirmationDialog'
import type { BatchDetail } from '@services/api'

type Props = {
  readonly onEdit: () => void,
  readonly onDelete: () => void,
  readonly batchDetail: BatchDetail,
}

const BatchActions = ({ onEdit, onDelete, batchDetail }: Props) => {
  const { t: translate } = useTranslation()

  const whisperRef = useRef<OverlayTriggerHandle>(null)

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const handleConfirmDeleteClose = (proceed: boolean) => {
    setConfirmDeleteOpen(false)
    if (proceed) {
      whisperRef.current?.close()
      onDelete()
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
              <Dropdown.Item onClick={() => onEdit()}>
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
