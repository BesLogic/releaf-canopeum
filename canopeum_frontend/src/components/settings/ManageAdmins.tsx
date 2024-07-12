import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import AdminCard from '@components/settings/AdminCard'
import AdminInvitationDialog from '@components/settings/AdminInvitationDialog'
import useApiClient from '@hooks/ApiClientHook'
import LoadingPage from '@pages/LoadingPage'
import type { AdminUserSites } from '@services/api'

const ManageAdmins = () => {
  const { t: translate } = useTranslation()
  const { getApiClient } = useApiClient()

  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true)
  const [siteAdminList, setSiteAdminList] = useState<AdminUserSites[]>([])
  const [showAdminInviteDialog, setShowAdminInviteDialog] = useState(false)

  const fetchSiteAdmins = useCallback(async () => {
    try {
      const adminsList = await getApiClient().adminUserSitesClient.all()
      setSiteAdminList(adminsList)
      setIsLoadingAdmins(false)
    } catch {
      setIsLoadingAdmins(false)
    }
  }, [getApiClient])

  useEffect((): void => {
    void fetchSiteAdmins()
  }, [fetchSiteAdmins])

  if (isLoadingAdmins) {
    return <LoadingPage />
  }

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
