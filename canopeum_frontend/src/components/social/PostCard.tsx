import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import PopupState from 'material-ui-popup-state'
import { bindMenu, bindTrigger } from 'material-ui-popup-state/hooks'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import AssetGrid from '@components/assets/AssetGrid'
import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { LanguageContext } from '@components/context/LanguageContext'
import { SnackbarContext } from '@components/context/SnackbarContext'
import ConfirmationDialog from '@components/dialogs/ConfirmationDialog'
import TextExpansion from '@components/inputs/TextExpansion'
import PostCommentsDialog from '@components/social/PostCommentsDialog'
import SharePostDialog from '@components/social/SharePostDialog'
import { appRoutes } from '@constants/routes.constant'
import useApiClient from '@hooks/ApiClientHook'
import type { PageViewMode } from '@models/PageViewMode.type'
import type { Post } from '@services/api'
import usePostsStore from '@store/postsStore'

type Props = {
  readonly post: Post,
  readonly showActions?: boolean,
}

const PostCard = ({ post, showActions }: Props) => {
  const { t } = useTranslation()
  const { formatDate } = useContext(LanguageContext)
  const { toggleLike, deletePost } = usePostsStore()
  const { getApiClient } = useApiClient()
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { currentUser } = useContext(AuthenticationContext)

  const [commentsModalOpen, setCommentsModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [confirmPostDeleteOpen, setConfirmPostDeleteOpen] = useState(false)

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
      deletePost(post.id)
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

  return (
    <div className='card'>
      <div className='card-body d-flex flex-column gap-3'>
        <div className='d-flex justify-content-start align-items-center gap-2'>
          <Link to={appRoutes.siteSocial(post.site.id)}>
            <img
              alt='site'
              className='rounded-circle object-fit-cover'
              src={post.site.image.asset}
              style={{ height: '3em', width: '3em' }}
            />
          </Link>
          <div className='d-flex flex-column'>
            <h6 className='fw-bold mb-1'>
              <Link to={appRoutes.siteSocial(post.site.id)}>{post.site.name}</Link>
            </h6>
            <Link className='text-muted initialism' to={appRoutes.postDetail(post.id)}>
              {formatDate(post.createdAt, { dateStyle: 'short' })}
            </Link>
          </div>
          {showActions && viewMode === 'admin' && (
            <>
              <PopupState popupId={`post-card-actions-${post.id}`} variant='popover'>
                {popupState => (
                  <div className='d-flex flex-grow-1 justify-content-end'>
                    {/* eslint-disable react/jsx-props-no-spreading -- Needed for MUI trigger */}
                    <button className='unstyled-button' type='button' {...bindTrigger(popupState)}>
                      {/* eslint-enable react/jsx-props-no-spreading */}
                      <span className='material-symbols-outlined text-primary'>more_vert</span>
                    </button>
                    <Menu
                      {...bindMenu(popupState)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <MenuItem disabled>
                        <span className='material-symbols-outlined align-middle'>edit_square</span>
                        {' '}
                        {t('generic.edit')} (Not yet implemented)
                      </MenuItem>
                      <MenuItem className='' onClick={() => setConfirmPostDeleteOpen(true)}>
                        <span className='material-symbols-outlined align-middle text-danger'>
                          delete
                        </span>
                        <span className='text-danger'>{' '}{t('generic.delete')}</span>
                      </MenuItem>
                    </Menu>
                  </div>
                )}
              </PopupState>

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
