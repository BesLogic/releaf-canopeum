import { AuthenticationContext } from '@components/context/AuthenticationContext'
import SiteSummaryCard from '@components/site/SiteSummaryCard'
import type { Post, SiteSocial } from '@services/api'
import api from '@services/apiInterface'
import { ensureError } from '@services/errors'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CreatePostWidget from '../components/CreatePostWidget'
import PostWidget from '../components/PostWidget'

const MapSite = () => {
  const { siteId } = useParams()
  const { currentUser } = useContext(AuthenticationContext)
  const [isLoadingSite, setIsLoadingSite] = useState(true)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [site, setSite] = useState<SiteSocial>()
  const viewMode = currentUser
    ? currentUser.role === 'RegularUser'
      ? 'user'
      : 'admin'
    : 'visitor'

  const fetchSiteData = async (parsedSiteId: number) => {
    setIsLoadingSite(true)
    try {
      const fetchedSite = await api().social.site(parsedSiteId)
      setSite(fetchedSite)
    } catch (error_: unknown) {
      setError(ensureError(error_))
    } finally {
      setIsLoadingSite(false)
    }
  }

  useEffect((): void => {
    void fetchSiteData(Number(siteId) || 1)
  }, [siteId])

  return (
    <div className='container mt-2 d-flex flex-column gap-2'>
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
            <div className='bg-white rounded-2 2 py-2'>
              <h1>Left</h1>
            </div>
          </div>
          <div className='col-8'>
            <div className='rounded-2 d-flex flex-column gap-2'>
              {site && (
                <>
                  <CreatePostWidget site={site} />
                  <div className='d-flex flex-column gap-2'>
                    {site.posts?.map((post: Post) => <PostWidget key={post.id} post={post} />)}
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
