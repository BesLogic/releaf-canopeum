import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import AnnouncementCard from '../components/AnnouncementCard/AnnouncementCard';
import SiteSummaryCard from '../components/site/SiteSummaryCard'
import type { SiteSocial } from '../services/api'
import api from '../services/apiInterface'

const fetchSite = async (siteId: number, setSite: (site: SiteSocial) => void) => {
  try {
    const site = await api().social.site(siteId)
    setSite(site)
  } catch (error) {
    console.error(error)
  }
}
const MapSite = () => {
  const { siteId } = useParams()
  const [site, setSite] = useState<SiteSocial>()

  useEffect((): void => {
    void fetchSite(Number(siteId) || 1, setSite)
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
            <AnnouncementCard siteId={ Number(siteId) } />
          </div>
          <div className='col-8'>
            <div className='bg-white rounded-2 px-3 py-2'>
              <h1>Right</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default MapSite
