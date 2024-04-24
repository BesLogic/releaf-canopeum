import type { PageViewMode } from '@models/types/PageViewMode.Type'
import { Link } from 'react-router-dom'

import type { Announcement } from '../services/api'

type Props = {
  readonly announcement: Announcement,
  readonly viewMode: PageViewMode,
}

const AnnouncementCard = ({ announcement, viewMode }: Props) => (
  <div className='card rounded px-3 py-2'>
    <div className='card-body'>
      <div className='d-flex justify-content-between align-items-center pb-3'>
        <h2 className='card-title'>Announcement</h2>
        <div>
          {viewMode === 'admin' && (
            <span className='material-symbols-outlined text-primary fs-2'>edit_square</span>
          )}
        </div>
      </div>
      <p className='card-text text-justify'>
        {announcement.body}
      </p>
      {announcement.link && (
        <Link className='card-text' to={announcement.link}>{announcement.link}</Link>
      )}
    </div>
  </div>
)

export default AnnouncementCard
