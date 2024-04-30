import './UserManagement.scss'

import { AuthenticationContext } from '@components/context/AuthenticationContext'
import EditProfile from '@components/settings/EditProfile'
import ManageAdmins from '@components/settings/ManageAdmins'
import SettingsTab from '@components/settings/SettingsTab'
import type { RoleEnum } from '@services/api'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

type UserManagementTab = 'editProfile' | 'logout' | 'manageAdmins' | 'termsAndPolicies'

const tabs: { type: UserManagementTab, translationKey: string, roles?: RoleEnum[] }[] = [
  {
    type: 'editProfile',
    translationKey: 'edit-profile',
  },
  {
    type: 'manageAdmins',
    translationKey: 'manage-admins',
    roles: ['MegaAdmin' as RoleEnum],
  },
  {
    type: 'termsAndPolicies',
    translationKey: 'terms-and-policies',
  },
  {
    type: 'logout',
    translationKey: 'logout',
  },
]

const UserManagement = () => {
  const { t: translate } = useTranslation()
  const { logout, currentUser } = useContext(AuthenticationContext)
  const [selectedTab, setSelectedTab] = useState<UserManagementTab>('editProfile')

  const displayTabContent = () => {
    if (selectedTab === 'termsAndPolicies') {
      return (
        <div>
          <h1>Terms And Policies</h1>
        </div>
      )
    }

    if (selectedTab === 'manageAdmins' && currentUser?.role === 'MegaAdmin') {
      return <ManageAdmins />
    }

    return <EditProfile />
  }

  const onTabClick = (tabType: UserManagementTab) => {
    if (tabType === 'logout') {
      logout()

      return
    }

    setSelectedTab(tabType)
  }

  const tabsDisplay = () =>
    tabs
      .filter(tab => !tab.roles || (currentUser && tab.roles.includes(currentUser.role)))
      .map(tab => (
        <SettingsTab
          key={tab.type}
          onClick={() => onTabClick(tab.type)}
          selected={selectedTab === tab.type}
        >
          {translate(`settings.tabs.${tab.translationKey}`)}
        </SettingsTab>
      ))

  return (
    <div className='page-container h-100'>
      <div className='row' style={{ height: '80vh' }}>
        <div className='col-12 col-md-5 col-lg-3'>
          <div className='settings-left-nav-menu bg-cream rounded-2 py-3 px-4'>
            <div className='py-3 d-none d-md-block'>
              <h4 className='text-center'>CANOPEUM</h4>
            </div>

            <div className='d-flex flex-column gap-2'>{tabsDisplay()}</div>
          </div>
        </div>

        <div className='settings-tab-content-container col-12 col-md-7 col-lg-9'>
          {displayTabContent()}
        </div>
      </div>
    </div>
  )
}

export default UserManagement
