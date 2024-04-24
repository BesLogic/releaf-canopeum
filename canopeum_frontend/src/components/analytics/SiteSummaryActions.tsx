import Checkbox from '@components/Checkbox'
import { SnackbarContext } from '@components/context/SnackbarContext'
import ConfirmationDialog from '@components/dialogs/ConfirmationDialog'
import SearchBar from '@components/SearchBar'
import type { SiteSummary, User } from '@services/api'
import { PatchedSiteAdminUpdateRequest } from '@services/api'
import getApiClient from '@services/apiInterface'
import { type Dispatch, type SetStateAction, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dropdown, Popover, Whisper } from 'rsuite'
import type { OverlayTriggerHandle } from 'rsuite/esm/internals/Overlay/OverlayTrigger'

type Props = {
  readonly siteSummary: SiteSummary,
  readonly admins: User[],
  readonly onSiteChange: Dispatch<SetStateAction<SiteSummary[]>>,
}

const SiteSummaryActions = ({ siteSummary, admins, onSiteChange }: Props) => {
  const { t: translate } = useTranslation()
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const whisperRef = useRef<OverlayTriggerHandle>(null)

  const [filteredAdmins, setFilteredAdmins] = useState(admins)
  const [selectedAdmins, setSelectedAdmins] = useState(siteSummary.admins.map(admin => admin.user))
  const [confirmCommentDeleteOpen, setConfirmCommentDeleteOpen] = useState(false)

  useEffect(() => {
    setFilteredAdmins(admins)
    setSelectedAdmins(siteSummary.admins.map(admin => admin.user))
  }, [siteSummary.admins, admins])

  const onSearchAdmins = useCallback(
    (query: string) =>
      setFilteredAdmins(admins.filter(admin =>
        admin
          .username
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase())
      )),
    [admins],
  )

  const onAdminSelectionChange = (adminId: number, isSelected: boolean) => {
    if (isSelected) {
      const isAlreadyAdmin = selectedAdmins.find(admin => admin.id === adminId)
      if (isAlreadyAdmin) return

      const matchingAdmin = admins.find(admin => admin.id === adminId)
      if (!matchingAdmin) return

      setSelectedAdmins(previous => [...previous, matchingAdmin])
    } else {
      setSelectedAdmins(previous => previous.filter(admin => admin.id !== adminId))
    }
  }

  const onSaveAdmins = async () => {
    const body = new PatchedSiteAdminUpdateRequest({ ids: selectedAdmins.map(admin => admin.id) })

    const updatedAdmins = await getApiClient()
      .siteClient
      .updateAdmins(siteSummary.id, body)
    // Update the parent model
    onSiteChange(previous =>
      previous.map(site => {
        if (site.id === siteSummary.id) {
          site.admins = updatedAdmins
        }

        return site
      })
    )
    whisperRef.current?.close()
    openAlertSnackbar(
      translate('analytics.site-summary.admins-saved', { siteName: siteSummary.name }),
    )
  }

  const onSelectAdminsCancel = () => {
    setFilteredAdmins([...admins])
    setSelectedAdmins(siteSummary.admins.map(admin => admin.user))
    whisperRef.current?.close()
  }

  const onDeleteSiteClick = () => setConfirmCommentDeleteOpen(true)

  const deleteSite = async () => {
    whisperRef.current?.close()
    try {
      await getApiClient().siteClient.delete(siteSummary.id)
      openAlertSnackbar(
        translate('analytics.site-summary.site-deleted', { siteName: siteSummary.name }),
      )
      onSiteChange(previous => previous.filter(site => site.id !== siteSummary.id))
    } catch {
      openAlertSnackbar(
        translate('analytics.site-summary.site-deleted-error', { siteName: siteSummary.name }),
        { severity: 'error' },
      )
    }
  }

  const onDeleteSiteConfirmation = (proceedWithDelete: boolean) => {
    if (!proceedWithDelete) {
      setConfirmCommentDeleteOpen(false)

      return
    }

    void deleteSite()
  }

  const administratorsSelection = (
    <div className='py-2 px-3' style={{ minWidth: '18rem' }}>
      <SearchBar onChange={onSearchAdmins} />

      <div className='mt-2 py-2'>
        {filteredAdmins.map(admin => {
          const checkboxId = `site-${siteSummary.id}-admin-${admin.id}-checkbox`
          const isSelected = selectedAdmins.some(siteAdmin => siteAdmin.id === admin.id)

          return (
            <Checkbox
              checked={isSelected}
              id={checkboxId}
              key={admin.id}
              onChange={onAdminSelectionChange}
              value={admin.id}
            >
              {admin.username}
            </Checkbox>
          )
        })}
      </div>

      <div className='d-flex justify-content-between pt-2 border-top'>
        <button
          className='btn btn-outline-primary'
          onClick={onSelectAdminsCancel}
          style={{ minWidth: '6rem' }}
          type='button'
        >
          Cancel
        </button>
        <button
          className='btn btn-primary'
          onClick={onSaveAdmins}
          style={{ minWidth: '6rem' }}
          type='button'
        >
          Save
        </button>
      </div>
    </div>
  )

  const actionsPopover = (
    <Popover full>
      <Dropdown.Menu>
        <Dropdown.Menu title='Select Administrator'>
          {administratorsSelection}
        </Dropdown.Menu>
        <Dropdown.Item>Edit Site Information</Dropdown.Item>
        <Dropdown.Item onClick={onDeleteSiteClick}>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  )

  return (
    <>
      <Whisper
        placement='auto'
        ref={whisperRef}
        speaker={actionsPopover}
        trigger='click'
      >
        <button
          className='bg-lightgreen text-center rounded-circle unstyled-button'
          type='button'
        >
          <span
            className='material-symbols-outlined text-primary align-middle'
            style={{ fontSize: 24 }}
          >
            more_horiz
          </span>
        </button>
      </Whisper>

      <ConfirmationDialog
        actions={['cancel', 'delete']}
        onClose={(proceed: boolean) => onDeleteSiteConfirmation(proceed)}
        open={!!confirmCommentDeleteOpen}
        title={translate('analytics.site-summary.delete-site-confirmation-title')}
      >
        {translate('analytics.site-summary.delete-site-confirmation-message', { siteName: siteSummary.name })}
      </ConfirmationDialog>
    </>
  )
}

export default SiteSummaryActions
