import { AuthenticationContext } from '@components/context/AuthenticationContext'
import EditProfile from '@components/settings/EditProfile'
import ManageAdmins from '@components/settings/ManageAdmins'
import SettingsTab from '@components/settings/SettingsTab'
import type { UserRole } from '@models/User'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

type UserManagementTab = 'editProfile' | 'logout' | 'manageAdmins' | 'termsAndPolicies'

const tabs: { type: UserManagementTab, translationKey: string, roles?: UserRole[] }[] = [
  {
    type: 'editProfile',
    translationKey: 'edit-profile',
  },
  {
    type: 'manageAdmins',
    translationKey: 'manage-admins',
    roles: ['MegaAdmin'],
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
    <div className='container py-3 h-100'>
      <div className='row' style={{ height: '80vh' }}>
        <div className='col-3 h-100'>
          <div className='bg-white rounded-2 py-3 px-4 h-100'>
            <div className='py-3'>
              <h4 className='text-center'>CANOPEUM</h4>
            </div>

            <div className='d-flex flex-column gap-2'>{tabsDisplay()}</div>
          </div>
        </div>

        <div className='col-7 px-5'>
          {displayTabContent()}
        </div>
      </div>
    </div>
  )
}

export default UserManagement
