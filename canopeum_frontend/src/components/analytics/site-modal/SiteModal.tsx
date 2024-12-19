import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ImageUpload from '@components/analytics/ImageUpload'
import SiteCoordinates from '@components/analytics/site-modal/SiteCoordinates'
import TreeSpeciesSelector from '@components/analytics/TreeSpeciesSelector'
import { LanguageContext } from '@components/context/LanguageContext'
import { SnackbarContext } from '@components/context/SnackbarContext'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import { type DefaultCoordinate, defaultLatitude, defaultLongitude, extractCoordinate } from '@models/Coordinate'
import { type SiteType, Species } from '@services/api'
import { getApiBaseUrl } from '@services/apiSettings'
import { mapSum } from '@utils/arrayUtils'

type Props = {
  readonly open: boolean,
  readonly handleClose: (
    reason: 'backdropClick' | 'escapeKeyDown' | 'save' | 'cancel',
    data?: SiteDto,
  ) => void,
  readonly siteId: number | undefined,
}

export type SiteDto = {
  siteName?: string,
  siteType?: number,
  siteImage?: File,
  dmsLatitude: DefaultCoordinate,
  dmsLongitude: DefaultCoordinate,
  presentation?: string,
  size?: number,
  species: Species[],
  researchPartner?: boolean,
  visibleOnMap?: boolean,
}

const defaultSiteDto: SiteDto = {
  dmsLatitude: defaultLatitude,
  dmsLongitude: defaultLongitude,
  species: [],
  researchPartner: true,
  visibleOnMap: true,
}

