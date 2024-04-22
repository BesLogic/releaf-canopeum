import PostWidget from '@components/social/PostWidget'
import { appRoutes } from '@constants/routes.constant'
import { Post } from '@services/api'
import getApiClient from '@services/apiInterface'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import LoadingPage from './LoadingPage'

const PostDetailsPage = () => {
  const { t: translate } = useTranslation()
  const { postId: postIdFromParams } = useParams()

  const [post, setPost] = useState<Post>()
  const [isLoading, setIsLoading] = useState(false)
  const [postError, setPostError] = useState(false)

  const fetchPost = async (detailPostId: number) => {
    setIsLoading(true)
    try {
      const postResponse = await getApiClient().postClient.detail(detailPostId)
      setPost(postResponse)
      setIsLoading(false)
      setPostError(false)
    } catch {
      setIsLoading(false)
      setPostError(true)
    }
  }

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
  }, [postIdFromParams])

  const handlePostLike = (_postId: number) => {
    if (!post) return

    const newLikeStatus = !post.hasLiked
    setPost(previous => (previous
      ? new Post({ ...previous, hasLiked: newLikeStatus })
      : undefined)
    )
  }

  if (isLoading) {
    return <LoadingPage />
  }

  if (!post || postError) {
    return (
      <div className='container py-5'>
        <div className='bg-white rounded-2 px-5 py-4'>
          <span>{translate('posts.error-loading-post')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='container py-5'>
      <Link className='mb-3 d-flex align-items-center' to={appRoutes.siteSocial(post.site.id)}>
        <span className='material-symbols-outlined text-light'>arrow_back</span>
        <span className=' ms-1 text-light'>{translate('posts.back-to-social')}</span>
      </Link>

      <PostWidget likePostEvent={handlePostLike} post={post} viewMode='visitor' />
    </div>
  )
}

export default PostDetailsPage
