import './AnnouncementCard.scss';

import { useEffect, useState } from 'react'

import type { Site } from '../../services/api'
import api from '../../services/apiInterface'
import { ensureError } from '../../services/errors'

const AnnouncementCard = ({ siteId }: { readonly siteId: number }) => {
  const [site, setSite] = useState<Site>()
  const [isLoadingSite, setIsLoadingSite] = useState(false)
  const [SiteError, setSiteError] = useState<Error | undefined>(undefined)

  const fetchSites = async () => {
    setIsLoadingSite(true)
    try {
      const response = await api().social.site(siteId)
      setSite(response)
    } catch (error: unknown) {
      setSiteError(ensureError(error))
    } finally {
      setIsLoadingSite(false)
    }
  }

  useEffect((): void => {
    void fetchSites()
  }, [])

  const renderAnnouncementCard = () => {
    if (isLoadingSite) {
      return <p>Loading...</p>
    }

    if (SiteError) {
      return <p>Error: {SiteError.message}</p>
    }

    return (
      <div className='card-body'>
        <div className='d-flex justify-content-between align-items-center'>
          <h2 className='card-title'>Announcement</h2>
          <span className='material-symbols-outlined'>edit_square</span>
        </div>
        <p className='card-text'>
          {site?.announcement.body}
        </p>
        <a href={site?.announcement.link}>{site?.announcement.link}</a>
      </div>
    )
  }


  return(
    <div className='card rounded px-3 py-2 col-3'>
      {renderAnnouncementCard()}
    </div>
  )
}

export default AnnouncementCard;
