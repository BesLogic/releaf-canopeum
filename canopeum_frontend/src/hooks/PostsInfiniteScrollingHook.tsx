import { type RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SnackbarContext } from '@components/context/SnackbarContext'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import usePostsStore from '@store/postsStore'

const INCERTITUDE_MARGIN = 3
const PAGE_SIZE = 5

const usePostsInfiniteScrolling = () => {
  const { setPosts, morePostsLoaded } = usePostsStore()
  const { t: translate } = useTranslation()
  const { getApiClient } = useApiClient()
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { getErrorMessage } = useErrorHandling()

  const [siteIds, setSiteIds] = useState<number[]>()
  const [currentPage, setCurrentPage] = useState(0)
  const [postsAreAllLoaded, setPostsAreAllLoaded] = useState(false)
  const [isLoadingFirstPage, setIsLoadingFirstPage] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadingError, setLoadingError] = useState<string>()

  const isMounted = useRef(false)

  const fetchPostsPage = useCallback(async () => {
    if (!siteIds || siteIds.length === 0) return

    setIsLoadingMore(true)

    try {
      const response = await getApiClient().postClient.all(
        currentPage + 1,
        PAGE_SIZE,
        siteIds,
      )
      if (!response.next) {
        setPostsAreAllLoaded(true)
      }

      if (currentPage === 0) {
        setPosts(response.results)
      } else {
        morePostsLoaded(response.results)
      }

      // FIXME: There's currently an issue where this is triggered multiple times
      // and sending multiple requests.
      // If we "correctly" re-use the previous state using `previous => previous + 1`,
      // this number will rapidly increase past the intended pagination.
      setCurrentPage(currentPage + 1)
      setLoadingError(undefined)
    } catch (error: unknown) {
      setLoadingError(getErrorMessage(error, translate('posts.error-loading-posts')))
    }

    setIsLoadingFirstPage(false)
    setIsLoadingMore(false)
  }, [
    siteIds,
    currentPage,
    translate,
    getApiClient,
    setPosts,
    morePostsLoaded,
    setLoadingError,
    getErrorMessage,
  ])

  useEffect(() => {
    // Call only on initial render
    if (!siteIds || isMounted.current) return

    if (siteIds.length === 0) {
      setIsLoadingFirstPage(false)

      return
    }

    fetchPostsPage()
      .then(() => isMounted.current = true)
      .catch(() => isMounted.current = false)
  }, [fetchPostsPage, siteIds])

  // The scrollable container should be the parent container with overflow y auto/scroll
  // Scrolling to the bottom of this container will load more posts
  const onScroll = (scrollableContainerRef: RefObject<HTMLDivElement>) => {
    if (
      isLoadingFirstPage
      || isLoadingMore
      || postsAreAllLoaded
      || !scrollableContainerRef.current
    ) return

    const { scrollTop, scrollHeight, clientHeight } = scrollableContainerRef.current

    if (scrollTop + clientHeight < scrollHeight - INCERTITUDE_MARGIN) return

    setIsLoadingMore(true)
    fetchPostsPage().catch((error: unknown) =>
      openAlertSnackbar(getErrorMessage(error, translate('errors.fetch-posts-failed')), {
        severity: 'error',
      })
    )
  }

  return {
    fetchPostsPage,
    onScroll,
    setSiteIds,
    isLoadingMore,
    isLoadingFirstPage,
    postsAreAllLoaded,
    loadingError,
  }
}

export default usePostsInfiniteScrolling
