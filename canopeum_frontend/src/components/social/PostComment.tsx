import type { Comment } from '@services/api'

type Props = {
  readonly comment: Comment,
}

const PostComment = ({ comment }: Props) => (
  <div className="bg-lightgreen">
    <span>{comment.body ?? ''}</span>
  </div>
)

export default PostComment
