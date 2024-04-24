import AdminCard from '@components/settings/AdminCard'
import AdminInvitationDialog from '@components/settings/AdminInvitationDialog'
import type { AdminUserSites } from '@services/api'
import getApiClient from '@services/apiInterface'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ManageAdmins = () => {
  const { t: translate } = useTranslation()
  const [siteAdminList, setSiteAdminList] = useState<AdminUserSites[]>([])
  const [showAdminInviteDialog, setShowAdminInviteDialog] = useState(false)

  const fetchSiteAdmins = async () =>
    setSiteAdminList(await getApiClient().adminUserSitesClient.all())

  useEffect((): void => {
    void fetchSiteAdmins()
  }, [])

  return (
    <>
      <div>
        <div className='d-flex justify-content-between align-items-center'>
          <h2 className='text-light'>{translate('settings.manage-admins.title')}</h2>

          <button
            className='btn btn-secondary'
            onClick={() => setShowAdminInviteDialog(true)}
            type='button'
          >
            {translate('settings.manage-admins.invite-admin')}
          </button>
        </div>

        <div className='mt-3 row gx-3 gy-3'>
          {siteAdminList.map(admin => (
            <div className='col-12 col-lg-6 col-xl-4' key={admin.id}>
              <AdminCard admin={admin} />
            </div>
          ))}
        </div>
      </div>
      <AdminInvitationDialog
        handleClose={() => setShowAdminInviteDialog(false)}
        open={showAdminInviteDialog}
      />
    </>
  )
}

export default ManageAdmins
