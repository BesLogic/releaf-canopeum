import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ONE_HUNDRED = 100

type Props = {
  readonly totalPlantCount: number,
  readonly sponsoredPlantCount: number,
}

const SiteSponsorProgress = ({ totalPlantCount, sponsoredPlantCount }: Props) => {
  const { t: translate } = useTranslation()

  const [sponsoredProgress, setSponsoredProgress] = useState(0)

  useEffect(() => {
    if (totalPlantCount === 0) {
      setSponsoredProgress(0)

      return
    }

    if (sponsoredPlantCount >= totalPlantCount) {
      setSponsoredProgress(ONE_HUNDRED)

      return
    }

    /* total-functions/no-unsafe-type-assertion --
    NOTE: Total plant count checked above, case when 0 is handled */
    setSponsoredProgress(sponsoredPlantCount / totalPlantCount * ONE_HUNDRED)
  }, [totalPlantCount, sponsoredPlantCount])

  return (
    <div className='d-flex align-items-center'>
      <div className='flex-grow-1 progress'>
        {/* this is how the bootstrap component is built */}
        {/* eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- See above */}
        <div
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={sponsoredProgress}
          className='progress-bar'
          role='progressbar'
          style={{ width: `${sponsoredProgress}%` }}
        />
      </div>

      <span className='text-primary ms-2 fw-bold'>
        {Math.round(sponsoredProgress)}% {translate('analytics.site-summary.sponsored')}
      </span>
    </div>
  )
}

export default SiteSponsorProgress
