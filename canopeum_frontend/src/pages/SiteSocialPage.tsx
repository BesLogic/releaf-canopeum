import { CircularProgress } from '@mui/material'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import LoadingPage from './LoadingPage'
import SiteAdminTabs from '@components/analytics/SiteAdminTabs'
import { AuthenticationContext } from '@components/context/AuthenticationContext'
import CreatePostWidget from '@components/CreatePostWidget'
import AnnouncementCard from '@components/social/AnnouncementCard'
import ContactCard from '@components/social/ContactCard'
import PostCard from '@components/social/PostCard'
import SiteSocialHeader from '@components/social/SiteSocialHeader'
import WidgetCard from '@components/social/WidgetCard'
import WidgetDialog from '@components/social/WidgetDialog'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import usePostsInfiniteScrolling from '@hooks/PostsInfiniteScrollingHook'
import type { PageViewMode } from '@models/PageViewMode.type'
import { type IWidget, PatchedWidget, type Post, type SiteSocial, Widget } from '@services/api'
import { ensureError } from '@services/errors'
import usePostsStore from '@store/postsStore'
import type { ExcludeFunctions } from '@utils/types'

const fetchSiteDataError = 'errors.fetch-site-data-failed'

const SiteSocialPage = () => {
  const { t } = useTranslation()
  const { siteId: siteIdParam } = useParams()
  const { currentUser } = useContext(AuthenticationContext)
  const { posts, addPost } = usePostsStore()
  const { getApiClient } = useApiClient()
  const { displayUnhandledAPIError } = useErrorHandling()
  const scrollableContainerRef = useRef<HTMLDivElement>(null)

  const {
    onScroll,
    setSiteIds,
    isLoadingMore,
    isLoadingFirstPage,
    loadingError,
  } = usePostsInfiniteScrolling()

  const [isLoadingSite, setIsLoadingSite] = useState(true)
  const [error, setError] = useState<Error | undefined>()
  const [site, setSite] = useState<ExcludeFunctions<SiteSocial>>()
  const [sitePosts, setSitePosts] = useState<Post[]>([])
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState<[boolean, Widget | undefined]>([
    false,
    undefined,
  ])

  const siteId = siteIdParam
    ? Number.parseInt(siteIdParam, 10) || 0
    : 0

  const viewMode: PageViewMode = currentUser
    ? ((currentUser.role === 'MegaAdmin' || currentUser.adminSiteIds.includes(siteId))
      ? 'admin'
      : 'user')
    : 'visitor'

  const fetchSiteData = useCallback(async (parsedSiteId: number) => {
    setIsLoadingSite(true)
    try {
      const fetchedSite = await getApiClient().siteClient.social(parsedSiteId)
      setSite(fetchedSite)
    } catch (error_: unknown) {
      setError(ensureError(error_))
    } finally {
      setIsLoadingSite(false)
    }
  }, [getApiClient])

  const handleModalClose = (
    reason?: 'backdropClick' | 'delete' | 'escapeKeyDown' | 'save',
    data?: IWidget,
  ) => {
    if (reason && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
      setIsWidgetModalOpen([false, undefined])

      return
    }

    if (reason === 'delete' && data) {
      getApiClient().widgetClient.delete(siteId, data.id)
        .then(() => fetchSiteData(siteId))
        .catch(displayUnhandledAPIError(fetchSiteDataError))
    }

    if (reason === 'save' && data) {
      const response = data.id === 0
        ? getApiClient().widgetClient.create(siteId, new Widget(data))
        : getApiClient().widgetClient.update(siteId, data.id, new PatchedWidget(data))

      response
        .then(() => fetchSiteData(siteId))
        .catch(displayUnhandledAPIError(fetchSiteDataError))
    }

    setIsWidgetModalOpen([false, undefined])
  }

  const addNewPost = (newPost: Post) => addPost(newPost)

  useEffect((): void => {
    fetchSiteData(siteId).catch(displayUnhandledAPIError(fetchSiteDataError))
    setSiteIds([siteId])
  }, [siteId, fetchSiteData, setSiteIds])

  useEffect(
    () => setSitePosts(posts.filter(post => post.site.id === siteId)),
    [posts, siteId],
  )

  if (isLoadingSite) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <div className='card 2 py-2'>
        <p>{error.message}</p>
      </div>
    )
  }

  if (!site) return <div />

  return (
    <div
      className='h-100 overflow-y-auto'
      onScroll={() => onScroll(scrollableContainerRef)}
      ref={scrollableContainerRef}
    >
      <div className='page-container d-flex flex-column gap-4'>
        {viewMode === 'admin' && (
          <div className='row m-0'>
            <SiteAdminTabs siteId={siteId} />
          </div>
        )}

        <div className='row m-0'>
          <div className='col-12'>
            <SiteSocialHeader site={site} viewMode={viewMode} />
          </div>
        </div>

        <div className='row row-gap-1 m-0'>
          <div className='col-12 col-md-6 col-lg-5 col-xl-4'>
            <div className='d-flex flex-column gap-4'>
              <AnnouncementCard
                announcement={site.announcement}
                onEdit={announcement => setSite(() => ({ ...site, announcement }))}
                viewMode={viewMode}
              />
              <ContactCard
                contact={site.contact}
                onEdit={contact => setSite(() => ({ ...site, contact }))}
                viewMode={viewMode}
              />
              {site.widget.map(widget => (
                <WidgetCard
                  handleEditClick={() => setIsWidgetModalOpen([true, widget])}
                  key={`widget-${widget.id}`}
                  widget={widget}
                />
              ))}
              {currentUser && currentUser.role !== 'User' && (
                <>
                  <button
                    className='btn btn-light text-primary d-flex justify-content-center p-3'
                    onClick={() => setIsWidgetModalOpen([true, undefined])}
                    type='button'
                  >
                    <span className='material-symbols-outlined'>add</span>{' '}
                    <span>{t('social.widgets.create')}</span>
                  </button>
                  <WidgetDialog handleClose={handleModalClose} open={isWidgetModalOpen} />
                </>
              )}
            </div>
          </div>

          <div className='col-12 col-md-6 col-lg-7 col-xl-8'>
            <div className='d-flex flex-column gap-4'>
              {viewMode === 'admin' && <CreatePostWidget addNewPost={addNewPost} siteId={siteId} />}
              <div className='d-flex flex-column gap-4'>
                {isLoadingFirstPage
                  ? (
                    <div className='card'>
                      <div className='card-body'>
                        <LoadingPage />
                      </div>
                    </div>
                  )
                  : (loadingError
                    ? (
                      <div className='card'>
                        <div className='card-body'>
                          <span>{loadingError}</span>
                        </div>
                      </div>
                    )
                    : sitePosts.map(post => (
                      <PostCard
                        key={post.id}
                        post={post}
                        showActions
                      />
                    )))}
              </div>

              {isLoadingMore && (
                <div className='w-100 d-flex justify-content-center align-items-center py-2'>
                  <CircularProgress color='secondary' size={50} thickness={5} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SiteSocialPage
