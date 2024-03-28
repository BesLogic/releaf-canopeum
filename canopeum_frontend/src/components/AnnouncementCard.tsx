import { Link } from 'react-router-dom'
import type { Announcement } from '../services/api'

const AnnouncementCard = ({ announcement }: { readonly announcement: Announcement }) => (
  <div className='card rounded px-3 py-2'>
    <div className='card-body'>
      <div className='d-flex justify-content-between align-items-center'>
        <h2 className='card-title'>Announcement</h2>
        <span className='material-symbols-outlined'>edit_square</span>
      </div>
      <p className='card-text text-justify'>
        {announcement.body}
      </p>
      {announcement.link && <Link className='card-text' to={announcement.link}>{announcement.link}</Link>}
    </div>
  </div>
)

export default AnnouncementCard
