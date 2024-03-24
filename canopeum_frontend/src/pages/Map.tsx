import CanopeumPin from '@assets/icons/pins/canopeum-pin.svg'
import CorporateLotPin from '@assets/icons/pins/corporate-lot-pin.svg'
import EducationalFacilityPin from '@assets/icons/pins/educational-facility-pin.svg'
import FarmsLandPin from '@assets/icons/pins/farms-land-pin.svg'
import IndegeniousCommunityPin from '@assets/icons/pins/indegenious-community-pin.svg'
import ParkPin from '@assets/icons/pins/park-pin.svg'
import { useEffect, useState } from 'react'
import ReactMap, { GeolocateControl, Marker, NavigationControl, ScaleControl, type ViewState } from 'react-map-gl/maplibre'
import { Link } from 'react-router-dom'

import type { SiteMap } from '../services/api'
import api from '../services/apiInterface'

const pinMap = {
  '1': CanopeumPin,
  '2': ParkPin,
  '3': IndegeniousCommunityPin,
  '4': EducationalFacilityPin,
  '5': FarmsLandPin,
  '6': CorporateLotPin,
}

type MarkerEvent = {
  target: {
    _lngLat: {
      lat: number,
      lng: number,
    },
  },
}

const Map = () => {
  const [sites, setSites] = useState<SiteMap[]>([])
  const [selectedSiteId, setSelectedSiteId] = useState<number | undefined>(undefined)

  const [mapViewState, setMapViewState] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 5,
  })

  const fetchData = async () => {
    const response = await api().map.sites()
    setSites(response)
  }

  const getBrowserLocation = () =>
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      setMapViewState({ ...mapViewState, latitude, longitude })
    })

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
    getBrowserLocation()
  }, [])

  return (
    <div className='container-fluid p-0'>
      <div className='row m-0'>
        <div
          className='col-4'
          style={{ height: 'calc(100vh - 3.3rem)', overflowY: 'auto' }}
        >
          <div className='py-3 d-flex flex-column gap-3'>
            {sites.map(site => (
              <Link id={`${site.id}`} key={site.id} to={`/map/${site.id}`}>
                <div className={`card ${selectedSiteId === site.id && 'border border-secondary border-5'}`}>
                  <div className='row g-0'>
                    <div className='col-md-4'>
                      <img alt='' className='img-fluid rounded-start' src='' />
                    </div>
                    <div className='col-md-8'>
                      <div className='card-body'>
                        <h5>{site.name}</h5>
                        <h6 className='text-primary'>
                          <span className='material-symbols-outlined'>school</span> {site.siteType.en}
                        </h6>
                        <h6 className='text-black-50'>
                          <span className='material-symbols-outlined fill-icon'>location_on</span>{' '}
                          {site.coordinates.address}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className='col-8 d-flex p-0' style={{ height: 'calc(100vh - 3.3rem)' }}>
          <ReactMap
            {...mapViewState}
            mapStyle='https://api.maptiler.com/maps/satellite/style.json?key=fSPw19J7BbjcbrS5b5u6'
            onMove={event_ => onMapMove(event_.viewState)}
            style={{ width: '100%', height: '100%' }}
          >
            <GeolocateControl position='top-right' />
            <NavigationControl position='top-right' showCompass showZoom visualizePitch />
            <ScaleControl position='bottom-left' unit='metric' />
            {sites.map(site => (
              <Marker
                anchor='bottom'
                key={`${site.id}-${site.coordinates.latitude}-${site.coordinates.longitude}`}
                latitude={site.coordinates.latitude}
                longitude={site.coordinates.longitude}
                onClick={event => onMarkerClick(event, site)}
                style={{ cursor: 'pointer' }}
              >
                <img alt='' src={pinMap[site.siteType.id]} />
              </Marker>
            ))}
          </ReactMap>
        </div>
      </div>
    </div>
  )
}
export default Map
