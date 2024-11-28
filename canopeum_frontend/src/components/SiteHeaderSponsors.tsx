import { useTranslation } from 'react-i18next'

import BatchSponsorLogo from '@components/batches/BatchSponsorLogo'
import type { BatchSponsor } from '@services/api'

type Props = {
  readonly sponsors: BatchSponsor[],
}

const SiteHeaderSponsors = (props: Props) => {
  const { t } = useTranslation()

  return (
    <div className='d-flex flex-wrap gap-2 align-items-center'>
      <label className='fw-bold'>
        <span className='material-symbols-outlined align-bottom'>group</span>
        <span className='ms-1'>{t('analyticsSite.sponsors')}:</span>
      </label>
      <div className='d-flex flex-wrap gap-4'>
        {props.sponsors.map(sponsor => <BatchSponsorLogo key={sponsor.id} sponsor={sponsor} />)}
      </div>
    </div>
  )
}

export default SiteHeaderSponsors
