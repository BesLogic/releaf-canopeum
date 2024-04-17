import type { SiteSocial } from '../services/api'

const CreatePostWidget = (props: { readonly site: SiteSocial }) => {
  /* eslint-disable @typescript-eslint/no-unused-vars -- We'll use this eventually */
  // @ts-expect-error: We'll use this eventually
  const { site } = props
  /* eslint-enable @typescript-eslint/no-unused-vars -- We'll use this eventually */

  return (
    <div className='bg-white rounded-2 px-5 py-4 d-flex flex-column gap-2'>
      <div className='d-flex justify-content-between'>
        <h2>New Post</h2>
        <button className='btn btn-secondary' type='button'>
          Publish
        </button>
      </div>
      <div className='position-relative'>
        <div className='position-absolute top-0 left-0 m-3 d-flex gap-3 fs-3'>
          <span className='material-symbols-outlined'>add_a_photo</span>
        </div>
        <textarea className='form-control pt-5' id='exampleFormControlTextarea1' placeholder='Post a New Message...'>
        </textarea>
      </div>
    </div>
  )
}

export default CreatePostWidget
