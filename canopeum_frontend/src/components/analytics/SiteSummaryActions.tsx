import SearchBar from '@components/SearchBar'
import type { SiteSummary, User } from '@services/api'
import { type ChangeEvent, useState } from 'react'
import { Dropdown, Popover, Whisper } from 'rsuite'

type Props = {
  readonly siteSummary: SiteSummary,
  readonly admins: User[],
}

const SiteSummaryActions = ({ siteSummary, admins }: Props) => {
  const [filteredAdmins, setFilteredAdmins] = useState(admins)
  const [selectedAdmins, setSelectedAdmins] = useState(siteSummary.admins.map(admin => admin.user))

  const onSearchAdmins = (query: string) =>
    setFilteredAdmins(admins.filter(admin =>
      admin
        .username
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase())
    ))

  // TODO(NicolasDontigny): Create Checkbox component
  const onAdminSelectionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    console.log('CHECKBOX event target:', event.target)
    console.log('CHECKBOX value:', value)
  }

  const onSaveAdmins = () => {
    console.log('selectedAdmins:', selectedAdmins)
  }

  const administratorsSelection = (
    <div className='py-2 px-3' style={{ minWidth: '18rem' }}>
      <SearchBar onChange={onSearchAdmins} />

      <div className='mt-2 py-2'>
        {filteredAdmins.map(admin => {
          const checkboxId = `site-${siteSummary.id}-admin-${admin.id}-checkbox`
          const isAlreadyAdmin = siteSummary.admins.some(siteAdmin => siteAdmin.user.id === admin.id)

          return (
            <div className='form-check' key={admin.id}>
              <input
                className='form-check-input'
                defaultChecked={isAlreadyAdmin}
                id={checkboxId}
                onChange={onAdminSelectionChange}
                type='checkbox'
                value={admin.id}
              />
              <label className='form-check-label' htmlFor={checkboxId}>
                {admin.username}
              </label>
            </div>
          )
        })}
      </div>

      <div className='d-flex justify-content-between pt-2 border-top'>
        <button className='btn btn-outline-primary' style={{ minWidth: '6rem' }} type='button'>Cancel</button>
        <button className='btn btn-primary' style={{ minWidth: '6rem' }} type='button'>Save</button>
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
