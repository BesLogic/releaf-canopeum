import Checkbox from '@components/Checkbox'
import SearchBar from '@components/SearchBar'
import { PatchedSiteAdminUpdateRequest, type SiteSummary, type User } from '@services/api'
import getApiClient from '@services/apiInterface'
import { useCallback, useEffect, useState } from 'react'
import { Dropdown, Popover, Whisper } from 'rsuite'

type Props = {
  readonly siteSummary: SiteSummary,
  readonly admins: User[],
}

const SiteSummaryActions = ({ siteSummary, admins }: Props) => {
  const [filteredAdmins, setFilteredAdmins] = useState(admins)
  const [selectedAdmins, setSelectedAdmins] = useState(siteSummary.admins.map(admin => admin.user))

  useEffect(() => {
    setFilteredAdmins(admins)
    setSelectedAdmins(siteSummary.admins.map(admin => admin.user))
  }, [siteSummary.admins, admins])

  const onSearchAdmins = useCallback((query: string) =>
    setFilteredAdmins(admins.filter(admin =>
      admin
        .username
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase())
    )), [admins])

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

    await getApiClient()
      .siteClient
      .updateAdmins(siteSummary.id, body)
    // TODO(NicolasDontigny): Do we need to update the parent model here?
  }

  const onSelectAdminsCancel = () => {
    setFilteredAdmins([...admins])
    setSelectedAdmins(siteSummary.admins.map(admin => admin.user))
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
        >Cancel</button>
        <button
          className='btn btn-primary'
          onClick={onSaveAdmins}
          style={{ minWidth: '6rem' }}
          type='button'
        >Save</button>
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
        <Dropdown.Item>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  )

  return (
    <Whisper
      placement='auto'
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
  )
}

export default SiteSummaryActions
