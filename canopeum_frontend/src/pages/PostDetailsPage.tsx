import PostCard from '@components/social/PostCard'
import { appRoutes } from '@constants/routes.constant'
import useApiClient from '@hooks/ApiClientHook'
import type { Post } from '@services/api'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import usePostsStore from '../store/postsStore'
import LoadingPage from './LoadingPage'

const PostDetailsPage = () => {
  const { t: translate } = useTranslation()
  const { postId: postIdFromParams } = useParams()
  const { posts, setPosts } = usePostsStore()
  const { getApiClient } = useApiClient()

  const [postId, setPostId] = useState<number>()
  const [postDetail, setPostDetail] = useState<Post>()
  const [isLoading, setIsLoading] = useState(false)
  const [postError, setPostError] = useState(false)

  useEffect(() => {
    if (!postId) return
    const matchingPost = posts.find(post => post.id === postId)

    setPostDetail(matchingPost)
  }, [posts, postId])

  const fetchPost = useCallback(async (detailPostId: number) => {
    setIsLoading(true)
    try {
      const postResponse = await getApiClient().postClient.detail(detailPostId)
      setPosts([postResponse])
      setIsLoading(false)
      setPostError(false)
    } catch {
      setIsLoading(false)
      setPostError(true)
    }
  }, [getApiClient, setPosts, setIsLoading, setPostError])

  useEffect(() => {
    if (!postIdFromParams) {
      setPostError(true)

      return
    }

    const postIdNumber = Number.parseInt(postIdFromParams, 10)
    if (!postIdFromParams) {
      setPostError(true)

      return
    }

    void fetchPost(postIdNumber)
    setPostId(postIdNumber)
  }, [fetchPost, postIdFromParams])

  if (isLoading) {
    return <LoadingPage />
  }

  if (!postDetail || postError) {
    return (
      <div className='container py-5'>
        <div className='bg-cream rounded-2 px-5 py-4'>
          <span>{translate('posts.error-loading-post')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='container py-5'>
      <Link
        className='mb-3 d-flex align-items-center'
        to={appRoutes.siteSocial(postDetail.site.id)}
      >
        <span className='material-symbols-outlined text-light'>arrow_back</span>
        <span className=' ms-1 text-light'>{translate('posts.back-to-social')}</span>
      </Link>

      <PostCard post={postDetail} />
    </div>
  )
}

export default PostDetailsPage
