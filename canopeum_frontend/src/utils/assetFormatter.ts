import imageCompression, { type Options } from 'browser-image-compression'

import type { FileParameter } from '@services/api'

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
