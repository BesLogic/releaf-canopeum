import type { Site } from '@services/api'
import api from '@services/apiInterface'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

const AnalyticsSite = () => {
  const { t: translate } = useTranslation()
  const { siteId: siteIdFromParams } = useParams()

  const [site, setSite] = useState<Site | undefined>()

  const fetchSite = async (siteId: number) => setSite(await api().analytics.site(siteId))

  useEffect(() => {
    if (!siteIdFromParams) return

    const siteIdNumber = Number.parseInt(siteIdFromParams, 10)
    if (!siteIdNumber) return

    void fetchSite(siteIdNumber)
  }, [siteIdFromParams])

  return (
    <div className='container py-3 d-flex flex-column gap-4'>
      <div className='bg-white rounded d-flex'>
        <div className='p-5'>
          <span>{translate('analyticsSite.location')}</span>
        </div>

        <div className='site-info-container py-3 px-4'>
          <h2>{site?.name}</h2>
        </div>
      </div>

      <div className='bg-white rounded py-3 px-4 d-flex'>
        <h4>{translate('analyticsSite.batch-tracking')}</h4>
      </div>
    </div>
  )
}

export default AnalyticsSite
