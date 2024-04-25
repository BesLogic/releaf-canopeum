import { AuthenticationContext } from '@components/context/AuthenticationContext.tsx'
import PostWidget from '@components/social/PostWidget.tsx'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import getApiClient from '../services/apiInterface.ts'
import usePostsStore from '../store/postsStore.ts'
import LoadingPage from './LoadingPage.tsx'

const Home = () => {
  const { t: translate } = useTranslation()
  const { currentUser } = useContext(AuthenticationContext)
  const { posts: newsPosts, setPosts } = usePostsStore()

  const [isLoading, setIsLoading] = useState(true)

  const fetchNewsPosts = useCallback(async () => {
    const response = await getApiClient().postClient.all(currentUser?.followedSiteIds ?? [])
    setPosts(response)
    setIsLoading(false)
  }, [setPosts, setIsLoading, currentUser])

  useEffect(() => void fetchNewsPosts(), [fetchNewsPosts])

  const likePost = (postId: number) => {}
  // setNewsPosts(previous =>
  //   previous.map(post => {
  //     const newLikeStatus = !post.hasLiked
  //     if (post.id === postId) {
  //       const newCount = newLikeStatus
  //         ? post.likeCount + 1
  //         : post.likeCount - 1
  //       const updatedPost: IPost = {
  //         ...post,
  //         hasLiked: newLikeStatus,
  //         likeCount: newCount,
  //       }

  //       return new Post(updatedPost)
  //     }

  //     return post
  //   })
  // )

  const renderPosts = () => {
    if (newsPosts.length === 0) {
      return (
        <div className='bg-white rounded-2 px-5 py-4 d-flex flex-column gap-3'>
          <span>{translate('home.no-news')}</span>
        </div>
      )
    }

    return (
      <div className='d-flex flex-column gap-3'>
        {newsPosts.map(post => <PostWidget key={post.id} likePostEvent={likePost} post={post} />)}
      </div>
    )
  }

  if (!currentUser) return <div />

  if (isLoading) return <LoadingPage />

  return (
    <div>
      <div className='page-container'>
        <div className='mb-4'>
          <h1 className='text-light'>
            {translate('home.title', { username: currentUser.username })}
          </h1>

          <h6 className='text-light'>{translate('home.subtitle')}</h6>
        </div>

        {renderPosts()}
      </div>
    </div>
  )
}
export default Home
