import { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BatchTable from '@components/analytics/BatchTable'
import type { SiteDto } from '@components/analytics/site-modal/SiteModal'
import SiteModal from '@components/analytics/site-modal/SiteModal'
import SiteSuccessRatesChart from '@components/analytics/SiteSuccessRatesChart'
import SiteSummaryCard from '@components/analytics/SiteSummaryCard'
import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { LanguageContext } from '@components/context/LanguageContext'
import { SnackbarContext } from '@components/context/SnackbarContext'
import useApiClient from '@hooks/ApiClientHook'
import { coordinateToString } from '@models/Coordinate'
import type { SiteSummary, User } from '@services/api'
import { assetFormatter } from '@utils/assetFormatter'

const Analytics = () => {
  const { t: translate } = useTranslation()
  const { formatDate } = useContext(LanguageContext)
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { currentUser } = useContext(AuthenticationContext)
  const { getApiClient } = useApiClient()

  const [siteSummaries, setSiteSummaries] = useState<SiteSummary[]>([])
  const [adminList, setAdminList] = useState<User[]>([])
  const [siteId, setSiteId] = useState<number>()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchSites = useCallback(
    async () => setSiteSummaries(await getApiClient().summaryClient.all()),
    [getApiClient],
  )

  const fetchAdmins = useCallback(
    async () => setAdminList(await getApiClient().userClient.allForestStewards()),
    [getApiClient],
  )

  const handleModalClose = async (
    reason: 'backdropClick' | 'escapeKeyDown' | 'save' | 'cancel',
    data?: SiteDto,
  ) => {
    if (reason !== 'save') {
      setIsModalOpen(false)
      setSiteId(undefined)

      return
    }

    if (data) {
      const image = data.siteImage
        ? await assetFormatter(data.siteImage)
        : undefined

      const {
        dmsLatitude,
        dmsLongitude,
        siteName,
        siteType,
        presentation,
        researchPartner,
        size,
        species,
        visibleOnMap,
      } = data

      const latitude = coordinateToString(dmsLatitude)
      const longitude = coordinateToString(dmsLongitude)

      const response = siteId
        ? getApiClient().siteClient.update(
          siteId,
          siteName,
          siteType,
          image,
          latitude,
          longitude,
          presentation,
          size,
          species,
          researchPartner,
          visibleOnMap,
        )
        : getApiClient().siteClient.create(
          siteName,
          siteType,
          image,
          latitude,
          longitude,
          presentation,
          size,
          species,
          researchPartner,
          visibleOnMap,
        )

      response.then(async () => {
        openAlertSnackbar(
          translate('analytics.site-save-success'),
        )
        setIsModalOpen(false)
        setSiteId(undefined)
        setSiteSummaries(await getApiClient().summaryClient.all())
      }).catch(() =>
        openAlertSnackbar(
          translate('analytics.site-save-error'),
          { severity: 'error' },
        )
      )
    }
  }

  const handleSiteEdit = (_siteId: number) => {
    setSiteId(_siteId)
    setIsModalOpen(true)
  }

  useEffect((): void => {
    if (currentUser?.role !== 'MegaAdmin') return

    void fetchAdmins()
  }, [currentUser?.role, fetchAdmins])

  useEffect(
    (): void => void fetchSites(),
    [fetchSites],
  )

  const renderBatches = () =>
    siteSummaries.map(site => {
      const lastModifiedBatchDate = site.batches.length > 0
        ? site
          .batches
          .map(batch => batch.updatedAt ?? new Date())
          .sort((a, b) =>
            a > b
              ? -1
              : 1
          )[0]
        : undefined

      return (
        <div className='accordion-item mb-3 rounded' key={site.id}>
          <h2 className='accordion-header rounded' id={`heading-${site.id}`}>
            <button
              aria-controls={`collapse-${site.id}`}
              aria-expanded='true'
              className='accordion-button collapsed rounded'
              data-bs-target={`#collapse-${site.id}`}
              data-bs-toggle='collapse'
              type='button'
            >
              <div className='d-flex justify-content-between w-100 pe-3 fs-5'>
                <span>{site.name}</span>
                <span style={{ opacity: .5 }}>
                  {translate('analytics.last-update')}: {lastModifiedBatchDate
                    ? formatDate(lastModifiedBatchDate)
                    : 'N/A'}
                </span>
                <span className='text-capitalize'>
                  {site.batches.length}{' '}
                  {translate('analytics.batch', { count: site.batches.length })}
                </span>
              </div>
            </button>
          </h2>

          <div
            aria-labelledby={`heading-${site.id}`}
            className='accordion-collapse collapse'
            data-bs-parent='#accordion-batches'
            id={`collapse-${site.id}`}
          >
            <div className='accordion-body'>
              <BatchTable batches={site.batches} siteId={site.id} />
            </div>
          </div>
        </div>
      )
    })

  return (
    <div className='h-100 overflow-y-auto'>
      <div className='page-container d-flex flex-column gap-2 mt-3'>
        <div className='d-flex justify-content-between'>
          <h1 className='text-light'>{translate('analytics.title')}</h1>

          {currentUser?.role === 'MegaAdmin'
            && (
              <button
                className='btn btn-secondary'
                onClick={() => setIsModalOpen(true)}
                type='button'
              >
                {translate('analytics.create-site')}
              </button>
            )}
          <SiteModal
            handleClose={handleModalClose}
            open={isModalOpen}
            siteId={siteId}
          />
        </div>

        <div className='mt-2 row gx-3 gy-3 pb-3' style={{ maxHeight: '67rem', overflow: 'auto' }}>
          {siteSummaries.map(site => (
            <SiteSummaryCard
              admins={adminList}
              key={`site-${site.id}-card`}
              onSiteChange={setSiteSummaries}
              onSiteEdit={handleSiteEdit}
              site={site}
            />
          ))}
        </div>

        <div className='mt-4 card p-3'>
          <h5>{translate('analytics.success-rate-chart.title')}</h5>
          <SiteSuccessRatesChart siteSummaries={siteSummaries} />
        </div>

        <div className='mt-4'>
          <div className='card p-3 px-4'>
            <div className='d-flex justify-content-between'>
              <div className='fs-5'>{translate('analytics.batch-tracking')}</div>
              <div>
                <span>TODO: Filters Go Here</span>
              </div>
            </div>
          </div>

          <div className='accordion mt-4' id='accordion-batches'>
            {renderBatches()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
