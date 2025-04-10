import { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import LoadingPage from './LoadingPage'
import AnalyticsSiteHeader from '@components/analytics/AnalyticsSiteHeader'
import SiteAdminTabs from '@components/analytics/SiteAdminTabs'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import type { SiteSummaryDetail } from '@services/api'
import AnalyticsSiteBatches from '@components/analytics/AnalyticsSiteBatches'

const AnalyticsSite = () => {
  const { siteId: siteIdFromParams } = useParams()

  const { getApiClient } = useApiClient()
  const { displayUnhandledAPIError } = useErrorHandling()

  const [siteSummary, setSiteSummary] = useState<SiteSummaryDetail | undefined>()

  const fetchSite = useCallback(
    async (siteId: number) => setSiteSummary(await getApiClient().siteClient.summary(siteId)),
    [getApiClient],
  )

  useEffect(() => {
    if (!siteIdFromParams) return

    const siteIdNumber = Number.parseInt(siteIdFromParams, 10)
    if (!siteIdNumber) return

    fetchSite(siteIdNumber).catch(displayUnhandledAPIError('errors.fetch-site-failed'))
  }, [fetchSite, siteIdFromParams])

  if (!siteSummary) {
    return <LoadingPage />
  }

  return (
    <div className='page-container d-flex flex-column gap-4'>
      <SiteAdminTabs siteId={siteSummary.id} />

      <AnalyticsSiteHeader siteSummary={siteSummary} />

      <AnalyticsSiteBatches
        siteSummary={siteSummary}
        fetchSite={fetchSite}
      />
    </div>
  )
}

export default AnalyticsSite
