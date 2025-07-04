import { CircularProgress } from '@mui/material'
import { type ChangeEvent, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import AssetGrid from './assets/AssetGrid'
import { SnackbarContext } from '@components/context/SnackbarContext'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import { Asset, type FileParameter, type Post } from '@services/api'
import { assetFormatter } from '@utils/assetFormatter'
import textAreaAutoGrow from '@utils/textAreaAutoGrow'
import type { InputValidationError } from '@utils/validators'

const MAX_FILE_WIDTH = 1920
const MAX_FILE_HEIGHT = 1920
const MAX_FILE_DEPTH = 1920
const MAX_FILE_SIZE = MAX_FILE_WIDTH * MAX_FILE_HEIGHT * MAX_FILE_DEPTH
const MAXIMUM_CHARS_PER_POST = 3000

type Props = {
  readonly siteId: number,
  readonly addNewPost: (newPost: Post) => void,
}

const CreatePostWidget = ({ siteId, addNewPost }: Props) => {
  const { t: translate } = useTranslation()
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { getApiClient } = useApiClient()

  const [isSendingPost, setIsSendingPost] = useState(false)
  const [postBody, setPostBody] = useState<string>('')
  const [postBodyNumberOfChars, setPostBodyNumberOfChars] = useState(0)
  const [postBodyError, setPostBodyError] = useState<InputValidationError | undefined>()
  const [files, setFiles] = useState<FileParameter[]>([])

  const { displayUnhandledAPIError } = useErrorHandling()

  const postSitePost = async (body: string) => {
    setIsSendingPost(true)
    try {
      setIsSendingPost(true)

      const isPostBodyValid = validatePostBody(true)
      if (!isPostBodyValid) return

      const newPost = await getApiClient().postClient.create(siteId, body, files)
      setFiles([])
      addNewPost(newPost)
    } catch (newPostError) {
      displayUnhandledAPIError('errors.new-post-failed')(newPostError)
      setIsSendingPost(false)
    } finally {
      setIsSendingPost(false)
      setPostBody('')
    }
  }

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      openAlertSnackbar('File too large')

      return false
    }

    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'video/mp4') {
      openAlertSnackbar('File type not supported')

      return false
    }

    return true
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (!fileList) return

    const validCompressedFiles = await Promise.all(
      [...fileList]
        .filter(file => validateFile(file))
        .map(file => assetFormatter(file)),
    )

    setFiles(
      previousFiles => [
        ...previousFiles,
        ...validCompressedFiles.filter(file => file !== undefined),
      ],
    )
  }

  const removeFile = (index: number) =>
    setFiles(previous => previous.filter((_, index_) => index_ !== index))

  const handleCommentBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const bodyValue = event.target.value
    const numberOfChars = bodyValue.length

    if (numberOfChars > MAXIMUM_CHARS_PER_POST) return

    setPostBody(bodyValue)
    setPostBodyNumberOfChars(numberOfChars)
    textAreaAutoGrow(event.target)
  }

  const validatePostBody = (forceValidation = false) => {
    if (!forceValidation && !isSendingPost) return false

    if (!postBody) {
      setPostBodyError('required')

      return false
    }

    if (postBodyNumberOfChars > MAXIMUM_CHARS_PER_POST) {
      setPostBodyError('maximumChars')

      return false
    }

    setPostBodyError(undefined)

    return true
  }

  return (
    <div className='card'>
      <div className='card-body d-flex flex-column gap-2'>
        <div className='d-flex justify-content-between'>
          <h2>{translate('social.posts.new-post')}</h2>

          <button
            className='btn btn-secondary d-flex align-items-center justify-content-center'
            onClick={() => postSitePost(postBody)}
            type='button'
          >
            {isSendingPost
              ? <CircularProgress color='inherit' size={20} />
              : translate('social.posts.publish')}
          </button>
        </div>

        <div className='position-relative'>
          <div className='position-absolute top-0 left-0 m-3 d-flex gap-3 fs-3'>
            <label
              className='material-symbols-outlined'
              htmlFor='file-input'
              style={{ cursor: 'pointer' }}
            >
              add_a_photo
            </label>
            <input
              className='d-none'
              id='file-input'
              multiple
              onChange={event => handleFileChange(event)}
              type='file'
            />
          </div>
          <textarea
            className='form-control pt-5 overflow-hidden'
            onChange={event => handleCommentBodyChange(event)}
            placeholder={translate('social.posts.message-placeholder')}
            style={{ resize: 'none' }}
            value={postBody}
          />
          <div className='max-words end-0 text-end' style={{ bottom: '-1.6rem' }}>
            <span>{postBodyNumberOfChars}/{MAXIMUM_CHARS_PER_POST}</span>
            <span className='ms-1'>
              {translate('social.comments.character', { count: MAXIMUM_CHARS_PER_POST })}
            </span>
          </div>

          {postBodyError === 'required' && (
            <span className='help-block text-danger'>
              {translate('social.posts.post-body-required')}
            </span>
          )}

          {postBodyError === 'maximumChars' && (
            <span className='help-block text-danger'>
              {translate('social.posts.comment-body-max-chars', { count: MAXIMUM_CHARS_PER_POST })}
            </span>
          )}
        </div>
        {files.length > 0
          && (
            <AssetGrid
              isEditable={{ removeFile }}
              medias={files.map(
                /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                -- Find the best way to type file data */
                file => (new Asset({ id: 0, asset: URL.createObjectURL(file.data) })),
              )}
            />
          )}
      </div>
    </div>
  )
}

export default CreatePostWidget
