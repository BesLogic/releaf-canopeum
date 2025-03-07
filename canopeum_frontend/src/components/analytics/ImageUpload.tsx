/* eslint-disable jsx-a11y/no-noninteractive-element-interactions -- custom input label */
import './ImageUpload.scss'

import type { ChangeEvent, DragEvent } from 'react'
import { useTranslation } from 'react-i18next'

import IconBadge from '@components/icons/IconBadge'

type Props = {
  readonly id: string,
  readonly imageUrl?: string,
  readonly onChange: (file: File) => void,
}

const supportedFileTypes = [
  'image/png',
  'image/jpeg',
]

const ImageUpload = ({ id, onChange, imageUrl }: Props) => {
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
    <div id={id}>
      <label
        className='w-100 d-flex flex-column justify-content-center align-items-center p-4 gap-3'
        htmlFor={`inner-${id}`}
        onDragOver={event => event.preventDefault()}
        onDrop={dropHandler}
        style={{
          border: 'var(--bs-border-width) dashed var(--bs-primary)',
          backgroundImage: `url(${imageUrl ?? ''})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <IconBadge>
          <span className='material-symbols-outlined text-light align-middle icon-sm'>
            arrow_upward
          </span>
        </IconBadge>
        <div className='btn btn-outline-primary upload-button'>{t('generic.upload')}</div>
        <div className='upload-instruction'>{t('analytics.image-upload')}</div>
      </label>
      <input
        accept={supportedFileTypes.join(',')}
        className='d-none'
        id={`inner-${id}`}
        onChange={event => handleFileChange(event)}
        type='file'
      />
    </div>
  )
}

export default ImageUpload
