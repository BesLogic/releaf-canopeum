import headerLogo from '@assets/images/map/MARR4059.png'

import type { SiteSocial } from '../../services/api'

type Props = {
  readonly site: SiteSocial
}

const SiteSummaryCard = ({ site }: Props) => (
  <div className='bg-white rounded-4 d-flex flex-row gap-0'>

    {/* TODO: replace img source when backend offers an image endpoint */}
    <img alt='header logo' height={352} src={headerLogo} width={553} />
    <div className='d-flex flex-column px-5 py-5'>
      <h1 className='fw-bold'>{site.name}</h1>

      <div className='d-flex flex-row gap-1'>
        <div className='text-bg-primary rounded-4 text=center h-75 px-1'>
          <span className='material-symbols-outlined text-light align-middle'
            style={{ width: 21, fontSize: 24, marginLeft: -2, marginRight: 2 }}>school</span>
        </div>
        <h4 className='fw-bold text-primary'>{site.type.en}</h4>
      </div>
      <p>{site.description ?? ''}</p>
      <div className="container">
        <div className="row row-cols-5 fw-bold">
          <div className="col"><span className='material-symbols-outlined align-middle'>person</span>Sponsors: </div>
          {site.sponsors.map((sponsorName) => <div className="col" key={sponsorName}>{sponsorName}</div>)}
        </div>
      </div>
    </div>


  </div>
)
export default SiteSummaryCard
