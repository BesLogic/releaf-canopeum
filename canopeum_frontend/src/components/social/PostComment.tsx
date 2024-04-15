import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { LanguageContext } from '@components/context/LanguageContext'
import type { Comment } from '@services/api'
import { useContext } from 'react'

type Props = {
  readonly comment: Comment,
  readonly onDelete: (comment: Comment) => void,
}

const PostComment = ({ comment, onDelete }: Props) => {
  const { formatDate } = useContext(LanguageContext)
  const { currentUser } = useContext(AuthenticationContext)

  const canDeleteComment = currentUser && (
    ['Admin', 'MegaAdmin'].includes(currentUser.role) ||
    comment.authorId === currentUser.id
  )

  return (
    <div className='bg-lightgreen p-2'>
      <div className='d-flex justify-content-between align-items-center'>
        <div className='d-flex align-items-center gap-2'>
          <span className='material-symbols-outlined fill-icon icon-5xl'>account_circle</span>

          <div className='d-flex flex-column'>
            <span className='fw-bold'>{comment.authorUsername}</span>
            <span className='text-muted text-small'>{formatDate(comment.createdAt, { dateStyle: 'short' })}</span>
          </div>
        </div>

        {canDeleteComment && <button className='unstyled-button' onClick={() => onDelete(comment)} type='button'>
          <span className='material-symbols-outlined text-primary'>cancel</span>
        </button>}
      </div>

      <div className='mt-1'>
        <span>{comment.body}</span>
      </div>
    </div>
  )
}

export default PostComment
