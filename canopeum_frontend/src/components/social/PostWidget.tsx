import { LanguageContext } from '@components/context/LanguageContext'
import PostCommentsDialog from '@components/social/PostCommentsDialog'
import { getApiBaseUrl } from '@services/apiSettings'
import { useContext, useState } from 'react'

import type { Post } from '../../services/api'

type Props = {
  readonly post: Post,
}

const PostWidget = ({ post }: Props) => {
  const { formatDate } = useContext(LanguageContext)
  const [commentsModalOpen, setCommentsModalOpen] = useState(false)

  const openPostComments = () => setCommentsModalOpen(true)

  const handleCommentsModalClose = () => setCommentsModalOpen(false)

  return (
    <>
      <div className='bg-white rounded-2 px-5 py-4 d-flex flex-column gap-3'>
        <div className='d-flex justify-content-start gap-2'>
          <img
            alt='site'
            className='rounded-circle'
            src={getApiBaseUrl() + post.site.image.asset}
            style={{ height: '48px', width: '48px' }}
          />
          <div className='d-flex flex-column'>
            <h6 className='text-uppercase fw-bold mb-1'>{post.site.name}</h6>
            {post.createdAt && (
              <span className='text-muted initialism'>
                {formatDate(post.createdAt, { dateStyle: 'short' })}
              </span>
            )}
          </div>
        </div>

        <div>{post.body}</div>

        <div className='d-flex justify-content-end gap-4'>
          <button className='d-flex gap-2 unstyled-button' type='button'>
            <span className='material-symbols-outlined'>eco</span>
            <div>{post.likeCount}</div>
          </button>

          <button
            className='d-flex gap-2 unstyled-button'
            onClick={openPostComments}
            type='button'
          >
            <span className='material-symbols-outlined'>sms</span>
            <div>{post.commentCount}</div>
          </button>

          <button className='d-flex gap-2 unstyled-button' type='button'>
            <span className='material-symbols-outlined'>share</span>
            <div>{post.shareCount}</div>
          </button>
        </div>
      </div>

      <PostCommentsDialog handleClose={handleCommentsModalClose} open={commentsModalOpen} postId={post.id} />
    </>
  )
}

export default PostWidget
