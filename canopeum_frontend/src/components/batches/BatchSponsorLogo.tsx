import './BatchSponsorLogo.scss'

import { Tooltip } from '@mui/material'

import type { BatchSponsor } from '@services/api'
import { getApiBaseUrl } from '@services/apiSettings'

type Props = {
  readonly sponsor: BatchSponsor,
}

const BatchSponsorLogo = ({ sponsor }: Props) => (
  <Tooltip title={sponsor.name}>
    <a
      href={sponsor.url}
      rel='noreferrer'
      target='_blank'
    >
      <img
        alt={sponsor.name}
        className='site-sponsor-logo-img'
        src={`${getApiBaseUrl()}${sponsor.logo.asset}`}
      />
    </a>
  </Tooltip>
)

export default BatchSponsorLogo
