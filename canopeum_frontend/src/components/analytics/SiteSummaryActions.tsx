import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import PopupState from 'material-ui-popup-state'
import { bindHover, bindMenu, bindPopover, bindTrigger, type PopupState as PopupStateType } from 'material-ui-popup-state/hooks'
import HoverPopover from 'material-ui-popup-state/HoverPopover'
import { type Dispatch, type SetStateAction, useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Checkbox from '@components/Checkbox'
import { SnackbarContext } from '@components/context/SnackbarContext'
import ConfirmationDialog from '@components/dialogs/ConfirmationDialog'
import SearchBar from '@components/SearchBar'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import type { SiteSummary, User } from '@services/api'
import { PatchedSiteAdminUpdateRequest } from '@services/api'

type Props = {
  readonly siteSummary: SiteSummary,
  readonly admins: User[],
  readonly onSiteChange: Dispatch<SetStateAction<SiteSummary[]>>,
  readonly onSiteEdit: (siteId: number) => void,
}

const SiteSummaryActionsPopup = (
  { popupState, siteSummary, admins, onSiteChange, onSiteEdit }: Props & {
    readonly popupState: PopupStateType,
  },
) => {
  const { t: translate } = useTranslation()
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { getApiClient } = useApiClient()
  const { displayUnhandledAPIError } = useErrorHandling()

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
    popupState.close()
    const body = new PatchedSiteAdminUpdateRequest({ ids: selectedAdmins.map(admin => admin.id) })

    try {
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
      openAlertSnackbar(
        translate('analytics.site-summary.admins-saved', { siteName: siteSummary.name }),
      )
    } catch (updateAdminsError) {
      displayUnhandledAPIError(
        'errors.update-admins-failed',
        { siteName: siteSummary.name },
      )(updateAdminsError)
    }
  }

  const onSelectAdminsCancel = () => {
    popupState.close()
    setFilteredAdmins([...admins])
    setSelectedAdmins(siteSummary.admins.map(admin => admin.user))
  }

  const onDeleteSiteClick = () => setConfirmCommentDeleteOpen(true)

  const deleteSite = async () => {
    popupState.close()
    try {
      await getApiClient().siteClient.delete(siteSummary.id)
      openAlertSnackbar(
        translate('analytics.site-summary.site-deleted', { siteName: siteSummary.name }),
      )
      onSiteChange(previous => previous.filter(site => site.id !== siteSummary.id))
    } catch (deleteSiteError) {
      displayUnhandledAPIError(
        'analytics.site-summary.site-deleted-error',
        { siteName: siteSummary.name },
      )(deleteSiteError)
    }
  }

  const onDeleteSiteConfirmation = (proceedWithDelete: boolean) => {
    if (!proceedWithDelete) {
      setConfirmCommentDeleteOpen(false)

      return
    }

    deleteSite().catch(displayUnhandledAPIError('errors.delete-site-failed'))
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

  return (
    <>
      {/* eslint-disable react/jsx-props-no-spreading -- Needed for MUI trigger */}
      <button
        className='bg-lightgreen text-center rounded-circle unstyled-button'
        type='button'
        {...bindTrigger(popupState)}
      >
        {/* eslint-enable react/jsx-props-no-spreading */}
        <span
          className='material-symbols-outlined text-primary align-middle'
          style={{ fontSize: 24 }}
        >
          more_horiz
        </span>
      </button>
      <Menu {...bindMenu(popupState)}>
        <PopupState popupId={`site-admin-selection-${siteSummary.id}`} variant='popover'>
          {adminSelectionPopupState => {
            const menuLeftPos = adminSelectionPopupState.anchorEl?.getBoundingClientRect().left ?? 0
            const halfPageWidth = window.innerWidth / 2

            return (
              <>
                <MenuItem {...bindHover(adminSelectionPopupState)}>
                  {translate('analytics.select-admin')}
                  <span className='material-symbols-rounded text-muted'>arrow_right</span>
                </MenuItem>
                <HoverPopover
                  {...bindPopover(adminSelectionPopupState)}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: menuLeftPos < halfPageWidth
                      ? 'right'
                      : 'left',
                  }}
                  // Align to the menu container rather than the list item that's being hovered
                  sx={theme => ({ marginTop: theme.spacing(-1) })}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: menuLeftPos < halfPageWidth
                      ? 'left'
                      : 'right',
                  }}
                >
                  {administratorsSelection}
                </HoverPopover>
              </>
            )
          }}
        </PopupState>

        <MenuItem onClick={() => onSiteEdit(siteSummary.id)}>
          {translate('analytics.edit-site-info')}
        </MenuItem>

        <MenuItem onClick={onDeleteSiteClick}>
          {translate('generic.delete')}
        </MenuItem>
      </Menu>
      <ConfirmationDialog
        actions={['cancel', 'delete']}
        onClose={onDeleteSiteConfirmation}
        open={!!confirmCommentDeleteOpen}
        title={translate('analytics.site-summary.delete-site-confirmation-title')}
      >
        {translate(
          'analytics.site-summary.delete-site-confirmation-message',
          { siteName: siteSummary.name },
        )}
      </ConfirmationDialog>
    </>
  )
}

const SiteSummaryActions = (props: Props) => (
  <PopupState popupId={`site-summary-actions-${props.siteSummary.id}`} variant='popover'>
    {popupState => <SiteSummaryActionsPopup {...props} popupState={popupState} />}
  </PopupState>
)

export default SiteSummaryActions
