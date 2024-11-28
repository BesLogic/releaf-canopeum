import './MapPage.scss'

import type { Marker as MarkerInstance } from 'maplibre-gl'
import { type CSSProperties, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { MarkerEvent } from 'react-map-gl/dist/esm/types'
import ReactMap, { GeolocateControl, Marker, NavigationControl, ScaleControl, type ViewState } from 'react-map-gl/maplibre'
import { Link, useSearchParams } from 'react-router-dom'

import SiteTypePin from '@components/assets/SiteTypePin'
import { appRoutes } from '@constants/routes.constant'
import useApiClient from '@hooks/ApiClientHook'
import { getSiteTypeIconKey, type SiteTypeID } from '@models/SiteType'
import type { SiteMap } from '@services/api'
import { getApiBaseUrl } from '@services/apiSettings'

const PIN_FOCUS_ZOOM_LEVEL = 15
const MAP_DISTANCE_ZOOM_MULTIPLIER = 20

/**
 * The initial map location if the user doesn't provide location
 */
const initialMapLocation = (sites: SiteMap[]) => {
  // eslint-disable-next-line unicorn/no-array-reduce -- Find the middle point between all sites
  const { minLat, maxLat, minLong, maxLong } = sites.reduce(
    (previous, current) => {
      // Unset or invalid coordinate should be ignored when trying to pin the center of all sites
      if (!current.coordinate.ddLatitude || !current.coordinate.ddLongitude) return previous

      return {
        minLat: Math.min(previous.minLat, current.coordinate.ddLatitude),
        maxLat: Math.max(previous.maxLat, current.coordinate.ddLatitude),
        minLong: Math.min(previous.minLong, current.coordinate.ddLongitude),
        maxLong: Math.max(previous.maxLong, current.coordinate.ddLongitude),
      }
    },
    { minLat: 90, maxLat: -90, minLong: 180, maxLong: -180 },
  )

  return {
    // Center the map to the middle point between all sites
    latitude: (maxLat + minLat) / 2,
    longitude: (maxLong + minLong) / 2,
    // min to take the most zoomed out between latitude or longitude
    zoom: Math.min(
      // 0 is max zoomed out, so we use an "inverse" (1 / x)
      // The bigger the distance (max - min), the lower the zoom
      (1 / (maxLat - minLat)) * MAP_DISTANCE_ZOOM_MULTIPLIER,
      (1 / (maxLong - minLong)) * MAP_DISTANCE_ZOOM_MULTIPLIER,
    ),
  }
}

const MapPage = () => {
  const { getApiClient } = useApiClient()
  const { t } = useTranslation()
  const [sites, setSites] = useState<SiteMap[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedSiteId, setSelectedSiteId] = useState(
    Number(searchParams.get('site')) || null,
  )

  const [mapViewState, setMapViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: PIN_FOCUS_ZOOM_LEVEL,
  })

  const fetchData = useCallback(async () => {
    const response = await getApiClient().siteClient.map()
    setSites(response)
    return response
  }, [getApiClient])

  const onSelectSite = (
    site: SiteMap,
    mapMarkerEvent?: MarkerEvent<MarkerInstance, MouseEvent>,
  ) => {
    const latitude = mapMarkerEvent?.target._lngLat.lat ?? site.coordinate.ddLatitude
    const longitude = mapMarkerEvent?.target._lngLat.lng ?? site.coordinate.ddLongitude
    if (!latitude || !longitude) return

    setMapViewState({
      latitude,
      longitude,
      zoom: PIN_FOCUS_ZOOM_LEVEL,
    })
    setSelectedSiteId(site.id)
    searchParams.set('site', site.id.toString())
    setSearchParams(searchParams)
    if (mapMarkerEvent) {
      // Clicked from map, scroll card into view
      document.getElementById(`site-card-${site.id}`)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Clicked from card, scroll to top for mobile
      window.scrollTo({ behavior: 'smooth', top: 0 })
    }
  }

  const onMapMove = (viewState: ViewState) => {
    setMapViewState(viewState)
    setSelectedSiteId(null)
  }

  useEffect(() =>
    void Promise.all([
      fetchData(),
      new Promise(
        (
          resolve: (position: GeolocationPosition | GeolocationPositionError) => void,
          _reject,
        ): void => {
          /* eslint-disable-next-line sonarjs/no-intrusive-permissions
          -- We only ask when the map is rendered */
          navigator.geolocation.getCurrentPosition(resolve, resolve)
        },
      ),
    ]).then(([fetchedSites, position]) =>
      'code' in position
        // If there's an error obtaining the user position, use our default position instead
        // Note that getCurrentPosition always error code 2 in http
        ? setMapViewState(mvs => ({
          ...mvs,
          ...initialMapLocation(fetchedSites),
        }))
        // Otherwise focus on the user's position
        : setMapViewState(mvs => ({
          ...mvs,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }))
    ), [fetchData])

  return (
    <div className='container-fluid p-0 h-100'>
      <div className='row flex-row-reverse m-0' id='map-page-row-container'>
        <div
          className='col-12 col-lg-8 d-flex '
          id='map-container'
        >
          <ReactMap
            {...mapViewState}
            mapStyle='https://api.maptiler.com/maps/satellite/style.json?key=fSPw19J7BbjcbrS5b5u6'
            onMove={event_ => onMapMove(event_.viewState)}
            style={{ width: '100%', height: '100%' }}
          >
            <GeolocateControl position='top-right' />
            <NavigationControl position='top-right' showCompass showZoom visualizePitch />
            <ScaleControl position='bottom-left' unit='metric' />
            {sites.map(site => {
              const latitude = Number(site.coordinate.ddLatitude)
              const longitude = Number(site.coordinate.ddLongitude)

              return (
                <Marker
                  anchor='bottom'
                  key={`${site.id}-${latitude}-${longitude}`}
                  latitude={latitude}
                  longitude={longitude}
                  onClick={event => onSelectSite(site, event)}
                  style={{ cursor: 'pointer' }}
                >
                  <SiteTypePin siteTypeId={site.siteType.id as SiteTypeID} />
                </Marker>
              )
            })}
          </ReactMap>
        </div>

        <div className='col-12 col-lg-4 h-100 py-3' id='map-sites-list-container'>
          <div className='d-flex flex-column gap-3'>
            {sites.map(site => (
              <div
                className={`card ${
                  selectedSiteId === site.id
                    ? 'shadow '
                    : ''
                }`}
                id={`site-card-${site.id}`}
                key={site.id}
                style={{ '--bs-box-shadow': '0 0 0 0.25rem var(--bs-secondary)' } as CSSProperties}
              >
                <button
                  className='stretched-link list-group-item-action unstyled-button rounded'
                  onClick={() => onSelectSite(site)}
                  type='button'
                >
                  <div className='row g-0 h-100'>
                    <div className='col-lg-4'>
                      <img
                        alt=''
                        className='h-100 mw-100 map-site-image'
                        src={getApiBaseUrl() + site.image.asset}
                      />
                    </div>

                    <div className='col-lg-8'>
                      <div className='card-body'>
                        <h5>{site.name}</h5>

                        <h6 className='d-flex align-items-center text-primary'>
                          <span className='material-symbols-outlined'>
                            {getSiteTypeIconKey(site.siteType.id)}
                          </span>
                          <span className='ms-1'>{site.siteType.en}</span>
                        </h6>

                        <h6 className='d-flex align-items-center gap-1 text-muted'>
                          <span className='material-symbols-outlined fill-icon'>location_on</span>
                          {site.coordinate.address ?? t('analytics.site-summary.unknown')}
                        </h6>

                        <Link
                          className='fw-bold text-secondary link-inner-underline'
                          onClick={event => event.stopPropagation()}
                          // special styles needed for link-in-button hover
                          style={{ position: 'relative', zIndex: 2 }}
                          to={appRoutes.siteSocial(site.id)}
                        >
                          <span className='me-1'>{t('social.visit-site')}</span>
                          <span className='
                            material-symbols-outlined
                            align-top
                            text-decoration-none
                          '>
                            arrow_forward
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default MapPage
