import './MapPinIcon.scss'

import type { PropsWithChildren } from 'react'

import mapPinIconRaw from '@assets/icons/map-pin.svg?raw'

const MapPinIcon = (props: PropsWithChildren<{ readonly themeColor: string }>) => (
  <div className='map-pin-icon'>
    <i
      className={`map-pin-icon-background text-${props.themeColor}`}
      dangerouslySetInnerHTML={{ __html: mapPinIconRaw }}
    />
    <span className='text-light'>{props.children}</span>
  </div>
)
export default MapPinIcon
