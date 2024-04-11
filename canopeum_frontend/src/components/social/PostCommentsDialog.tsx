import PostComment from '@components/social/PostComment';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import type { Comment } from '@services/api';
import getApiClient from '@services/apiInterface';
import { useEffect, useState } from 'react';

type Props = {
  readonly postId: number,
  readonly open: boolean,
  readonly handleClose: () => void,
}

const PostCommentsDialog = ({ open, postId, handleClose }: Props) => {
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    const fetchComments = async () => setComments(await getApiClient().commentClient.all(postId))

    void fetchComments()
  }, [postId])

  const postComment = () => { }

  return (
    <Dialog fullWidth maxWidth="sm" onClose={handleClose} open={open}>
      <DialogTitle className='d-flex justify-content-between align-items-center pb-1'>
        <label className="form-label mb-0" htmlFor="new-comment-body-input">Leave a Comment</label>

        <button className='btn btn-primary' onClick={postComment} type='button'>Send</button>
      </DialogTitle>
      <DialogContent>
        <div className="position-relative">
          <textarea className="form-control" id="new-comment-body-input" rows={3} />
          <span className="max-words position-absolute bottom-0 end-0 pe-2 pb-1" style={{}}>300 words maximum</span>
        </div>

        <div className="mt-4 d-flex align-items-center gap-1 fw-bold">
          <span className='material-symbols-outlined'>sms</span>
          <span>Comments ({comments.length})</span>
        </div>

        <div className="mt-2 d-flex flex-column gap-2">
          {comments.map(comment => <PostComment comment={comment} key={comment.id} />)}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostCommentsDialog
