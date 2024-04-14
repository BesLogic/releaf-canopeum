import { type ChangeEvent, useState, useContext } from 'react'
import { Asset, type FileParameter, type Post, type SiteSocial } from '../services/api'
import { ensureError } from '@services/errors'
import getApiClient from '@services/apiInterface'
import textAreaAutoGrow from '../utils/textAreaAutoGrow'
import { useTranslation } from 'react-i18next'
import { SnackbarContext} from '@components/context/SnackbarContext'

import { numberOfWordsInText } from '../utils/stringUtils'
import type { InputValidationError } from '../utils/validators'
import AssetGrid from './AssetGrid'
import { assetFormatter } from '../utils/assetFormatter'

const CreatePostWidget = (props: { readonly site: SiteSocial, addNewPost: (newPost: Post) => void }) => {
  const { site, addNewPost } = props
  const { t: translate } = useTranslation()
  const { openAlertSnackbar } = useContext(SnackbarContext)

  const [isSendingPost, setIsSendingPost] = useState(false)
  const [errorSendingPost, setErrorSendingPost] = useState<Error | undefined>(undefined)
  const [postBody, setPostBody] = useState<string>('')
  const [postBodyNumberOfWords, setPostBodyNumberOfWords] = useState(0)
  const [postBodyError, setPostBodyError] = useState<InputValidationError | undefined>()
  const [files, setFiles] = useState<FileParameter[]>([])

  const MAXIMUM_WORDS_PER_POST = 3000

  const postSitePost = async (site: SiteSocial, body: string, files: FileParameter[]) => {
    setIsSendingPost(true)
    try {
      setIsSendingPost(true)

      const isPostBodyValid = validatePostBody(true)
      if (!isPostBodyValid) return

      const newPost = await getApiClient().postClient.create(1, body, files)
      setFiles([])
      addNewPost(newPost)
    } catch (error_: unknown) {
      setErrorSendingPost(ensureError(error_))
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
      setFiles( prevFiles => [...prevFiles, compressedFile])
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
    setFiles(files.filter((_, i) => i !== index))
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

        <button className='btn btn-secondary' type='button' onClick={() => postSitePost(site, postBody, files)}>
          {isSendingPost
            ? <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>
            : 'Publish'}
        </button>
      </div>
      <div className='position-relative'>
        <div className='position-absolute top-0 left-0 m-3 d-flex gap-3 fs-3'>
          <label className='material-symbols-outlined' htmlFor='file-input' style={{ cursor: 'pointer' }}>
            add_a_photo
          </label>
          <input className='d-none' id='file-input' type='file' onChange={e => handleFileChange(e)} multiple={true} />
        </div>
        <textarea
          className='form-control pt-5 overflow-hidden'
          style={{ resize: 'none' }}
          placeholder='Post a New Message...'
          value={postBody}
          onChange={e => {
            handleCommentBodyChange(e)
          }}
        >
        </textarea>
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
      { files && 
        <AssetGrid 
          medias={files.map(file => (new Asset ({ asset: URL.createObjectURL(file.data), init: {}, toJSON: () => ({}) })))} 
          isEditable={{ removeFile }} /> 
      }
    </div>
  )
}

export default CreatePostWidget
