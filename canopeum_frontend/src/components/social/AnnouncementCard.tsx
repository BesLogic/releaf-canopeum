import { useState } from 'react'
import { Link } from 'react-router-dom'

import SiteAnnouncementModal from '@components/social/site-modal/SiteAnnouncementModal'
import type { PageViewMode } from '@models/types/PageViewMode.Type'
import type { Announcement } from '@services/api'

type Props = {
  readonly announcement: Announcement,
  readonly viewMode: PageViewMode,
  readonly onEdit: (announcement: Announcement) => void,
}

const AnnouncementCard = ({ announcement, viewMode, onEdit }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className='card rounded'>
        <div className='card-body'>
          <div className='d-flex justify-content-between align-items-center pb-3'>
            <h2 className='card-title'>Announcement</h2>
            <div>
              {viewMode === 'admin' && (
                <span
                  className='material-symbols-outlined text-primary fs-2'
                  onClick={() => setIsModalOpen(!isModalOpen)}
                  role='button'
                >
                  edit_square
                </span>
              )}
            </div>
          </div>
          <p className='card-text text-justify'>
            {announcement.body}
          </p>
          {announcement.link && (
            <Link className='card-text' target='_blank' to={{ pathname: announcement.link }}>
              {announcement.link}
            </Link>
          )}
        </div>
      </div>
      <SiteAnnouncementModal
        announcement={announcement}
        handleClose={(announcement: Announcement | null) => {
          setIsModalOpen(!isModalOpen)
          announcement
? onEdit(announcement)
: null
        }}
        isOpen={isModalOpen}
      />
    </>
  )
}

export default AnnouncementCard