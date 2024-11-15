import './Map.scss'

import { useCallback, useEffect, useState } from 'react'
import ReactMap, { GeolocateControl, Marker, NavigationControl, ScaleControl, type ViewState } from 'react-map-gl/maplibre'
import { Link } from 'react-router-dom'

import CanopeumPin from '@assets/icons/pins/canopeum-pin.svg'
import CorporateLotPin from '@assets/icons/pins/corporate-lot-pin.svg'
import EducationalFacilityPin from '@assets/icons/pins/educational-facility-pin.svg'
import FarmsLandPin from '@assets/icons/pins/farms-land-pin.svg'
import IndegeniousCommunityPin from '@assets/icons/pins/indegenious-community-pin.svg'
import ParkPin from '@assets/icons/pins/park-pin.svg'
import { appRoutes } from '@constants/routes.constant'
import useApiClient from '@hooks/ApiClientHook'
import type { SiteMap } from '@services/api'
import { getApiBaseUrl } from '@services/apiSettings'

const pinMap: Record<number, string> = {
  1: CanopeumPin,
  2: ParkPin,
  3: IndegeniousCommunityPin,
  4: EducationalFacilityPin,
  5: FarmsLandPin,
  6: CorporateLotPin,
}

type MarkerEvent = {
  target: {
    _lngLat: {
      lat: number,
      lng: number,
    },
  },
}

const MapPage = () => {
  const { getApiClient } = useApiClient()

  const [sites, setSites] = useState<SiteMap[]>([])
  const [selectedSiteId, setSelectedSiteId] = useState<number | undefined>()

  const [mapViewState, setMapViewState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 5,
  })

  const fetchData = useCallback(async () => {
    const response = await getApiClient().siteClient.map()
    setSites(response)
  }, [getApiClient])

  const onMarkerClick = (event: MarkerEvent, site: SiteMap) => {
    const { lat, lng } = event.target._lngLat
    setMapViewState({
      latitude: lat,
      longitude: lng,
      zoom: 15,
    })
    setSelectedSiteId(site.id)
    document.getElementById(`${site.id}`)?.scrollIntoView({ behavior: 'smooth' })
  }

  const onMapMove = (viewState: ViewState) => {
    setMapViewState(viewState)
    setSelectedSiteId(undefined)
  }

  useEffect(() => {
    void fetchData()

    /* eslint-disable-next-line sonarjs/no-intrusive-permissions
    -- We only ask when the map is rendered */
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      setMapViewState(mvs => ({ ...mvs, latitude, longitude }))
    })
  }, [fetchData])

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
                  <img alt='' src={pinMap[site.siteType.id]} />
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
                          <span className='material-symbols-outlined'>school</span>
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
