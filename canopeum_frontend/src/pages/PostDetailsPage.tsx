import { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import LoadingPage from './LoadingPage'
import { SnackbarContext } from '@components/context/SnackbarContext'
import PostCard from '@components/social/PostCard'
import { appRoutes } from '@constants/routes.constant'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import type { Post } from '@services/api'
import usePostsStore from '@store/postsStore'

const PostDetailsPage = () => {
  const { t: translate } = useTranslation()
  const { postId: postIdFromParams } = useParams()
  const { posts, setPosts } = usePostsStore()
  const { getApiClient } = useApiClient()
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { getErrorMessage } = useErrorHandling()

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

    fetchPost(postIdNumber).catch((error: unknown) =>
      openAlertSnackbar(
        getErrorMessage(error, translate('errors.fetch-post-failed')),
        { severity: 'error' },
      )
    )
    setPostId(postIdNumber)
  }, [fetchPost, postIdFromParams])

  if (isLoading) {
    return <LoadingPage />
  }

  if (!postDetail || postError) {
    return (
      <div className='container py-5'>
        <div className='card px-5 py-4'>
          <span>{translate('posts.error-loading-post')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='container py-5'>
      <Link
        className='d-inline-block mb-3 text-light link-inner-underline'
        to={appRoutes.siteSocial(postDetail.site.id)}
      >
        <span className='material-symbols-outlined text-decoration-none align-top'>arrow_back</span>
        <span className='ms-1'>{translate('posts.back-to-social')}</span>
      </Link>

      <PostCard post={postDetail} />
    </div>
  )
}

export default PostDetailsPage
