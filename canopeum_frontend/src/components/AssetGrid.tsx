import type { Asset } from '@services/api'

type Props = {
  readonly medias: Asset[],
  readonly isEditable?: { removeFile: (index: number) => void },
}

const AssetGrid = ({ medias, isEditable }: Props) => (
  <div>
    <div className='row'>
      {medias.map((media, index) => (
        <div className='position-relative col-md-3 flex-grow-1 p-1' key={media.id}>
          <div className='w-100' style={{ height: '200px', overflow: 'hidden' }}>
            <img
              alt='New site asset'
              className='object-fit-cover w-100 h-100'
              src={media.asset}
            />
          </div>
          {isEditable &&
            (
              <button
                className='unstyled-button'
                onClick={() => isEditable.removeFile(index)}
                type='button'
              >
                <span
                  className='material-symbols-outlined fill-icon position-absolute top-0 end-0 cursor-pointer'
                  style={{ cursor: 'pointer' }}
                >
                  cancel
                </span>
              </button>
            )}
        </div>
      ))}
    </div>
  </div>
)

export default AssetGrid
