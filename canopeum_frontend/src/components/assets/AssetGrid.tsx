import { useState } from 'react'

import AssetViewer from './AssetViewer'
import type { Asset } from '@services/api'

type Props = {
  readonly medias: Asset[],
  readonly isEditable?: { removeFile: (index: number) => void },
}

const AssetGrid = ({ medias, isEditable }: Props) => {
  const [viewModeActivated, setViewModeActivated] = useState<boolean>(false)
  const [mediaSelectedIndex, setMediaSelectedIndex] = useState<number>(0)

  const handleAssetClick = (index: number) => {
    setMediaSelectedIndex(index)
    setViewModeActivated(true)
  }

  const handleCloseClick = () => setViewModeActivated(false)

  return (
    <div>
      <div className='row m-0'>
        {medias.map((media, index) => (
          <button
            className='unstyled-button position-relative col-md-3 flex-grow-1 p-1 cursor-pointer '
            key={media.id}
            onClick={() => handleAssetClick(index)}
            type='button'
          >
            <div className='w-100' style={{ height: '200px', overflow: 'hidden' }}>
              <img
                alt='New site asset'
                className='object-fit-cover w-100 h-100'
                src={media.asset}
              />
            </div>
            {isEditable
              && (
                <button
                  className='unstyled-button'
                  onClick={() => isEditable.removeFile(index)}
                  type='button'
                >
                  <span className='
                      material-symbols-outlined
                      fill-icon
                      position-absolute
                      top-0
                      end-0
                    '>
                    cancel
                  </span>
                </button>
              )}
          </button>
        ))}
      </div>
      <div>
        {viewModeActivated && (
          <AssetViewer
            handleClose={handleCloseClick}
            mediaSelectedIndex={mediaSelectedIndex}
            medias={medias}
          />
        )}
      </div>
    </div>
  )
}

export default AssetGrid
