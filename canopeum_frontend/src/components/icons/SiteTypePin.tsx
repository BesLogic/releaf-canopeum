import type { JSX } from 'react'

import CanopeumPin from '@assets/icons/pins/canopeum-pin.svg'
import CorporateLotPin from '@assets/icons/pins/corporate-lot-pin.svg'
import EducationalFacilityPin from '@assets/icons/pins/educational-facility-pin.svg'
import FarmsLandPin from '@assets/icons/pins/farms-land-pin.svg'
import IndegeniousCommunityPin from '@assets/icons/pins/indegenious-community-pin.svg'
import ParkPin from '@assets/icons/pins/park-pin.svg'

const pinMap: Record<number, JSX.Element> = {
  1: <img alt='CanopeumPin' src={CanopeumPin} />,
  2: <img alt='ParkPin' src={ParkPin} />,
  3: <img alt='IndegeniousCommunityPin' src={IndegeniousCommunityPin} />,
  4: <img alt='EducationalFacilityPin' src={EducationalFacilityPin} />,
  5: <img alt='FarmsLandPin' src={FarmsLandPin} />,
  6: <img alt='CorporateLotPin' src={CorporateLotPin} />,
}

type Props = { siteTypeId: keyof typeof pinMap }

const SiteTypePin = ({ siteTypeId }: Props) => pinMap[siteTypeId]
export default SiteTypePin
