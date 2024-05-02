/* eslint-disable jsx-a11y/no-noninteractive-element-interactions -- is required for the custom input label */
import UploadIcon from '@assets/icons/upload.svg'
import type { ChangeEvent, DragEvent } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  readonly siteImageURL?: string,
  readonly onChange: (file: File) => void,
}

const supportedFileTypes = [
  'image/png',
  'image/jpeg',
]

const SiteImageUpload = ({onChange, siteImageURL}: Props) => {
  const { t } = useTranslation()

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { files } = event.target
    const file = files?.item(0)
    if (!file || !supportedFileTypes.includes(file.type)) return
    onChange(file)
  }

  const dropHandler = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()

    const file = event.dataTransfer.files.item(0)
    if (!file) return
    onChange(file)
  }

  return (
    <div id='site-image'>
      <label
        className='w-100 d-flex flex-column justify-content-center align-items-center p-4 gap-3'
        htmlFor='inner-site-image'
        onDragOver={event => event.preventDefault()}
        onDrop={dropHandler}
        style={{
          border: 'var(--bs-border-width) dashed var(--bs-primary)',
          backgroundImage: `url(${siteImageURL})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      >
        <img alt='' src={UploadIcon} />
        <div className='btn btn-outline-primary'>Upload</div>
        <div>{t('analytics.site-modal.site-image-upload')}</div>
      </label>
      <input
        accept={supportedFileTypes.join(',')}
        className='d-none'
        id='inner-site-image'
        onChange={event => handleFileChange(event)}
        type='file'
      />
    </div>
  )
}

export default SiteImageUpload
