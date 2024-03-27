import type { SiteSummary } from '@services/api'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type Props = {
  readonly site: SiteSummary,
}

const SiteSummaryCard = ({ site }: Props) => {
  const { t: translate } = useTranslation()

  return (
    <div
      className='col-3'
      key={site.name}
    >
      <Link className='nav-link' to={`/analytics/${site.id}`}>
        <div className='card h-100 w-100 py-3'>
          <div className='card-body d-flex flex-column h-100'>
            <div className='d-flex align-items-center card-title'>
              <div className='bg-primary rounded-circle d-flex justify-content-center align-items-center p-1 me-2'>
                <span className='material-symbols-outlined text-light'>school</span>
              </div>
              <h5 className='mb-0'>{site.name ?? 'Unnamed site'}</h5>
            </div>

            <div className='card-subtitle my-1'>
              <div className='d-flex align-items-center text-muted'>
                <span className='material-symbols-outlined fill-icon text-muted me-1'>location_on</span>
                <span>Missing Location</span>
              </div>
              <div className='d-flex align-items-center text-muted'>
                <span className='material-symbols-outlined fill-icon text-muted me-1'>person</span>
                <span>Missing Owner</span>
              </div>
            </div>

            <div className='card-text mt-2'>
              <div className='row my-2'>
                <div className='col-4 d-flex flex-column align-items-center'>
                  <div className='bg-primary rounded-circle d-flex justify-content-center align-items-center p-2'>
                    <span className='material-symbols-outlined text-light'>psychiatry</span>
                  </div>
                  <span>{site.plantCount}</span>
                  <span className='text-muted'>{translate('analytics.site-summary.planted')}</span>
                </div>

                <div className='col-4 d-flex flex-column align-items-center'>
                  <div className='bg-primary rounded-circle d-flex justify-content-center align-items-center p-2'>
                    <span className='material-symbols-outlined text-light'>forest</span>
                  </div>
                  <span>{site.survivedCount}</span>
                  <span className='text-muted'>{translate('analytics.site-summary.survived')}</span>
                </div>

                <div className='col-4 d-flex flex-column align-items-center'>
                  <div className='bg-primary rounded-circle d-flex justify-content-center align-items-center p-2'>
                    <span className='material-symbols-outlined text-light'>forest</span>
                  </div>
                  <span>{site.propagationCount}</span>
                  <span className='text-muted'>{translate('analytics.site-summary.propagation')}</span>
                </div>
              </div>

              <div className='mt-4 d-flex align-items-center'>
                <div className='flex-grow-1 progress'>
                  <div
                    aria-valuemax={100}
                    aria-valuemin={0}
                    aria-valuenow={site.progress}
                    className='progress-bar'
                    role='progressbar'
                    style={{ width: `${site.progress}%` }}
                  />
                </div>

                <span className='text-primary ms-2'>
                  {Math.round(site.progress)}% {translate('analytics.site-summary.sponsored')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
export default SiteSummaryCard
