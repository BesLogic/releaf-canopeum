import { useState } from "react";

const CreatePostWidget = () => {
  const [newPost, setNewPost] = useState(null);

  return (
    <div className="bg-white rounded-2 px-3 py-2">
      <div className="d-flex justify-content-between">
        <div>New Post</div>
        <button className="btn btn-secondary" type="button">
          Publish
        </button>
      </div>

      <span className="material-symbols-outlined fill-icon">add_a_photo</span>

      <textarea
        placeholder="Post a New Message..."
        className="form-control"
        id="exampleFormControlTextarea1"
      ></textarea>
    </div>
  );
};

export default CreatePostWidget;
