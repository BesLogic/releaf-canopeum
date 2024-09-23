import { useTranslation } from 'react-i18next'

import { type Coordinate, defaultLatitude, defaultLongitude } from '@models/types/Coordinate'

type Props = {
  readonly latitude?: Coordinate,
  readonly longitude?: Coordinate,
  readonly onChange: (latitude: Coordinate, longitude: Coordinate) => void,
}

const SiteCoordinates = (
  { latitude = defaultLatitude, longitude = defaultLongitude, onChange }: Props,
) => {
  const { t } = useTranslation()

  const updateCoordinates = (
    partialCoordinates: Partial<Coordinate>,
    type: 'latitude' | 'longitude',
  ) =>
    onChange(
      type === 'latitude'
        ? { ...latitude, ...partialCoordinates }
        : latitude,
      type === 'longitude'
        ? { ...longitude, ...partialCoordinates }
        : longitude,
    )

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
                updateCoordinates({ degrees: Number(event.target.value) }, 'latitude')}
              style={{ width: '5rem' }}
              type='number'
              value={latitude.degrees}
            />
            <span>°</span>
            <input
              className='form-control'
              id='site-dms-latitude-mm'
              onChange={event =>
                updateCoordinates({ minutes: Number(event.target.value) }, 'latitude')}
              style={{ width: '5rem' }}
              type='number'
              value={latitude.minutes}
            />
            <span>&rsquo;</span>
            <input
              className='form-control'
              id='site-dms-latitude-ss'
              onChange={event =>
                updateCoordinates({ seconds: Number(event.target.value) }, 'latitude')}
              style={{ width: '5rem' }}
              type='number'
              value={latitude.seconds}
            />
            <span className='d-flex align-items-end'>.</span>
            <input
              className='form-control'
              id='site-dms-latitude-ssss'
              onChange={event =>
                updateCoordinates({ miliseconds: Number(event.target.value) }, 'latitude')}
              style={{ width: '5rem' }}
              type='number'
              value={latitude.miliseconds}
            />
            <span>&rdquo;</span>
            <div className='d-flex gap-1 align-items-center text-center'>
              <input
                checked={latitude.cardinal === 'N'}
                className='form-check-input'
                id='site-dms-latitude-cardinal-n'
                name='site-dms-latitude-cardinal'
                onChange={() => updateCoordinates({ cardinal: 'N' }, 'latitude')}
                type='radio'
              />
              <label className='form-check-label' htmlFor='site-dms-latitude-cardinal-n'>
                N
              </label>
              <input
                checked={latitude.cardinal === 'S'}
                className='form-check-input'
                id='site-dms-latitude-cardinal-s'
                name='site-dms-latitude-cardinal'
                onChange={() => updateCoordinates({ cardinal: 'S' }, 'latitude')}
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
                updateCoordinates({ degrees: Number(event.target.value) }, 'longitude')}
              style={{ width: '5rem' }}
              type='number'
              value={longitude.degrees}
            />
            <span>°</span>
            <input
              className='form-control'
              id='site-dms-longitude-mm'
              onChange={event =>
                updateCoordinates({ minutes: Number(event.target.value) }, 'longitude')}
              style={{ width: '5rem' }}
              type='number'
              value={longitude.minutes}
            />
            <span>&rsquo;</span>
            <input
              className='form-control'
              id='site-dms-longitude-ss'
              onChange={event =>
                updateCoordinates({ seconds: Number(event.target.value) }, 'longitude')}
              style={{ width: '5rem' }}
              type='number'
              value={longitude.seconds}
            />
            <span className='d-flex align-items-end'>.</span>
            <input
              className='form-control'
              id='site-dms-longitude-ssss'
              onChange={event =>
                updateCoordinates({ miliseconds: Number(event.target.value) }, 'longitude')}
              style={{ width: '5rem' }}
              type='number'
              value={longitude.miliseconds}
            />
            <span>&rdquo;</span>
            <div className='d-flex gap-1 align-items-center text-center'>
              <input
                checked={longitude.cardinal === 'W'}
                className='form-check-input'
                id='site-dms-longitude-cardinal-w'
                name='site-dms-longitude-cardinal'
                onChange={() => updateCoordinates({ cardinal: 'W' }, 'longitude')}
                type='radio'
              />
              <label className='form-check-label' htmlFor='site-dms-longitude-cardinal-w'>
                W
              </label>
              <input
                checked={longitude.cardinal === 'E'}
                className='form-check-input'
                id='site-dms-longitude-cardinal-e'
                name='site-dms-longitude-cardinal'
                onChange={() => updateCoordinates({ cardinal: 'E' }, 'longitude')}
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
