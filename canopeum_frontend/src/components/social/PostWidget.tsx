import AssetGrid from '@components/assets/AssetGrid'
import { LanguageContext } from '@components/context/LanguageContext'
import TextExpansion from '@components/inputs/TextExpansion'
import PostCommentsDialog from '@components/social/PostCommentsDialog'
import SharePostDialog from '@components/social/SharePostDialog'
import getApiClient from '@services/apiInterface'
import { useContext, useState } from 'react'

import type { Post } from '../../services/api'
import usePostsStore from '../../store/postsStore'

type Props = {
  readonly post: Post,
}

const PostWidget = ({ post }: Props) => {
  const { formatDate } = useContext(LanguageContext)
  const { toggleLike } = usePostsStore()

  const [commentsModalOpen, setCommentsModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  const openPostComments = () => setCommentsModalOpen(true)

  const handleCommentsModalClose = () => setCommentsModalOpen(false)

  const openPostShareModal = () => setShareModalOpen(true)

  const handleShareModalClose = () => setShareModalOpen(false)

  const likePost = async () => {
    if (post.hasLiked) {
      await getApiClient().likeClient.delete(post.id)
      toggleLike(post.id)
    } else {
      await getApiClient().likeClient.likePost(post.id, {})
      toggleLike(post.id)
    }
  }

  return (
    <>
      <div className='bg-white rounded-2 px-5 py-4 d-flex flex-column gap-3'>
        <div className='d-flex justify-content-start gap-2'>
          <img
            alt='site'
            className='rounded-circle'
            src={post.site.image.asset}
            style={{ height: '48px', width: '48px' }}
          />
          <div className='d-flex flex-column'>
            <h6 className='text-uppercase fw-bold mb-1'>{post.site.name}</h6>
            <span className='text-muted initialism'>
              {formatDate(post.createdAt, { dateStyle: 'short' })}
            </span>
          </div>
        </div>

        <TextExpansion maxLength={700} text={post.body} />

        {post.media.length > 0 && <AssetGrid medias={post.media} />}

        <div className='d-flex justify-content-end gap-4'>
          <div className='d-flex gap-2'>
            <button className='unstyled-button' onClick={likePost} type='button'>
              <span
                className={`material-symbols-outlined text-primary ${
                  post.hasLiked
                    ? 'fill-icon'
                    : ''
                }`}
              >
                eco
              </span>
            </button>

            <div>{post.likeCount}</div>
          </div>

          <button
            className='d-flex gap-2 unstyled-button'
            onClick={openPostComments}
            type='button'
          >
            <span className='material-symbols-outlined text-primary'>sms</span>
            <div>{post.commentCount}</div>
          </button>

          <button
            className='d-flex gap-2 unstyled-button'
            onClick={openPostShareModal}
            type='button'
          >
            <span className='material-symbols-outlined text-primary'>share</span>
            <div>{post.shareCount}</div>
          </button>
        </div>
      </div>

      <PostCommentsDialog
        handleClose={handleCommentsModalClose}
        open={commentsModalOpen}
        postId={post.id}
        siteId={post.site.id}
      />

      <SharePostDialog
        onClose={handleShareModalClose}
        open={shareModalOpen}
        post={post}
      />
    </>
  )
}

export default PostWidget
