import SearchBar from '@components/SearchBar'
import type { SiteSummary } from '@services/api'
import { Dropdown, Popover, Whisper } from 'rsuite'

type Props = {
  readonly siteSummary: SiteSummary,
}

const SiteSummaryActions = ({ siteSummary }: Props) => {
  const administratorsSelection = (
    <div className='py-2 px-3' style={{ minWidth: '18rem' }}>
      <SearchBar onChange={input => console.log('input:', input)} />

      <div className='mt-2 py-2'>
        <div className='form-check'>
          <input className='form-check-input' id='flexCheckDefault' type='checkbox' value='' />
          <label className='form-check-label' htmlFor='flexCheckDefault'>
            Default checkbox
          </label>
        </div>
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
