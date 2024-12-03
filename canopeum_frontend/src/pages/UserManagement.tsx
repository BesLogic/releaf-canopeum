import './UserManagement.scss'

import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import { AuthenticationContext } from '@components/context/AuthenticationContext'
import EditProfile from '@components/settings/EditProfile'
import ManageAdmins from '@components/settings/ManageAdmins'
import SettingsTab from '@components/settings/SettingsTab'
import TermsAndPolicies from '@components/settings/TermsAndPolicies'
import { appRoutes } from '@constants/routes.constant'
import type { RoleEnum } from '@services/api'

type UserManagementTab =
  | (typeof appRoutes.userManagment)[keyof Omit<typeof appRoutes.userManagment, ''>]
  | 'logout'

const tabs: { type: UserManagementTab, translationKey: string, roles?: RoleEnum[] }[] = [
  {
    type: appRoutes.userManagment.myProfile,
    translationKey: 'settings.tabs.edit-profile',
  },
  {
    type: appRoutes.userManagment.manageAdmins,
    translationKey: 'settings.tabs.manage-admins',
    roles: ['MegaAdmin' as RoleEnum],
  },
  {
    type: appRoutes.userManagment.termsAndPolicies,
    translationKey: 'settings.tabs.terms-and-policies',
  },
  {
    type: 'logout',
    translationKey: 'auth.log-out',
  },
]

const UserManagement = () => {
  const { t: translate } = useTranslation()
  const { logout, currentUser } = useContext(AuthenticationContext)
  const navigate = useNavigate()
  const location = useLocation()

  const onTabClick = (tabPath: UserManagementTab) => {
    if (tabPath === 'logout') {
      logout()

      return
    }

    navigate(tabPath)
  }

  const tabsDisplay = () =>
    tabs
      .filter(tab => !tab.roles || (currentUser && tab.roles.includes(currentUser.role)))
      .map(tab => (
        <SettingsTab
          key={tab.type}
          onClick={() => onTabClick(tab.type)}
          selected={location.pathname === tab.type}
        >
          {translate(tab.translationKey)}
        </SettingsTab>
      ))

  return (
    <div className='page-container h-100'>
      <div className='row' style={{ height: '80vh' }}>
        <div className='col-12 col-md-5 col-lg-3 pb-4'>
          <div className='settings-left-nav-menu card py-3 px-4'>
            <div className='py-3 d-none d-md-block'>
              <h4 className='text-center'>CANOPEUM</h4>
            </div>

            <div className='d-flex flex-column gap-2'>{tabsDisplay()}</div>
          </div>
        </div>

        <div className='settings-tab-content-container col-12 col-md-7 col-lg-9 pb-4'>
          <Routes>
            <Route element={<EditProfile />} path='/my-profile' />
            <Route element={<ManageAdmins />} path='/manage-admins' />
            <Route element={<TermsAndPolicies />} path='/terms-and-policies' />
            <Route
              element={<Navigate replace to={appRoutes.userManagment.myProfile} />}
              path='*'
            />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default UserManagement
