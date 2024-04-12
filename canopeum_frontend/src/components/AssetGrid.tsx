import type { Asset } from '@services/api'
import { getApiBaseUrl } from '@services/apiSettings'
// import { useState } from 'react'

const AssetGrid = (props: { medias: Asset[] }) => {
  // const [selectedAssetIndex, setSelectedAssetIndex] = useState(0)

  // const handleAssetClick = (index: number) => {
  //   setSelectedAssetIndex(index)
  // }

  return (
    <div>
      {props.medias.map((media, index) => (
        <div className='row' key={index}>
          <div className={`col-md-${getColSize(props.medias.length)}`}>
            <img
              src={getApiBaseUrl() + media.asset}
              alt={media.alt}
              className='img-fluid'
              // onClick={() => handleAssetClick(index)}
            />
          </div>
        </div>
      ))}

      {
        /* <div className='modal' style={{ display: selectedAssetIndex !== null ? 'block' : 'none' }}>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-body'>
              <div id='carouselExampleControls' className='carousel slide' data-bs-ride='carousel'>
                <div className='carousel-inner'>
                  {props.medias.map((media, index) => (
                    <div className={`carousel-item ${index === selectedAssetIndex ? 'active' : ''}`} key={index}>
                      <img src={getApiBaseUrl() + media.asset} alt={media.alt} className='d-block w-100' />
                    </div>
                  ))}
                </div>
                <button
                  className='carousel-control-prev'
                  type='button'
                  data-bs-target='#carouselExampleControls'
                  data-bs-slide='prev'
                >
                  <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                  <span className='visually-hidden'>Previous</span>
                </button>
                <button
                  className='carousel-control-next'
                  type='button'
                  data-bs-target='#carouselExampleControls'
                  data-bs-slide='next'
                >
                  <span className='carousel-control-next-icon' aria-hidden='true'></span>
                  <span className='visually-hidden'>Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */
      }
    </div>
  )

  function getColSize(length: number) {
    if (length === 1) {
      return '12' // Full width for 1 image
    } else if (length === 2) {
      return '6' // Half width for 2 images
    } else {
      return '4' // One-third width for more than 2 images
    }
  }
}

export default AssetGrid
