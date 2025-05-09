import SiteTypeIcon from '@components/icons/SiteTypeIcon'
import type { SiteAdmins } from '@services/api'

type Props = {
  readonly admin: SiteAdmins,
}

const AdminCard = ({ admin }: Props) => (
  <div className='card h-100'>
    <div className='card-body'>
      <h5 className='card-title d-flex align-items-center'>
        <span className='material-symbols-outlined fill-icon icon-lg'>person</span>
        <span className='ms-1'>{admin.username}</span>
      </h5>
      <h6 className='card-subtitle mt-1 mb-2 text-muted d-flex align-items-center'>
        <span className='material-symbols-outlined fill-icon icon-sm'>mail</span>
        <span className='ms-1'>{admin.email}</span>
      </h6>

      <div className='card-text mt-3 d-flex flex-column gap-1'>
        {admin.sites.map(site => (
          <div className='d-flex align-items-center text-primary' key={site.id}>
            <SiteTypeIcon siteTypeId={site.siteType ?? 0} />
            <span className='ms-1'>{site.name}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default AdminCard
