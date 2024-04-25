import './AssetViewer.scss'

import type { Asset } from '@services/api'

type AssetViewerProps = {
  readonly medias: Asset[],
  readonly handleClose: () => void,
  readonly mediaSelectedIndex: number,
}

const AssetViewer = ({ medias, handleClose, mediaSelectedIndex }: AssetViewerProps) => (
  <div
    className='carousel carousel-fade asset-viewer-container'
    id='carouselFade'
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
          className={`carousel-item ${
            index === mediaSelectedIndex
              ? 'active'
              : ''
          }`}
          key={media.id}
        >
          <img alt={index.toString()} className='d-block mw-100 mh-100' src={media.asset} />
        </div>
      ))}
    </div>
    {medias.length > 1 &&
      (
        <button
          className='carousel-control-prev'
          data-bs-slide='prev'
          data-bs-target='#carouselFade'
          type='button'
        >
          <span aria-hidden='true' className='carousel-control-prev-icon' />
          <span className='visually-hidden'>Previous</span>
        </button>
      )}
    {medias.length > 1 &&
      (
        <button
          className='carousel-control-next'
          data-bs-slide='next'
          data-bs-target='#carouselFade'
          type='button'
        >
          <span aria-hidden='true' className='carousel-control-next-icon' />
          <span className='visually-hidden'>Next</span>
        </button>
      )}
  </div>
)

export default AssetViewer
