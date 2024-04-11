import { LanguageContext } from '@components/context/LanguageContext'
import type { Comment } from '@services/api'
import { useContext } from 'react'

type Props = {
  readonly comment: Comment,
}

const PostComment = ({ comment }: Props) => {
  const { formatDate } = useContext(LanguageContext)

  return (<div className="bg-lightgreen p-2">
    <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-2">
        <span className="material-symbols-outlined fill-icon icon-5xl">account_circle</span>

        <div className="d-flex flex-column">
          <span className='fw-bold'>{comment.authorUsername}</span>
          <span className='text-muted text-small'>{formatDate(comment.createdAt, { dateStyle: 'short' })}</span>
        </div>
      </div>

      <button className="unstyled-button" type="button">
        <span className="material-symbols-outlined text-primary">cancel</span>
      </button>
    </div>

    <div className='mt-1'>
      <span>{comment.body}</span>
    </div>
  </div>
  )
}

export default PostComment
