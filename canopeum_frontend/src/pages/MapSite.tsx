import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import SiteSummaryCard from '../components/site/SiteSummaryCard'
import type { SiteSocial } from '../services/api'
import api from '../services/apiInterface'

const fetchSite = async (siteId: number, setSite: (site: SiteSocial) => void) => {
  try {
    const site = await api().social.site(siteId)
    setSite(site)
  } catch (error) {
    console.log(error)
  }
}
const MapSite = () => {
  const { siteId } = useParams()
  const [site, setSite] = useState<SiteSocial>()

  useEffect(() => {
    fetchSite(Number(siteId) ?? 1, setSite)
  }, [setSite])

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
    </div>
  )
}
export default MapSite
