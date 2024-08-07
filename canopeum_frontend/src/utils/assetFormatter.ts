import imageCompression, { type Options } from 'browser-image-compression'

import type { FileParameter } from '@services/api'

export const assetFormatter = async (file: File): Promise<FileParameter> => {
  const options: Options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  }

  const imageCompressed = await imageCompression(file, options)

  return { fileName: imageCompressed.name, data: imageCompressed }
}
