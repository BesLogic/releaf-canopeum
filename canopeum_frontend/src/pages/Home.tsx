import { AuthenticationContext } from '@components/context/AuthenticationContext.tsx'
import PostCard from '@components/social/PostCard.tsx'
import { CircularProgress } from '@mui/material'
import { useContext, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import usePostsInfiniteScrolling from '../hooks/PostsInfiniteScrollingHook.tsx'
import usePostsStore from '../store/postsStore.ts'
import LoadingPage from './LoadingPage.tsx'

const Home = () => {
  const { t: translate } = useTranslation()
  const { currentUser } = useContext(AuthenticationContext)
  const {
    onScroll,
    setSiteIds,
    isLoadingMore,
    isLoadingFirstPage,
    loadingError,
  } = usePostsInfiniteScrolling()
  const { posts: newsPosts } = usePostsStore()

  const listInnerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!currentUser) return

    setSiteIds(currentUser.followedSiteIds)
  }, [setSiteIds, currentUser])

  if (!currentUser) return <div />

  const renderPosts = () => {
    if (loadingError) {
      return (
        <div className='bg-white rounded-2 px-5 py-4 d-flex flex-column gap-3'>
          <span>{loadingError}</span>
        </div>
      )
    }

    if (currentUser.followedSiteIds.length === 0 || newsPosts.length === 0) {
      return (
        <div className='bg-cream rounded-2 px-5 py-4 d-flex flex-column gap-3'>
          <span>{translate('home.no-news')}</span>
        </div>
      )
    }

    return (
      <div className='d-flex flex-column gap-3'>
        {newsPosts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
    )
  }

  if (isLoadingFirstPage) return <LoadingPage />

  return (
    <div
      className='h-100 overflow-y-auto'
      onScroll={() => onScroll(listInnerRef)}
      ref={listInnerRef}
    >
      <div className='page-container h-100'>
        <div className='mb-4'>
          <h1 className='text-light'>
            {translate('home.title', { username: currentUser.username })}
          </h1>

          <h6 className='text-light'>{translate('home.subtitle')}</h6>
        </div>

        {renderPosts()}

        {isLoadingMore && (
          <div className='w-100 d-flex justify-content-center align-items-center pt-4 pb-2'>
            <CircularProgress color='secondary' size={50} thickness={5} />
          </div>
        )}
      </div>
    </div>
  )
}
export default Home
