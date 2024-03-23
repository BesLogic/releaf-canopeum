import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import CreatePostWidget from '../components/CreatePostWidget'
import PostWidget from '../components/PostWidget'
import type { Post, SiteSocial } from '../services/api'
import api from '../services/apiInterface'

const MapSite = () => {
  const { siteId } = useParams()

  const [site, setSite] = useState<SiteSocial>()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      setSite(await api().social.site(Number(siteId)))
      setPosts(await api().social.posts())
    } finally {
      setIsLoading(false)
    }
  }

  useEffect((): void => {
    void fetchData()
  }, [])

  return (
    site && (
      <div className='container mt-2 d-flex flex-column gap-3'>
        <CreatePostWidget site={site} />
        <div className='d-flex flex-column gap-3'>
          {posts.map(post => <PostWidget key={post.id} post={post} />)}
        </div>
      </div>
    )
  )
}
export default MapSite
