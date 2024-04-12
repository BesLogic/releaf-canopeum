import { type ChangeEvent, useState } from 'react'
import type { FileParameter, Post, SiteSocial } from '../services/api'
import { ensureError } from '@services/errors'
import getApiClient from '@services/apiInterface'

const CreatePostWidget = (props: { readonly site: SiteSocial, addNewPost: (newPost: Post) => void }) => {
  const { site, addNewPost } = props

  const [isSendingPost, setIsSendingPost] = useState(false)
  const [errorSendingPost, setErrorSendingPost] = useState<Error | undefined>(undefined)
  const [postBody, setPostBody] = useState<string>('')
  const [files, setFiles] = useState<FileParameter[]>([])

  const postSitePost = async (site: SiteSocial, body: string, files: FileParameter[]) => {
    setIsSendingPost(true)
    try {
      setIsSendingPost(true)
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

  const formatedFiles = (e: ChangeEvent<HTMLInputElement>) => {
    Array.prototype.slice.call(e.target.files).forEach((file: File) => {
      setFiles(prevFiles => [...prevFiles, { fileName: file.name, data: file }])
    })
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
          <input className='d-none' id='file-input' type='file' onChange={e => formatedFiles(e)} multiple={true} />
        </div>
        <textarea
          className='form-control pt-5'
          id='exampleFormControlTextarea1'
          placeholder='Post a New Message...'
          value={postBody}
          onChange={e => setPostBody(e.target.value)}
        >
        </textarea>
      </div>
    </div>
  )
}

export default CreatePostWidget
