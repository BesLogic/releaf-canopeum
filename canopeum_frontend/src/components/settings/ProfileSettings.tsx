import { useTranslation } from 'react-i18next'

const ProfileSettings = () => {
  const { t: translate } = useTranslation()

  return (
    <div>
      <h2 className='text-light'>{translate('settings.profile-settings.title')}</h2>

      <div className='bg-white rounded-2 mt-4 px-3 py-2'>
        <h4>Form Goes Here</h4>
      </div>
    </div>
  )
}

export default ProfileSettings
