import { AuthenticationContext } from '@components/context/AuthenticationContext.tsx'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { BatchAnalytics } from '../services/api.ts'
import getApiClient from '../services/apiInterface.ts'
import { ensureError } from '../services/errors.ts'

const Home = () => {
  const { t } = useTranslation()
  const { currentUser } = useContext(AuthenticationContext)

  useEffect((): void => {
  }, [])

  return (
    <div>
      <div className='container mt-2 d-flex flex-column gap-2'>
        <div className='bg-white rounded-2 px-3 py-2'>
          <h1>{t('home.title', { username: currentUser?.firstname })}</h1>
        </div>
      </div>
    </div>
  )
}
export default Home
