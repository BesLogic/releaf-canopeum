import { FormatDate } from "../Utils/DateFormatter";
import type { Post } from "../services/api";
import canopeumLogo from "@assets/images/Canopeum_Logo.jpg";

const PostWidget = (props: { post: Post }) => {
  const { post } = props;

  return (
    <div className="bg-white rounded-2 px-3 py-2">
      <div className="d-flex justify-content-start">
        <img src={canopeumLogo} style={{ height: "48px", width: "48px" }} className="rounded-circle" alt="site-photo" />
        <div>
          <div>{post.site.name}</div>
          <div>{FormatDate(post.createAt)}</div>
        </div>
      </div>

      <div>{post.body}</div>

      <div className="d-flex justify-content-end">
        <span className="material-symbols-outlined">eco</span>
        <div>{post.likeCount}</div>
        <span className="material-symbols-outlined">sms</span>
        <div>{post.commentCount}</div>
        <span className="material-symbols-outlined">share</span>
        <div>{post.shareCount}</div>
        <div></div>
      </div>
    </div>
  );
};

export default PostWidget;
