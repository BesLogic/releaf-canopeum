import { AuthenticationContext } from '@components/context/AuthenticationContext'
import ProfileSettings from '@components/settings/ProfileSettings'
import SettingsTab from '@components/settings/SettingsTab'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

type UserManagementTab = 'logout' | 'profileSettings' | 'termsAndPolicies'

const tabs: { type: UserManagementTab, translationKey: string }[] = [
  {
    type: 'profileSettings',
    translationKey: 'profile-settings',
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
  const { logout } = useContext(AuthenticationContext)
  const [selectedTab, setSelectedTab] = useState<UserManagementTab>('profileSettings')

  const displayRightTab = () => {
    if (selectedTab === 'termsAndPolicies') {
      return (
        <div>
          <h1>Terms And Policies</h1>
        </div>
      )
    }

    return <ProfileSettings />
  }

  const onTabClick = (tabType: UserManagementTab) => {
    if (tabType === 'logout') {
      logout()

      return
    }

    setSelectedTab(tabType)
  }

  return (
    <div className='container py-3 h-100'>
      <div className='row'>
        <div className='col-4'>
          <div className='bg-white rounded-2 py-3 px-4'>
            <div className='py-3'>
              <h4 className='text-center'>CANOPEUM</h4>
            </div>

            <div className='d-flex flex-column gap-2'>
              {tabs.map(tab => (
                <SettingsTab
                  key={tab.type}
                  onClick={() => onTabClick(tab.type)}
                  selected={selectedTab === tab.type}
                >
                  {translate(`settings.tabs.${tab.translationKey}`)}
                </SettingsTab>
              ))}
            </div>
          </div>
        </div>
        <div className='col-8'>
          {displayRightTab()}
        </div>
      </div>
    </div>
  )
}

export default UserManagement
