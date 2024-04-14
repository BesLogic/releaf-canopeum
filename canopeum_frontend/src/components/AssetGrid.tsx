import type { Asset } from '@services/api'
import { getApiBaseUrl } from '@services/apiSettings'
// import { useEffect, useState } from 'react'
// import { useState } from 'react'

const AssetGrid = (props: { medias: Asset[], isEditable?: { removeFile: (index: number) => void }} ) => {
  // const [selectedAssetIndex, setSelectedAssetIndex] = useState(0)

  // const handleAssetClick = (index: number) => {
  //   setSelectedAssetIndex(index)
  // }

  const { medias, isEditable } = props

  return (
    <div>
      { medias.length === 1 && (
        <div className='row'>
          <div className='position-relative col-md-12'>
            <div className='w-100' style={{ overflow: 'hidden' }}>
              <img
                src={(!isEditable ? (!isEditable ? getApiBaseUrl() : '') : '') + medias[0].asset}
                alt={medias[0].alt}
                className='object-fit-cover w-100 h-100'
                // onClick={() => handleAssetClick(0)}
              />
            </div>
            {(isEditable && 
                <span 
                className='material-symbols-outlined fill-icon position-absolute top-0 end-0 cursor-pointer' 
                onClick={() => isEditable.removeFile(0)} 
                style={{ cursor: 'pointer' }}>
                  cancel
                  </span>
              )}
          </div>
        </div>
      )}

      { medias.length === 2 && (
        <div className='row'>
          {medias.map((media, index) => (
            <div className='position-relative col-md-6 p-1' key={index}>
              <div className='w-100' style={{ height: '200px', overflow: 'hidden' }}>
                <img
                  src={(!isEditable ? getApiBaseUrl() : '') + media.asset}
                  alt={media.alt}
                  className='object-fit-cover w-100 h-100'
                  // onClick={() => handleAssetClick(index)}
                />
              </div>
              {(isEditable && 
                <span 
                className='material-symbols-outlined fill-icon position-absolute top-0 end-0 cursor-pointer' 
                onClick={() => isEditable.removeFile(index)} 
                style={{ cursor: 'pointer' }}>
                  cancel
                  </span>
              )}
            </div>
          ))}
        </div>
      )}

      { medias.length === 3 && (
        <div className='row'>
          {medias.map((media, index) => (
            <div className="position-relative col-md-3 p-1" key={index}>
              <div className='w-100' style={{ height: '200px', overflow: 'hidden' }}>
                <img
                  src={(!isEditable ? getApiBaseUrl() : '') + media.asset}
                  alt={media.alt}
                  className='object-fit-cover w-100 h-100'
                  // onClick={() => handleAssetClick(index)}
                />
              </div>
              {(isEditable && 
                <span 
                className='material-symbols-outlined fill-icon position-absolute top-0 end-0 cursor-pointer' 
                onClick={() => isEditable.removeFile(index)} 
                style={{ cursor: 'pointer' }}>
                  cancel
                  </span>
              )}
            </div>
          ))}
        </div>
      )}

      { medias.length > 3 && (
        <div className='row'>
          {medias.map((media, index) => (
            <div className='position-relative col-md-3 p-1' key={index}>
              <div className='w-100' style={{ height: '200px', overflow: 'hidden' }}>
                <img
                  src={(!isEditable ? getApiBaseUrl() : '') + media.asset}
                  alt={media.alt}
                  className='object-fit-cover w-100 h-100'
                  // onClick={() => handleAssetClick(index)}
                />
              </div>
              {(isEditable && 
                <span 
                className='material-symbols-outlined fill-icon position-absolute top-0 end-0 cursor-pointer' 
                onClick={() => isEditable.removeFile(index)} 
                style={{ cursor: 'pointer' }}>
                  cancel
                  </span>
              )}
            </div>
          ))}
        </div>
      )}

      {
        /* <div className='modal' style={{ display: selectedAssetIndex !== null ? 'block' : 'none' }}>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-body'>
              <div id='carouselExampleControls' className='carousel slide' data-bs-ride='carousel'>
                <div className='carousel-inner'>
                  {props.medias.map((media, index) => (
                    <div className={`carousel-item ${index === selectedAssetIndex ? 'active' : ''}`} key={index}>
                      <img src={(!isEditable ? getApiBaseUrl() : '') + media.asset} alt={media.alt} className='d-block w-100' />
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
}

export default AssetGrid
