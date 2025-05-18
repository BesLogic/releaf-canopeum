import imageCompression, { type Options } from 'browser-image-compression'

import type { Asset, FileParameter } from '@services/api'
import { getApiBaseUrl } from '@services/apiSettings'

export const assetFormatter = async (file: File): Promise<FileParameter | undefined> => {
  const options: Options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  }

  if (file.type === 'application/octet-stream') return undefined

  const imageCompressed = await imageCompression(file, options)

  return { fileName: imageCompressed.name, data: imageCompressed }
}

export const fileFormatter = async (asset: Asset): Promise<File> => {
  const response = await fetch(`${getApiBaseUrl()}${asset.asset}`)
  const blob = await response.blob()
  const fileName = asset.asset.split('/').pop() ?? 'file'

  return new File([blob], fileName, { type: blob.type })
}
