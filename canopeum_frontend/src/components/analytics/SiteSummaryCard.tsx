import SiteSponsorProgress from '@components/analytics/SiteSponsorProgress'
import PrimaryIconBadge from '@components/PrimaryIconBadge'
import SearchBar from '@components/SearchBar'
import type { SiteSummary } from '@services/api'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Dropdown, Popover, Whisper } from 'rsuite'

import CustomIcon from '../icons/CustomIcon'

type Props = {
  readonly site: SiteSummary,
}

const SiteSummaryCard = ({ site }: Props) => {
  const { t: translate } = useTranslation()

  const siteAdminsDisplay = site.admins.length > 0
    ? site.admins.map(admin => admin.username).join(', ')
    : translate('analytics.site-summary.no-amins')

  const summaryCardActionsPopover = (
    <Popover full>
      <Dropdown.Menu>
        <Dropdown.Menu title='Select Administrator'>
          <div className='p-4'>
            <SearchBar />

            <span>ONE MORE TIME</span>
          </div>
        </Dropdown.Menu>
        <Dropdown.Item>Edit Site Information</Dropdown.Item>
        <Dropdown.Item>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Popover>
  )

  return (
    <div
      className='col-3'
      key={site.name}
    >
      <div className='card h-100 w-100 py-3'>
        <SearchBar />
        <div className='card-body d-flex flex-column h-100'>
          <div className='d-flex justify-content-between align-items-center card-title'>
            <Link className='nav-link' to={`/analytics/${site.id}`}>
              <div className='d-flex gap-1 align-items-center flex-grow-1'>
                <PrimaryIconBadge type='school' />
                <h5 className='mb-0 text-ellipsis'>{site.name ?? translate('analytics.site-summary.unnamed-site')}</h5>
              </div>
            </Link>

            <Whisper placement='auto' speaker={summaryCardActionsPopover} trigger='click'>
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
          </div>

          <div className='card-subtitle my-1'>
            <div className='d-flex align-items-center text-muted'>
              <span className='material-symbols-outlined fill-icon text-muted me-1'>location_on</span>
              <span className='text-ellipsis'>
                {site.coordinate.address ?? translate('analytics.site-summary.unknown')}
              </span>
            </div>
            <div className='d-flex align-items-center text-muted'>
              <span className='material-symbols-outlined fill-icon text-muted me-1'>person</span>
              <span className='text-ellipsis'>{siteAdminsDisplay}</span>
            </div>
          </div>

          <div className='card-text mt-2'>
            <div className='row my-2'>
              <div className='col-4 d-flex flex-column align-items-center'>
                <div className='bg-lightgreen rounded-circle d-flex justify-content-center align-items-center p-2'>
                  <CustomIcon icon='sitePlantedIcon' size='xl' />
                </div>
                <span className='text-primary fs-4 fw-bold'>{site.plantCount}</span>
                <span className='text-muted'>{translate('analytics.site-summary.planted')}</span>
              </div>

              <div className='col-4 d-flex flex-column align-items-center'>
                <div className='bg-lightgreen rounded-circle d-flex justify-content-center align-items-center p-2'>
                  <CustomIcon icon='siteSurvivedIcon' size='xl' />
                </div>
                <span className='text-primary fs-4 fw-bold'>{site.survivedCount}</span>
                <span className='text-muted'>{translate('analytics.site-summary.survived')}</span>
              </div>

              <div className='col-4 d-flex flex-column align-items-center'>
                <div className='bg-lightgreen rounded-circle d-flex justify-content-center align-items-center p-2'>
                  <CustomIcon icon='sitePropagationIcon' size='xl' />
                </div>
                <span className='text-primary fs-4 fw-bold'>{site.propagationCount}</span>
                <span className='text-muted'>{translate('analytics.site-summary.propagation')}</span>
              </div>
            </div>

            <div className='mt-4'>
              <SiteSponsorProgress progress={site.progress} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SiteSummaryCard
