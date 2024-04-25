import type { Asset } from '@services/api'
import './AssetViewer.scss'

interface AssetViewerProps {
  medias: Asset[]
  handleClose: () => void
  mediaSelectedIndex: number
}

const AssetViewer = ({ medias, handleClose, mediaSelectedIndex }: AssetViewerProps) => {
  return (
    <div
      id='carouselFade'
      className='carousel carousel-fade asset-viewer-container'
    >
      <div className='carousel-inner'>
        <button
          className='close-button'
          onClick={handleClose}
          type='button'
        >
          <span className='material-symbols-outlined'>close</span>
        </button>
        {medias.map((media, index) => (
          <div
            className={`carousel-item ${index === mediaSelectedIndex ? 'active' : ''}`}
            key={media.id}
          >
            <img className='d-block mw-100 mh-100' src={media.asset} />
          </div>
        ))}
      </div>
      {medias.length > 1 &&
        (
          <button
            className='carousel-control-prev'
            type='button'
            data-bs-target='#carouselFade'
            data-bs-slide='prev'
          >
            <span className='carousel-control-prev-icon' aria-hidden='true'></span>
            <span className='visually-hidden'>Previous</span>
          </button>
        )}
      {medias.length > 1 &&
        (
          <button
            className='carousel-control-next'
            type='button'
            data-bs-target='#carouselFade'
            data-bs-slide='next'
          >
            <span className='carousel-control-next-icon' aria-hidden='true'></span>
            <span className='visually-hidden'>Next</span>
          </button>
        )}
    </div>
  )
}

export default AssetViewer
