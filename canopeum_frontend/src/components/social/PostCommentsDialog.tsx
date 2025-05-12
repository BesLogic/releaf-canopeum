import { Dialog, DialogContent } from '@mui/material'
import { type ChangeEvent, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { SnackbarContext } from '@components/context/SnackbarContext'
import ConfirmationDialog from '@components/dialogs/ConfirmationDialog'
import PostComment from '@components/social/PostComment'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import { type Comment, CreateComment } from '@services/api'
import usePostsStore from '@store/postsStore'
import type { InputValidationError } from '@utils/validators'

type Props = {
  readonly postId: number,
  readonly siteId: number,
  readonly open: boolean,
  readonly handleClose: () => void,
}

const MAXIMUM_CHARS_PER_COMMENT = 500

const PostCommentsDialog = ({ open, postId, siteId, handleClose }: Props) => {
  const { t: translate } = useTranslation()
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { currentUser } = useContext(AuthenticationContext)
  const { commentChange } = usePostsStore()
  const { getApiClient } = useApiClient()
  const { displayUnhandledAPIError } = useErrorHandling()

  const [comments, setComments] = useState<Comment[]>([])
  const [commentsLoaded, setCommentsLoaded] = useState(false)

  const [commentBody, setCommentBody] = useState('')
  const [commentBodyNumberOfChars, setCommentBodyNumberOfChars] = useState(0)
  const [commentBodyError, setCommentBodyError] = useState<InputValidationError | undefined>()
  const [sendButtonClicked, setSendButtonClicked] = useState(false)
  const [confirmCommentDeleteOpen, setConfirmCommentDeleteOpen] = useState<Comment | undefined>()
  const [confirmCommentText, setConfirmCommentText] = useState('')

  useEffect(() => {
    // Since this is a dialog, we only want to fetch the comments once it is opened
    if (!open || commentsLoaded) {
      setCommentBody('')
      setCommentBodyNumberOfChars(0)
      setCommentBodyError(undefined)
      return
    }

    const fetchComments = async () => setComments(await getApiClient().commentClient.all(postId))

    fetchComments()
      .then(() => setCommentsLoaded(true))
      .catch((error: unknown) => {
        displayUnhandledAPIError('errors.fetch-comments-failed')(error)
        setCommentsLoaded(false)
      })
  }, [postId, open, commentsLoaded, getApiClient])

  useEffect(() => {
    if (!confirmCommentDeleteOpen) {
      setConfirmCommentText('')

      return
    }

    const text = currentUser && confirmCommentDeleteOpen.authorId === currentUser.id
      ? translate('social.comments.comment-deletion-confirm-self')
      : translate(
        'social.comments.comment-deletion-confirm-other',
        { author: confirmCommentDeleteOpen.authorUsername },
      )
    setConfirmCommentText(text)
  }, [confirmCommentDeleteOpen, currentUser, translate])

  const handleCommentBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const bodyValue = event.target.value
    const numberOfWords = bodyValue.length

    if (numberOfWords > MAXIMUM_CHARS_PER_COMMENT) return

    setCommentBody(bodyValue)
    setCommentBodyNumberOfChars(numberOfWords)
  }

  const validateCommentBody = (forceValidation = false) => {
    // Do not display validations unless the Send button has been clicked
    if (!forceValidation && !sendButtonClicked) return false

    if (!commentBody) {
      setCommentBodyError('required')

      return false
    }

    if (commentBodyNumberOfChars > MAXIMUM_CHARS_PER_COMMENT) {
      setCommentBodyError('maximumChars')

      return false
    }

    setCommentBodyError(undefined)

    return true
  }

  const postComment = async () => {
    setSendButtonClicked(true)
    const isCommentBodyValid = validateCommentBody(true)
    if (!isCommentBodyValid) return

    // Create comment, trim value
    const createComment = new CreateComment({ body: commentBody })
    const newComment = await getApiClient().commentClient.create(postId, createComment)

    setComments(previous => [newComment, ...previous])
    setCommentBody('')
    setCommentBodyNumberOfChars(0)
    commentChange(postId, 'added')
  }

  const deleteComment = async (commentToDelete: Comment) => {
    try {
      await getApiClient().commentClient.delete(commentToDelete.id, postId)
      setComments(previous => previous.filter(comment => comment.id !== commentToDelete.id))
      commentChange(postId, 'removed')
    } catch {
      openAlertSnackbar(translate('social.comments.comment-deletion-error'), { severity: 'error' })
    }
  }

  const handleDeleteCommentClick = (commentToDelete: Comment) =>
    setConfirmCommentDeleteOpen(commentToDelete)

  const handleConfirmDeleteAction = (proceedWithDelete: boolean) => {
    const commentToDelete = confirmCommentDeleteOpen
    setConfirmCommentDeleteOpen(undefined)

    if (!proceedWithDelete || !commentToDelete) return

    deleteComment(commentToDelete).catch(displayUnhandledAPIError('errors.delete-comment-failed'))
  }

  return (
    <>
      <Dialog fullWidth maxWidth='sm' onClose={handleClose} open={open}>
        <DialogContent>
          {currentUser && (
            <div className='mb-5'>
              <div className='d-flex justify-content-between align-items-center pb-1'>
                <label className='form-label mb-0 flex-grow-1' htmlFor='new-comment-body-input'>
                  <h3 className='mb-0'>{translate('social.comments.leave-a-comment')}</h3>
                </label>

                <button className='btn btn-primary' onClick={postComment} type='button'>
                  {translate('social.comments.send')}
                </button>
              </div>

              <div>
                <div className='position-relative'>
                  <textarea
                    className={`form-control ${
                      commentBodyError
                        ? 'is-invalid'
                        : ''
                    }`}
                    id='new-comment-body-input'
                    onBlur={() => validateCommentBody()}
                    onChange={handleCommentBodyChange}
                    rows={5}
                    value={commentBody}
                  />
                  <div
                    className='max-words position-absolute end-0 pe-2'
                    style={{ bottom: '-1.6rem' }}
                  >
                    <span>{commentBodyNumberOfChars}/{MAXIMUM_CHARS_PER_COMMENT}</span>
                    <span className='ms-1'>
                      {translate('social.comments.character', { count: MAXIMUM_CHARS_PER_COMMENT })}
                    </span>
                  </div>
                </div>

                {commentBodyError === 'required' && (
                  <span className='help-block text-danger'>
                    {translate('social.comments.comment-body-required')}
                  </span>
                )}

                {commentBodyError === 'maximumChars' && (
                  <span className='help-block text-danger'>
                    {translate('social.comments.comment-body-max-chars', {
                      count: MAXIMUM_CHARS_PER_COMMENT,
                    })}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className='d-flex align-items-center gap-1 fw-bold fs-5'>
            <span className='material-symbols-outlined'>sms</span>
            <span>{translate('social.comments.comments')} ({comments.length})</span>
          </div>

          <TransitionGroup className='mt-2 d-flex flex-column gap-3'>
            {comments.map(comment => (
              <CSSTransition
                classNames='item-fadeinout'
                key={comment.id}
                timeout={400}
              >
                <PostComment
                  comment={comment}
                  onDelete={handleDeleteCommentClick}
                  siteId={siteId}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        actions={['cancel', 'delete']}
        onClose={handleConfirmDeleteAction}
        open={!!confirmCommentDeleteOpen}
        title={translate('social.comments.comment-deletion-confirm-title')}
      >
        {confirmCommentText}
      </ConfirmationDialog>
    </>
  )
}

export default PostCommentsDialog
