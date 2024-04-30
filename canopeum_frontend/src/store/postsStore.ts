import { Post } from '@services/api'
import { create } from 'zustand'

type PostsState = {
  posts: Post[],
}

type Action = {
  setPosts: (posts: Post[]) => void,
  addPost: (newPost: Post) => void,
  morePostsLoaded: (newPosts: Post[]) => void,
  commentChange: (postId: number, action: 'added' | 'removed') => void,
  toggleLike: (postId: number) => void,
}

const usePostsStore = create<Action & PostsState>(set => ({
  posts: [],
  setPosts: posts => set(_state => ({ posts })),
  addPost: newPost => set(state => ({ posts: [newPost, ...state.posts] })),
  morePostsLoaded: (newPosts: Post[]) => set(state => ({ posts: [...state.posts, ...newPosts] })),
  commentChange: (postId, action) =>
    set(state => {
      const { posts } = state
      const mappedPosts = posts.map(post => {
        if (post.id !== postId) return post

        return new Post({
          ...post,
          commentCount: action === 'added'
            ? post.commentCount + 1
            : post.commentCount - 1,
        })
      })

      return ({ posts: mappedPosts })
    }),
  toggleLike: postId =>
    set(state => {
      const { posts } = state
      const mappedPosts = posts.map(post => {
        if (post.id !== postId) return post

        const newLikeStatus = !post.hasLiked

        return new Post({
          ...post,
          hasLiked: newLikeStatus,
          likeCount: newLikeStatus
            ? post.likeCount + 1
            : post.likeCount - 1,
        })
      })

      return ({ posts: mappedPosts })
    }),
}))

export default usePostsStore