const SiteModal = ({ open, handleClose, siteId }: Props) => {
  const { t } = useTranslation()
  const { getApiClient } = useApiClient()
  const { translateValue } = useContext(LanguageContext)
  const { getErrorMessage } = useErrorHandling()
  const { openAlertSnackbar } = useContext(SnackbarContext)

  const [site, setSite] = useState(defaultSiteDto)
  const [availableSiteTypes, setAvailableSiteTypes] = useState<SiteType[]>([])
  const [siteImageURL, setSiteImageURL] = useState<string>()

  const fetchSite = useCallback(async () => {
    if (!siteId) {
      // Clear the image that could come from having opened the modal with a previous site
      setSiteImageURL(undefined)

      return
    }

    const siteDetail = await getApiClient().siteClient.detail(siteId)
    const { dmsLatitude, dmsLongitude } = siteDetail.coordinate

    const imgResponse = await fetch(`${getApiBaseUrl()}${siteDetail.image.asset}`)
    const blob = await imgResponse.blob()

    setSite({
      siteName: siteDetail.name,
      siteType: siteDetail.siteType.id,
      siteImage: new File([blob], 'temp', { type: blob.type }),
      dmsLatitude: dmsLatitude
        ? extractCoordinate(dmsLatitude)
        : defaultLatitude,
      dmsLongitude: dmsLongitude
        ? extractCoordinate(dmsLongitude)
        : defaultLongitude,
      presentation: siteDetail.description,
      size: Number(siteDetail.size),
      species: siteDetail.siteTreeSpecies.map(specie => new Species(specie)),
      researchPartner: siteDetail.researchPartnership,
      visibleOnMap: siteDetail.visibleMap,
    })
    setSiteImageURL(URL.createObjectURL(blob))
  }, [siteId, getApiClient])

  const onImageUpload = (file: File) => {
    setSite(value => ({ ...value, siteImage: file }))
    setSiteImageURL(URL.createObjectURL(file))
  }

  useEffect(() => {
    const fetchSiteTypes = async () =>
      setAvailableSiteTypes(await getApiClient().siteClient.types())


    fetchSiteTypes().catch((error: unknown) =>
      openAlertSnackbar(
        getErrorMessage(error, t('errors.fetch-site-types-failed'))
      )
    )
  }, [])

  useEffect(() => {
    if (!open) return

    fetchSite().catch((error: unknown) =>
      openAlertSnackbar(
        getErrorMessage(error, t('errors.fetch-site-failed'))
      )
    )
  }, [])

  useEffect(() => setSite(defaultSiteDto), [siteId])

  return (
    <Dialog fullWidth maxWidth='sm' onClose={(_, reason) => handleClose(reason)} open={open}>
      <DialogTitle>
        {t(
          siteId
            ? 'analytics.edit-site-info'
            : 'analytics.create-site',
        )}
      </DialogTitle>

      <DialogContent>
        <form className='d-flex flex-column gap-3'>
          <div>
            <label className='form-label' htmlFor='site-name'>
              {t('analytics.site-modal.site-name')}
            </label>
            <input
              className='form-control'
              id='site-name'
              onChange={event => setSite(value => ({ ...value, siteName: event.target.value }))}
              type='text'
              value={site.siteName}
            />
          </div>

          <div>
            <label className='form-label' htmlFor='site-type'>
              {t('analytics.site-modal.site-type')}
            </label>
            <select
              className='form-select'
              id='site-type'
              onChange={event =>
                setSite(current => ({ ...current, siteType: Number(event.target.value) }))}
              value={site.siteType ?? availableSiteTypes[0]?.id}
            >
              {availableSiteTypes.map(value => (
                <option key={`available-specie-${value.id}`} value={value.id}>
                  {translateValue(value)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='form-label' htmlFor='site-image'>
              {t('analytics.site-modal.site-image')}
            </label>
            <ImageUpload id='site-image-upload' imageUrl={siteImageURL} onChange={onImageUpload} />
          </div>

          <SiteCoordinates
            latitude={site.dmsLatitude}
            longitude={site.dmsLongitude}
            onChange={(latitude, longitude) =>
              setSite(current => ({
                ...current,
                dmsLatitude: latitude,
                dmsLongitude: longitude,
              }))}
          />

          <div>
            <label className='form-label' htmlFor='site-presentation'>
              {t('analytics.site-modal.site-presentation')}
            </label>
            <textarea
              className='form-control'
              id='site-presentation'
              onChange={event => setSite(value => ({ ...value, presentation: event.target.value }))}
              value={site.presentation}
            />
          </div>

          <div>
            <label className='form-label' htmlFor='site-size'>
              {t('analytics.site-modal.site-size')}
            </label>
            <div className='input-group'>
              <input
                className='form-control'
                id='site-size'
                onChange={event =>
                  setSite(value => ({ ...value, size: Number(event.target.value) }))}
                type='number'
                value={site.size}
              />
              <span className='input-group-text'>ft²</span>
            </div>
          </div>

          <TreeSpeciesSelector
            label='analytics.site-modal.site-tree-species'
            onChange={species =>
              setSite(current => ({
                ...current,
                species,
              }))}
            species={site.species}
          />

          <div>
            <label className='form-label'>
              {t('analyticsSite.batch-modal.total-number-of-plants-label')}:&nbsp;
            </label>
            <span>{mapSum(site.species, 'quantity')}</span>
          </div>

          <div>
            <label className='form-label' htmlFor='site-research-partner'>
              {t('analytics.site-modal.site-research-partner')}
            </label>
            <div
              className='d-flex'
              id='site-research-partner'
            >
              <div className='col form-check form-check-inline'>
                <input
                  checked={!!site.researchPartner}
                  className='form-check-input'
                  id='research-partner-yes'
                  name='research-partner'
                  onChange={() => setSite(current => ({ ...current, researchPartner: true }))}
                  type='radio'
                />
                <label className='form-check-label' htmlFor='research-partner-yes'>
                  {t('analytics.site-modal.yes')}
                </label>
              </div>

              <div className='col form-check form-check-inline'>
                <input
                  checked={!site.researchPartner}
                  className='form-check-input'
                  id='research-partner-no'
                  name='research-partner'
                  onChange={() => setSite(current => ({ ...current, researchPartner: false }))}
                  type='radio'
                />
                <label className='form-check-label' htmlFor='research-partner-no'>
                  {t('analytics.site-modal.no')}
                </label>
              </div>

              <div className='col' /> {/* spacer */}
            </div>
          </div>

          <div>
            <label className='form-label' htmlFor='site-map-visibility'>
              {t('analytics.site-modal.site-map-visibility')}
            </label>
            <div
              className='d-flex'
              id='site-map-visibility'
            >
              <div className='col form-check form-check-inline'>
                <input
                  checked={!!site.visibleOnMap}
                  className='form-check-input'
                  id='map-visible'
                  name='map-visibility'
                  onChange={() => setSite(current => ({ ...current, visibleOnMap: true }))}
                  type='radio'
                />
                <label className='form-check-label' htmlFor='map-visible'>
                  {t('analytics.site-modal.visible')}
                </label>
              </div>

              <div className='col form-check form-check-inline'>
                <input
                  checked={!site.visibleOnMap}
                  className='form-check-input'
                  id='map-invisible'
                  name='map-visibility'
                  onChange={() => setSite(current => ({ ...current, visibleOnMap: false }))}
                  type='radio'
                />
                <label className='form-check-label' htmlFor='map-invisible'>
                  {t('analytics.site-modal.invisible')}
                </label>
              </div>

              <div className='col' /> {/* spacer */}
            </div>
          </div>
        </form>
      </DialogContent>

      <DialogActions>
        <button
          className='btn btn-outline-primary'
          onClick={() => handleClose('cancel')}
          type='button'
        >
          {t('generic.cancel')}
        </button>
        <button className='btn btn-primary' onClick={() => handleClose('save', site)} type='button'>
          {t('generic.submit')}
        </button>
      </DialogActions>
    </Dialog>
  )
}
export default SiteModal
