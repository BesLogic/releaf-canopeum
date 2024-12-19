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
import useErrorHandling from '@hooks/ErrorHandlingHook'
import { type Coordinate, coordinateToString } from '@models/Coordinate'
import type { SiteSummary, User } from '@services/api'
import { assetFormatter } from '@utils/assetFormatter'

const Analytics = () => {
  const { t: translate } = useTranslation()
  const { formatDate } = useContext(LanguageContext)
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { currentUser } = useContext(AuthenticationContext)
  const { getApiClient } = useApiClient()
  const { getErrorMessage } = useErrorHandling()

  const [siteSummaries, setSiteSummaries] = useState<SiteSummary[]>([])
  const [adminList, setAdminList] = useState<User[]>([])
  const [siteId, setSiteId] = useState<number>()

  const [isModalOpen, setIsModalOpen] = useState(false)

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

      // TODO: In-form errors that are translated. To do with the validation refactoring
      if (dmsLatitude.cardinal == null) {
        openAlertSnackbar(
          'Latitude must be specified',
          { severity: 'error' },
        )
        return
      }
      if (dmsLongitude.cardinal == null) {
        openAlertSnackbar(
          'Longitude must be specified',
          { severity: 'error' },
        )
        return
      }

      // @typescript-eslint/no-unsafe-type-assertion
      // NOTE: Casting here isn't great (despite knowing that we just validated),
      // but we need to refactor how we validate forms anyway
      const latitude = coordinateToString(dmsLatitude as Coordinate)
      const longitude = coordinateToString(dmsLongitude as Coordinate)

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

    fetchAdmins().catch((error: unknown) =>
      openAlertSnackbar(getErrorMessage(error, translate('errors.fetch-admins-failed')),
      { severity: 'error' })
    )
  }, [currentUser?.role, fetchAdmins])

  useEffect(() => {
    const fetchSites = async () => setSiteSummaries(await getApiClient().summaryClient.all())

    fetchSites().catch((error: unknown) =>
      openAlertSnackbar(getErrorMessage(error, translate('errors.fetch-fertilizers-failed')),
      { severity: 'error' })
    )
  }, [getApiClient, setSiteSummaries])

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
          <h3 className='accordion-header rounded' id={`heading-${site.id}`}>
            {/* We use a div so the text stays selectable, but this is really used like a button */}
            {/* eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- see above */}
            <div
              aria-controls={`collapse-${site.id}`}
              aria-expanded='true'
              className='accordion-button collapsed rounded'
              data-bs-target={`#collapse-${site.id}`}
              data-bs-toggle='collapse'
              role='button'
            >
              <div className='d-flex justify-content-between align-items-center w-100 pe-3 fs-5'>
                <span>{site.name}</span>
                <small className='fw-bold text-muted fs-small'>
                  {translate('analytics.last-update')}: {lastModifiedBatchDate
                    ? formatDate(lastModifiedBatchDate)
                    : 'N/A'}
                </small>
                <span>
                  {site.batches.length}{' '}
                  {translate('analytics.batch', { count: site.batches.length })}
                </span>
              </div>
            </div>
          </h3>

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
          {
            // TODO: Implement batch search/filtering, in the mean time we show a simple title
            /* <div className='card p-3'>
            <div className='d-flex justify-content-between align-items-center'>
              <h2 className='fs-5'>{translate('analytics.batch-tracking')}</h2>
              <div>
                <span>TODO: Filters Go Here</span>
              </div>
            </div>
          </div> */
          }
          <h2 className='text-light'>{translate('analytics.batch-tracking')}</h2>

          <div className='accordion mt-4' id='accordion-batches'>
            {renderBatches()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
