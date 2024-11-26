import { useContext, useRef, useState } from 'react'
import { Dropdown, Popover } from 'rsuite'
import DropdownMenu from 'rsuite/esm/Dropdown/DropdownMenu'
import type { OverlayTriggerHandle } from 'rsuite/esm/internals/Picker'
import Whisper from 'rsuite/esm/Whisper'

import AssetGrid from '@components/assets/AssetGrid'
import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { LanguageContext } from '@components/context/LanguageContext'
import { SnackbarContext } from '@components/context/SnackbarContext'
import ConfirmationDialog from '@components/dialogs/ConfirmationDialog'
import TextExpansion from '@components/inputs/TextExpansion'
import PostCommentsDialog from '@components/social/PostCommentsDialog'
import SharePostDialog from '@components/social/SharePostDialog'
import useApiClient from '@hooks/ApiClientHook'
import type { PageViewMode } from '@models/PageViewMode.type'
import type { Post } from '@services/api'
import usePostsStore from '@store/postsStore'

type Props = {
  readonly post: Post,
  readonly deletePost?: (postId: number) => void,
}

const PostCard = ({ post, deletePost }: Props) => {
  const { formatDate } = useContext(LanguageContext)
  const { toggleLike } = usePostsStore()
  const { getApiClient } = useApiClient()
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { currentUser } = useContext(AuthenticationContext)

  const [commentsModalOpen, setCommentsModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [confirmPostDeleteOpen, setConfirmPostDeleteOpen] = useState(false)
  const whisperRef = useRef<OverlayTriggerHandle>(null)

  const viewMode: PageViewMode = currentUser
    ? ((currentUser.role === 'MegaAdmin' || currentUser.adminSiteIds.includes(post.site.id))
      ? 'admin'
      : 'user')
    : 'visitor'

  const openPostComments = () => setCommentsModalOpen(true)

  const handleCommentsModalClose = () => setCommentsModalOpen(false)

  const openPostShareModal = () => setShareModalOpen(true)

  const handleShareModalClose = () => setShareModalOpen(false)

  const onDeletePostConfirmation = async (proceed: boolean) => {
    if (proceed) {
      await getApiClient().postClient.delete(post.id)
      deletePost?.(post.id)
      openAlertSnackbar('Post deleted successfully', { severity: 'success' })
    }
    setConfirmPostDeleteOpen(false)
  }

  const likePost = async () => {
    if (post.hasLiked) {
      await getApiClient().likeClient.delete(post.id)
      toggleLike(post.id)
    } else {
      await getApiClient().likeClient.likePost(post.id, {})
      toggleLike(post.id)
    }
  }

  const actionsPopover = (
    <Popover
      style={{ width: 'fit-content' }}
    >
      <DropdownMenu>
        <Dropdown.Item onClick={() => setConfirmPostDeleteOpen(true)}>
          <div className='d-flex gap-2'>
            <span className='material-symbols-outlined text-danger'>delete</span>
          </div>
        </Dropdown.Item>
      </DropdownMenu>
    </Popover>
  )

  return (
    <div className='card'>
      <div className='card-body d-flex flex-column gap-3'>
        <div className='d-flex justify-content-start align-items-center gap-2'>
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
          {viewMode === 'admin' && (
            <>
              <Whisper
                placement='bottomEnd'
                ref={whisperRef}
                speaker={actionsPopover}
                trigger='click'
              >
                <div className='d-flex flex-grow-1 justify-content-end'>
                  <button className='unstyled-button' type='button'>
                    <span className='material-symbols-outlined text-primary'>more_vert</span>
                  </button>
                </div>
              </Whisper>
              <ConfirmationDialog
                actions={['cancel', 'delete']}
                onClose={(proceed: boolean) => onDeletePostConfirmation(proceed)}
                open={!!confirmPostDeleteOpen}
                title='Are you sure you want to delete this post?'
              >
                <PostCard post={post} />
              </ConfirmationDialog>
            </>
          )}
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
    </div>
  )
}

export default PostCard
