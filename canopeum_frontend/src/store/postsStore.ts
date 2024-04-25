import { Post } from '@services/api'
import { create } from 'zustand'

type PostsState = {
  posts: Post[],
}

type Action = {
  setPosts: (posts: Post[]) => void,
  addPost: (newPost: Post) => void,
  commentChange: (postId: number, action: 'added' | 'removed') => void,
}

const usePostsStore = create<Action & PostsState>(set => ({
  posts: [],
  setPosts: posts => set(_state => ({ posts })),
  addPost: newPost => set(state => ({ posts: [newPost, ...state.posts] })),
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
}))

export default usePostsStore
