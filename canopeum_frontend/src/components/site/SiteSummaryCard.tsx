import headerLogo from '@assets/images/map/MARR4059.png'
import PrimaryIconBadge from '@components/PrimaryIconBadge'
import type { SiteSocial } from '@services/api'

type Props = {
  readonly site: SiteSocial,
}

const SiteSummaryCard = ({ site }: Props) => (
  <div className='card mb-3'>
    <div className='row g-0'>
      <div className='col-md-4'>
        {/* TODO: replace img source when backend offers an image endpoint */}
        <img alt='header logo' className='img-fluid' src={headerLogo} />
      </div>
      <div className='col-md-8'>
        <div className='card-body'>
          <h1 className='fw-bold card-title'>{site.name}</h1>
          <div className='card-text d-flex flex-row gap-1'>
            <PrimaryIconBadge type='school' />
            <h4 className='fw-bold text-primary'>{site.type.en}</h4>
          </div>
          <p className='card-text'>{site.description ?? ''}</p>
          <div className='container fw-bold'>
            <div className='mb-2'>
              <span className='material-symbols-outlined align-middle'>person</span>
              <span>Sponsors:</span>
            </div>
            <div className='row'>
              {[...site.sponsors, ...site.sponsors, ...site.sponsors, ...site.sponsors].map(sponsorName => (
                <div className='col-12 col-sm-6 col-md-4 col-lg-3 mb-3' key={sponsorName}>{sponsorName}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
export default SiteSummaryCard
