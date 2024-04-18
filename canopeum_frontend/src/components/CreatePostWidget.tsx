import { SnackbarContext } from '@components/context/SnackbarContext'
import getApiClient from '@services/apiInterface'
import { type ChangeEvent, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Asset, type FileParameter, type Post } from '../services/api'
import { assetFormatter } from '../utils/assetFormatter'
import { numberOfWordsInText } from '../utils/stringUtils'
import textAreaAutoGrow from '../utils/textAreaAutoGrow'
import type { InputValidationError } from '../utils/validators'
import AssetGrid from './AssetGrid'

const CreatePostWidget = (props: { readonly addNewPost: (newPost: Post) => void }) => {
  const { addNewPost } = props
  const { t: translate } = useTranslation()
  const { openAlertSnackbar } = useContext(SnackbarContext)

  const [isSendingPost, setIsSendingPost] = useState(false)
  const [postBody, setPostBody] = useState<string>('')
  const [postBodyNumberOfWords, setPostBodyNumberOfWords] = useState(0)
  const [postBodyError, setPostBodyError] = useState<InputValidationError | undefined>()
  const [files, setFiles] = useState<FileParameter[]>([])

  const MAXIMUM_WORDS_PER_POST = 3000

  const postSitePost = async (body: string, files: FileParameter[]) => {
    setIsSendingPost(true)
    try {
      setIsSendingPost(true)

      const isPostBodyValid = validatePostBody(true)
      if (!isPostBodyValid) return

      const newPost = await getApiClient().postClient.create(1, body, files)
      setFiles([])
      addNewPost(newPost)
    } catch {
      setIsSendingPost(false)
    } finally {
      setIsSendingPost(false)
      setPostBody('')
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    Array.prototype.slice.call(e.target.files).forEach(async (file: File) => {
      if (!validateFile(file)) return
      const compressedFile = await assetFormatter(file)
      setFiles(previousFiles => [...previousFiles, compressedFile])
    })
  }

  const validateFile = (file: File) => {
    console.log(file.size, file.type)
    if (file.size > 1920 * 1920 * 10) {
      openAlertSnackbar('File too large')
      
return false
    }

    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'video/mp4') {
      openAlertSnackbar('File type not supported')
      
return false
    }

    return true
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, index_) => index_ !== index))
  }

  const handleCommentBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const bodyValue = event.target.value
    const numberOfWords = numberOfWordsInText(bodyValue)

    if (numberOfWords > MAXIMUM_WORDS_PER_POST) return

    setPostBody(bodyValue)
    setPostBodyNumberOfWords(numberOfWords)
    textAreaAutoGrow(event.target)
  }

  const validatePostBody = (forceValidation = false) => {
    if (!forceValidation && !isSendingPost) return false

    if (!postBody) {
      setPostBodyError('required')

      return false
    }

    if (postBodyNumberOfWords > MAXIMUM_WORDS_PER_POST) {
      setPostBodyError('maximumChars')

      return false
    }

    setPostBodyError(undefined)

    return true
  }

  return (
    <div className='bg-white rounded-2 px-5 py-4 d-flex flex-column gap-2'>
      <div className='d-flex justify-content-between'>
        <h2>New Post</h2>

        <button className='btn btn-secondary' onClick={() => postSitePost(postBody, files)} type='button'>
          {isSendingPost
            ? <span aria-hidden='true' className='spinner-border spinner-border-sm' role='status' />
            : 'Publish'}
        </button>
      </div>
      <div className='position-relative'>
        <div className='position-absolute top-0 left-0 m-3 d-flex gap-3 fs-3'>
          <label className='material-symbols-outlined' htmlFor='file-input' style={{ cursor: 'pointer' }}>
            add_a_photo
          </label>
          <input className='d-none' id='file-input' multiple onChange={e => handleFileChange(e)} type='file' />
        </div>
        <textarea
          className='form-control pt-5 overflow-hidden'
          onChange={e => {
            handleCommentBodyChange(e)
          }}
          placeholder='Post a New Message...'
          style={{ resize: 'none' }}
          value={postBody}
         />
        <div className='max-words end-0 text-end' style={{ bottom: '-1.6rem' }}>
          <span>{postBodyNumberOfWords}/{MAXIMUM_WORDS_PER_POST}</span>
          <span className='ms-1'>{translate('social.comments.words', { count: MAXIMUM_WORDS_PER_POST })}</span>
        </div>

        {postBodyError === 'required' && (
          <span className='help-block text-danger'>
            {translate('social.posts.post-body-required')}
          </span>
        )}

        {postBodyError === 'maximumChars' && (
          <span className='help-block text-danger'>
            {translate('social.posts.comment-body-max-chars', { count: MAXIMUM_WORDS_PER_POST })}
          </span>
        )}
      </div>
      {files.length > 0 &&
        (
          <AssetGrid
            isEditable={{ removeFile }}
            medias={files.map(
              file => (new Asset({ asset: URL.createObjectURL(file.data), init: {}, toJSON: () => ({}) })),
            )}
          />
        )}
    </div>
  )
}

export default CreatePostWidget
