import { Dialog, DialogContent, DialogTitle } from '@mui/material';

type Props = {
  readonly postId: number,
  readonly open: boolean,
  readonly handleClose: () => void,
}

const PostCommentsDialog = ({ open, postId, handleClose }: Props) => {
  console.log('postId:', postId);

  const postComment = () => { }

  return (
    <Dialog fullWidth maxWidth="sm" onClose={handleClose} open={open}>
      <DialogTitle className='d-flex justify-content-between align-items-center pb-1'>
        <label className="form-label mb-0" htmlFor="new-comment-body-input">Leave a Comment</label>

        <button className='btn btn-primary' onClick={postComment} type='button'>Send</button>
      </DialogTitle>
      <DialogContent>
        <div className="mb-3 position-relative">
          <textarea className="form-control" id="new-comment-body-input" rows={3} />
          <span className="max-words position-absolute bottom-0 end-0 pe-2 pb-1" style={{}}>300 words maximum</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostCommentsDialog
