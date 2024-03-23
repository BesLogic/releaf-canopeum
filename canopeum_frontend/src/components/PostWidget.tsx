import canopeumLogo from '@assets/images/Canopeum_Logo.jpg';

import type { Post } from '../services/api';
import { formatDate } from '../utils/dateFormatter';

const PostWidget = (props: { readonly post: Post }) => {
  const { post } = props;

  return (
    <div className='bg-white rounded-2 px-5 py-4 d-flex flex-column gap-3'>
      <div className='d-flex justify-content-start gap-2'>
        <img alt='site' className='rounded-circle' src={canopeumLogo} style={{ height: '48px', width: '48px' }} />
        <div className='d-flex flex-column'>
          <div>{post.site.name}</div>
          {post.createdAt && <div>{formatDate(post.createdAt.toISOString())}</div>}
        </div>
      </div>

      <div>{post.body}</div>

      <div className='d-flex justify-content-end gap-4'>
        <div className='d-flex gap-2'>
          <span className='material-symbols-outlined'>eco</span>
          <div>{post.likeCount}</div>
        </div>
        <div className='d-flex gap-2'>
          <span className='material-symbols-outlined'>sms</span>
          <div>{post.commentCount}</div>
        </div>
        <div className='d-flex gap-2'>
          <span className='material-symbols-outlined'>share</span>
          <div>{post.shareCount}</div>
        </div>
        <div />
      </div>
    </div>
  );
};

export default PostWidget;
