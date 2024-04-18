import { AuthenticationContext } from '@components/context/AuthenticationContext.tsx'
import PostWidget from '@components/social/PostWidget.tsx'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Post } from '../services/api.ts'
import getApiClient from '../services/apiInterface.ts'
import LoadingPage from './LoadingPage.tsx'

const Home = () => {
  const { t: translate } = useTranslation()
  const { currentUser } = useContext(AuthenticationContext)
  const [isLoading, setIsLoading] = useState(true)
  const [newsPosts, setNewsPosts] = useState<Post[]>([])

  const fetchNewsPosts = useCallback(async () => {
    const response = await getApiClient().newsClient.all()
    setNewsPosts(response)
    setIsLoading(false)
  }, [setNewsPosts, setIsLoading])

  useEffect(() => void fetchNewsPosts(), [fetchNewsPosts])

  const likePost = async (postId: number) => {
    const post = newsPosts?.find(post => post.id === postId)
    if (!post) return
    const newPost = { ...post, hasLiked: !post.hasLiked }
    newPost.likeCount = post.hasLiked ? post.likeCount! - 1 : post.likeCount! + 1
    newsPosts?.splice(newsPosts.indexOf(post), 1)
    setNewsPosts([newPost as Post, ...newsPosts || []])
  }

  if (!currentUser) return <div />

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
        {newsPosts.map(post => <PostWidget key={post.id} post={post} likePostEvent={likePost} viewMode='user' />)}
      </div>
    )
  }

  if (isLoading) return <LoadingPage />

  return (
    <div>
      <div className='page-container'>
        <div className='mb-4'>
          <h1 className='text-light'>{translate('home.title', { username: currentUser.username })}</h1>

          <h6 className='text-light'>{translate('home.subtitle')}</h6>
        </div>

        {renderPosts()}
      </div>
    </div>
  )
}
export default Home
