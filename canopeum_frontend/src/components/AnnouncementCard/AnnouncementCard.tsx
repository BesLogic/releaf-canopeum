import './AnnouncementCard.scss';
// import '../../services/api.ts'
// import '../../../canopeum-mockoon.json'

const AnnouncementCard = ({ siteId }) => (
    <div className='card rounded px-3 py-2 col-3'>
      <div className='card-body'>
        <div className='d-flex justify-content-between align-items-center'>
          <h2 className='card-title'>Announcement</h2>
          <span className='material-symbols-outlined'>edit_square</span>
        </div>
          <p className='card-text'>
            Some quick example text to build on the card title and make up the bulk of the card&apos;s content.
          </p>
          <a href='{siteId.link}'>Go somewhere</a>
      </div>
    </div>
  )

export default AnnouncementCard;
