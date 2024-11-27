import './MapPage.scss'

import type { Marker as MarkerInstance } from 'maplibre-gl'
import { useCallback, useEffect, useState } from 'react'
import type { MarkerEvent } from 'react-map-gl/dist/esm/types'
import ReactMap, { GeolocateControl, Marker, NavigationControl, ScaleControl, type ViewState } from 'react-map-gl/maplibre'
import { Link } from 'react-router-dom'

import SiteTypePin from '@components/assets/SiteTypePin'
import { appRoutes } from '@constants/routes.constant'
import useApiClient from '@hooks/ApiClientHook'
import { getSiteTypeIconKey, type SiteTypeID } from '@models/SiteType'
import type { SiteMap } from '@services/api'
import { getApiBaseUrl } from '@services/apiSettings'

const PIN_FOCUS_ZOOM_LEVEL = 15

/**
 * The initial map location if the user doesn't provide location
 */
const initialMapLocation = (sites: SiteMap[]) => {
  // eslint-disable-next-line unicorn/no-array-reduce -- Find the middle point between all sites
  const { minLat, maxLat, minLong, maxLong } = sites.reduce(
    (previous, current) => {
      // Unset or invalid coordinate should be ignored when trying to pin the center of all sites
      if (!current.coordinates.latitude || !current.coordinates.longitude) return previous

      return {
        minLat: Math.min(previous.minLat, current.coordinates.latitude),
        maxLat: Math.max(previous.maxLat, current.coordinates.latitude),
        minLong: Math.min(previous.minLong, current.coordinates.longitude),
        maxLong: Math.max(previous.maxLong, current.coordinates.longitude),
      }
    },
    { minLat: 90, maxLat: -90, minLong: 180, maxLong: -180 },
  )

  return {
    latitude: (maxLat + minLat) / 2,
    longitude: (maxLong + minLong) / 2,
    zoom: Math.min((maxLat - minLat) * 2, (maxLong - minLong) * 2),
  }
}

const MapPage = () => {
  const { getApiClient } = useApiClient()

  const [sites, setSites] = useState<SiteMap[]>([])
  const [selectedSiteId, setSelectedSiteId] = useState<number | undefined>()

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

  const onMarkerClick = (event: MarkerEvent<MarkerInstance, MouseEvent>, site: SiteMap) => {
    const { lat, lng } = event.target._lngLat
    setMapViewState({
      latitude: lat,
      longitude: lng,
      zoom: PIN_FOCUS_ZOOM_LEVEL,
    })
    setSelectedSiteId(site.id)
    document.getElementById(`${site.id}`)?.scrollIntoView({ behavior: 'smooth' })
  }

  const onMapMove = (viewState: ViewState) => {
    setMapViewState(viewState)
    setSelectedSiteId(undefined)
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
    <div className='container-fluid p-0'>
      <div className='row flex-row-reverse m-0' id='map-page-row-container'>
        <div
          className='col-12 col-lg-8 d-flex p-0'
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
              const latitude = Number(site.coordinates.latitude)
              const longitude = Number(site.coordinates.longitude)

              return (
                <Marker
                  anchor='bottom'
                  key={`${site.id}-${latitude}-${longitude}`}
                  latitude={latitude}
                  longitude={longitude}
                  onClick={event => onMarkerClick(event, site)}
                  style={{ cursor: 'pointer' }}
                >
                  <SiteTypePin siteTypeId={site.siteType.id as SiteTypeID} />
                </Marker>
              )
            })}
          </ReactMap>
        </div>

        <div
          className='col-12 col-lg-4 h-100'
          id='map-sites-list-container'
        >
          <div className='py-3 d-flex flex-column gap-3'>
            {sites.map(site => (
              <div
                className={`card ${
                  selectedSiteId === site.id
                    ? 'border border-secondary border-5'
                    : ''
                }`}
                key={site.id}
              >
                <Link
                  className='stretched-link list-group-item-action'
                  id={`${site.id}`}
                  to={appRoutes.siteSocial(site.id)}
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

                        <h6 className='d-flex align-items-center text-black-50'>
                          <span className='material-symbols-outlined fill-icon'>location_on</span>
                          <span className='ms-1'>{site.coordinates.address}</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default MapPage
