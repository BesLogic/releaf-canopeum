import type { AdminUserSites } from '@services/api'

type Props = {
  readonly admin: AdminUserSites,
}

const AdminCard = ({ admin }: Props) => (
  <div className='card h-100 py-2'>
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
            {
              //
              /* See TODO
              <span className='material-symbols-outlined'>
                {getSiteTypeIconKey(site.siteType.id)}
              </span> */
            }
            (TODO: Add site icon here)
            <span className='ms-1'>{site.name}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default AdminCard
