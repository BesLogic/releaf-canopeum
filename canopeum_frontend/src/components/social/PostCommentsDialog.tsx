import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { SnackbarContext } from '@components/context/SnackbarContext'
import ConfirmationDialog from '@components/dialogs/ConfirmationDialog'
import PostComment from '@components/social/PostComment'
import type { PageViewMode } from '@models/types/PageViewMode'
import { Dialog, DialogContent } from '@mui/material'
import { type Comment, CreateComment } from '@services/api'
import getApiClient from '@services/apiInterface'
import { type ChangeEvent, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { numberOfWordsInText } from '../../utils/stringUtils'
import type { InputValidationError } from '../../utils/validators'

type Props = {
  readonly postId: number,
  readonly open: boolean,
  readonly handleClose: () => void,
  readonly viewMode: PageViewMode,
}

const MAXIMUM_WORDS_PER_COMMENT = 100

const PostCommentsDialog = ({ open, postId, handleClose, viewMode }: Props) => {
  const { t: translate } = useTranslation()
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { currentUser } = useContext(AuthenticationContext)
  const [comments, setComments] = useState<Comment[]>([])

  const [commentBody, setCommentBody] = useState('')
  const [commentBodyNumberOfWords, setCommentBodyNumberOfWords] = useState(0)
  const [commentBodyError, setCommentBodyError] = useState<InputValidationError | undefined>()
  const [sendButtonClicked, setSendButtonClicked] = useState(false)
  const [confirmCommentDeleteOpen, setConfirmCommentDeleteOpen] = useState<Comment | undefined>()
  const [confirmCommentText, setConfirmCommentText] = useState('')

  useEffect(() => {
    const fetchComments = async () => setComments(await getApiClient().commentClient.all(postId))

    void fetchComments()
  }, [postId])

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
    const numberOfWords = numberOfWordsInText(bodyValue)

    if (numberOfWords > MAXIMUM_WORDS_PER_COMMENT) return

    setCommentBody(bodyValue)
    setCommentBodyNumberOfWords(numberOfWords)
  }

  const validateCommentBody = (forceValidation = false) => {
    // Do not display validations unless the Send button has been clicked
    if (!forceValidation && !sendButtonClicked) return false

    if (!commentBody) {
      setCommentBodyError('required')

      return false
    }

    if (commentBodyNumberOfWords > MAXIMUM_WORDS_PER_COMMENT) {
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
    setCommentBodyNumberOfWords(0)
  }

  const deleteComment = async (commentToDelete: Comment) => {
    try {
      await getApiClient().commentClient.delete(commentToDelete.id, postId)
      setComments(previous => previous.filter(comment => comment.id !== commentToDelete.id))
    } catch {
      openAlertSnackbar(translate('social.comments.comment-deletion-error'), { severity: 'error' })
    }
  }

  const handleDeleteCommentClick = (commentToDelete: Comment) => setConfirmCommentDeleteOpen(commentToDelete)

  const handleConfirmDeleteAction = (proceedWithDelete: boolean) => {
    const commentToDelete = confirmCommentDeleteOpen
    setConfirmCommentDeleteOpen(undefined)

    if (!proceedWithDelete || !commentToDelete) return

    void deleteComment(commentToDelete)
  }

  return (
    <>
      <Dialog fullWidth maxWidth='sm' onClose={handleClose} open={open}>
        <DialogContent className='pb-5'>
          {viewMode !== 'visitor' && (
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
                    className={`form-control ${commentBodyError && 'is-invalid'}`}
                    id='new-comment-body-input'
                    onBlur={() => validateCommentBody()}
                    onChange={handleCommentBodyChange}
                    rows={5}
                    value={commentBody}
                  />
                  <div className='max-words position-absolute end-0 pe-2' style={{ bottom: '-1.6rem' }}>
                    <span>{commentBodyNumberOfWords}/{MAXIMUM_WORDS_PER_COMMENT}</span>
                    <span className='ms-1'>
                      {translate('social.comments.words', { count: MAXIMUM_WORDS_PER_COMMENT })}
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
                    {translate('social.comments.comment-body-max-chars', { count: MAXIMUM_WORDS_PER_COMMENT })}
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
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        confirmText={translate('generic.delete')}
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
