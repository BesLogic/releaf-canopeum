import { AuthenticationContext } from '@components/context/AuthenticationContext.tsx'
import PostWidget from '@components/social/PostWidget.tsx'
import { CircularProgress } from '@mui/material'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import getApiClient from '../services/apiInterface.ts'
import usePostsStore from '../store/postsStore.ts'
import LoadingPage from './LoadingPage.tsx'

const INCERTITUDE_MARGIN = 3
const PAGE_SIZE = 4

const Home = () => {
  const { t: translate } = useTranslation()
  const { currentUser } = useContext(AuthenticationContext)
  const { posts: newsPosts, setPosts, morePostsLoaded } = usePostsStore()

  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const listInnerRef = useRef<HTMLDivElement>(null)

  const [currentPage, setCurrentPage] = useState(0) // storing current page number
  const [previousPage, setPreviousPage] = useState(0) // storing prev page number
  const [wasLastList, setWasLastList] = useState(false) // setting a flag to know the last list

  const onScroll = () => {
    if (
      isLoading ||
      isLoadingMore ||
      !listInnerRef.current
    ) return

    const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current

    if (scrollTop + clientHeight < scrollHeight - INCERTITUDE_MARGIN) return

    setIsLoadingMore(true)
    setTimeout(() => void fetchNewsPosts(), 3000)
  }

  const fetchNewsPosts = useCallback(async () => {
    if (
      !currentUser || newsPosts.length > PAGE_SIZE * currentPage
    ) return

    const response = await getApiClient().postClient.all(
      currentPage + 1,
      currentUser.followedSiteIds,
      PAGE_SIZE,
    )

    if (currentPage === 0) {
      setPosts(response)
    } else {
      morePostsLoaded(response)
    }

    setCurrentPage(previous => previous + 1)
    setIsLoading(false)
    setIsLoadingMore(false)
  }, [setPosts, setIsLoading, morePostsLoaded, currentUser, currentPage, newsPosts])

  // Find the best way to prevent an infinite loop, fetch news posts only ONCE on render
  // eslint-disable-next-line react-hooks/exhaustive-deps -- This creates an infinite loop
  useEffect(() => void fetchNewsPosts(), [])

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
        {newsPosts.map(post => <PostWidget key={post.id} post={post} />)}
      </div>
    )
  }

  if (!currentUser) return <div />

  if (isLoading) return <LoadingPage />

  return (
    <div className='page-container h-100 overflow-y-auto' onScroll={onScroll} ref={listInnerRef}>
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
  )
}
export default Home
