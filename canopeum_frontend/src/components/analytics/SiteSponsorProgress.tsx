import { useTranslation } from 'react-i18next'

type Props = {
  readonly progress: number,
}

const SiteSponsorProgress = ({ progress }: Props) => {
  const { t: translate } = useTranslation()

  return (
    <div className='d-flex align-items-center'>
      <div className='flex-grow-1 progress'>
        {/* this is how the bootstrap component is built */}
        {/* eslint-disable-next-line jsx-a11y/prefer-tag-over-role -- See above */}
        <div
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress}
          className='progress-bar'
          role='progressbar'
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className='text-primary ms-2 fw-bold'>
        {Math.round(progress)}% {translate('analytics.site-summary.sponsored')}
      </span>
    </div>
  )
}

export default SiteSponsorProgress
