import { AuthenticationContext } from '@components/context/AuthenticationContext'
import SiteSummaryCard from '@components/site/SiteSummaryCard'
import type { Post, SiteSocial } from '@services/api'
import { ensureError } from '@services/errors'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CreatePostWidget from '../components/CreatePostWidget'
import PostWidget from '../components/PostWidget'
import AnnouncementCard from '../components/AnnouncementCard'
import ContactCard from '../components/ContactCard'
import getApiClient from '@services/apiInterface'

const MapSite = () => {
  const { siteId } = useParams()
  const { currentUser } = useContext(AuthenticationContext)
  const [isLoadingSite, setIsLoadingSite] = useState(true)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [site, setSite] = useState<SiteSocial>()

  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [errorPosts, setErrorPosts] = useState<Error | undefined>(undefined)
  const [posts, setPosts] = useState<Post[]>()

  const viewMode = currentUser
    ? currentUser.role === 'RegularUser'
      ? 'user'
      : 'admin'
    : 'visitor'

  const fetchSiteData = async (parsedSiteId: number) => {
    setIsLoadingSite(true)
    try {
      const fetchedSite = await getApiClient().siteClient.social(parsedSiteId)
      setSite(fetchedSite)
    } catch (error_: unknown) {
      setError(ensureError(error_))
    } finally {
      setIsLoadingSite(false)
    }
  }

  const fetchPosts = async (parsedSiteId: number) => {
    setIsLoadingPosts(true)
    try {
      const fetchedPosts = await getApiClient().postClient.all(parsedSiteId)
      setPosts(fetchedPosts)
    } catch (error_: unknown) {
      setErrorPosts(ensureError(error_))
    } finally {
      setIsLoadingPosts(false)
    }
  }

  useEffect((): void => {
    void fetchSiteData(Number(siteId) || 1)
    void fetchPosts(Number(siteId) || 1)
  }, [siteId])

  return (
    <div className='container mt-2 d-flex flex-column gap-4' style={{ padding: '1rem 10rem' }}>
      {isLoadingSite
        ? (
          <div className='bg-white rounded-2 2 py-2'>
            <p>Loading...</p>
          </div>
        )
        : error
        ? (
          <div className='bg-white rounded-2 2 py-2'>
            <p>{error.message}</p>
          </div>
        )
        : (site && <SiteSummaryCard site={site} viewMode={viewMode} />)}
      <div className='container px-0'>
        <div className='row'>
          <div className='col-4'>
            <div className='d-flex flex-column gap-4'>
              {site?.announcement && <AnnouncementCard announcement={site.announcement} />}
              {site?.contact && <ContactCard contact={site.contact} />}
            </div>
          </div>
          <div className='col-8'>
            <div className='rounded-2 d-flex flex-column gap-4'>
              {site && (
                <>
                  <CreatePostWidget site={site} />
                  <div className='d-flex flex-column gap-4'>
                    {isLoadingPosts
                      ? (
                        <div className='bg-white rounded-2 2 py-2'>
                          <p>Loading...</p>
                        </div>
                      )
                      : errorPosts
                      ? (
                        <div className='bg-white rounded-2 2 py-2'>
                          <p>{errorPosts.message}</p>
                        </div>
                      )
                      : posts && posts?.map((post: Post) => <PostWidget key={post.id} post={post} />)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default MapSite
