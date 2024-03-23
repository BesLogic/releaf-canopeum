import { useParams } from "react-router-dom";
import CreatePostWidget from "../components/CreatePostWidget";
import { useEffect, useState } from "react";
import api from "../services/apiInterface";
import { Post } from "../services/api";
import PostWidget from "../components/PostWidget";

const MapSite = () => {
  const { siteId } = useParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      setPosts(await api.postAll());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect((): void => {
    void fetchData();
  }, []);

  return (
    <div className="container mt-2 d-flex flex-column gap-2">
      <CreatePostWidget />
      <div>
        {posts.map((post) => (
          <PostWidget key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
export default MapSite;
