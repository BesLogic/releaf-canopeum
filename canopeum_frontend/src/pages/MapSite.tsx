import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CreatePostWidget from '../components/CreatePostWidget'
import PostWidget from '../components/PostWidget'
import type { Post, SiteSocial } from '../services/api'
import api from '../services/apiInterface'
import SiteSummaryCard from '../components/site/SiteSummaryCard'
import type { SiteSocial } from '../services/api'
import api from '../services/apiInterface'

const fetchSite = async (siteId: number, setSite: (site: SiteSocial) => void, setPosts: (posts: Post[]) => void) => {
  try {
    const site = await api().social.site(siteId)
    setSite(site)
    const post = await api().social.posts()
    setPosts(post)
  } catch (error) {
    console.error(error)
  }
}


const MapSite = () => {
  const { siteId } = useParams()
  const [site, setSite] = useState<SiteSocial>()

  const [posts, setPosts] = useState<Post[]>([])

  useEffect((): void => {
    void fetchSite(Number(siteId) || 1, setSite, setPosts)
  }, [setSite, siteId])

  return (
    <div className='container mt-2 d-flex flex-column gap-2'>
      {site && <SiteSummaryCard site={site} />}

      <div className='container px-0'>
        <div className='row'>
          <div className='col-4'>
            <div className='bg-white rounded-2 2 py-2'>
              <h1>Left</h1>
            </div>
          </div>
          <div className='col-8'>
            <div className='bg-white rounded-2 px-3 py-2'>
              <h1>Right</h1>
            </div>
          </div>
        </div>
      </div>
      {site &&

        <div className='container mt-2 d-flex flex-column gap-2'>

          <CreatePostWidget site={site} />
          <div className='d-flex flex-column gap-2'>
            {posts.map(post => <PostWidget key={post.id} post={post} />)}
          </div>
        </div>
      }
    </div>
  )
}
export default MapSite
