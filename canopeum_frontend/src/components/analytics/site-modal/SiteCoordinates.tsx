import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { type Coordinate, defaultLatitude, defaultLongitude } from '@models/types/Coordinate'

type Props = {
  readonly latitude?: Coordinate,
  readonly longitude?: Coordinate,
  readonly onChange: (latitude: Coordinate, longitude: Coordinate) => void,
}

const SiteCoordinates = ({ latitude, longitude, onChange }: Props) => {
  const { t } = useTranslation()
  const [lat, setLat] = useState<Coordinate>(latitude ?? defaultLatitude)
  const [long, setLong] = useState<Coordinate>(longitude ?? defaultLongitude)

  useEffect(() => onChange(lat, long), [lat, long])
  useEffect(() => latitude && setLat(latitude), [latitude])
  useEffect(() => longitude && setLong(longitude), [longitude])

  return (
    <>
      <label className='form-label text-capitalize' htmlFor='site-coordinates'>
        {t('analytics.site-modal.site-gps-coordinates')}
      </label>
      <div id='site-coordinates'>
        <div className='mb-2 ms-2'>
          <label className='form-label' htmlFor='site-dms-latitude'>
            {t('analytics.site-modal.site-dms-latitude')}
          </label>
          <div className='d-flex gap-1' id='site-dms-latitude'>
            <input
              className='form-control'
              id='site-dms-latitude-ddd'
              onChange={event =>
                setLat(current => ({ ...current, degrees: Number(event.target.value) }))}
              style={{ width: '5rem' }}
              type='number'
              value={lat.degrees}
            />
            <span>°</span>
            <input
              className='form-control'
              id='site-dms-latitude-mm'
              onChange={event =>
                setLat(current => ({ ...current, minutes: Number(event.target.value) }))}
              style={{ width: '5rem' }}
              type='number'
              value={lat.minutes}
            />
            <span>&rsquo;</span>
            <input
              className='form-control'
              id='site-dms-latitude-ss'
              onChange={event =>
                setLat(current => ({ ...current, seconds: Number(event.target.value) }))}
              style={{ width: '5rem' }}
              type='number'
              value={lat.seconds}
            />
            <span className='d-flex align-items-end'>.</span>
            <input
              className='form-control'
              id='site-dms-latitude-ssss'
              onChange={event =>
                setLat(current => ({ ...current, miliseconds: Number(event.target.value) }))}
              style={{ width: '5rem' }}
              type='number'
              value={lat.miliseconds}
            />
            <span>&rdquo;</span>
            <div className='d-flex gap-1 align-items-center text-center'>
              <input
                checked={lat.cardinal === 'N'}
                className='form-check-input'
                id='site-dms-latitude-cardinal-n'
                name='site-dms-latitude-cardinal'
                onChange={() => setLat(current => ({ ...current, cardinal: 'N' }))}
                type='radio'
              />
              <label className='form-check-label' htmlFor='site-dms-latitude-cardinal-n'>
                N
              </label>
              <input
                checked={lat.cardinal === 'S'}
                className='form-check-input'
                id='site-dms-latitude-cardinal-s'
                name='site-dms-latitude-cardinal'
                onChange={() => setLat(current => ({ ...current, cardinal: 'S' }))}
                type='radio'
                value='S'
              />
              <label className='form-check-label' htmlFor='site-dms-latitude-cardinal-s'>
                S
              </label>
            </div>
          </div>
        </div>
        <div className='mb-2 ms-2'>
          <label className='form-label' htmlFor='site-dms-longitude'>
            {t('analytics.site-modal.site-dms-longitude')}
          </label>
          <div className='d-flex gap-1' id='site-dms-longitude'>
            <input
              className='form-control'
              id='site-dms-longitude-ddd'
              onChange={event =>
                setLong(current => ({ ...current, degrees: Number(event.target.value) }))}
              style={{ width: '5rem' }}
              type='number'
              value={long.degrees}
            />
            <span>°</span>
            <input
              className='form-control'
              id='site-dms-longitude-mm'
              onChange={event =>
                setLong(current => ({ ...current, minutes: Number(event.target.value) }))}
              style={{ width: '5rem' }}
              type='number'
              value={long.minutes}
            />
            <span>&rsquo;</span>
            <input
              className='form-control'
              id='site-dms-longitude-ss'
              onChange={event =>
                setLong(current => ({ ...current, seconds: Number(event.target.value) }))}
              style={{ width: '5rem' }}
              type='number'
              value={long.seconds}
            />
            <span className='d-flex align-items-end'>.</span>
            <input
              className='form-control'
              id='site-dms-longitude-ssss'
              onChange={event =>
                setLong(current => ({ ...current, miliseconds: Number(event.target.value) }))}
              style={{ width: '5rem' }}
              type='number'
              value={long.miliseconds}
            />
            <span>&rdquo;</span>
            <div className='d-flex gap-1 align-items-center text-center'>
              <input
                checked={long.cardinal === 'W'}
                className='form-check-input'
                id='site-dms-longitude-cardinal-w'
                name='site-dms-longitude-cardinal'
                onChange={() => setLong(current => ({ ...current, cardinal: 'W' }))}
                type='radio'
              />
              <label className='form-check-label' htmlFor='site-dms-longitude-cardinal-w'>
                W
              </label>
              <input
                checked={long.cardinal === 'E'}
                className='form-check-input'
                id='site-dms-longitude-cardinal-e'
                name='site-dms-longitude-cardinal'
                onChange={() => setLong(current => ({ ...current, cardinal: 'E' }))}
                type='radio'
              />
              <label className='form-check-label' htmlFor='site-dms-longitude-cardinal-e'>
                E
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SiteCoordinates
