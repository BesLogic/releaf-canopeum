import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { BatchAnalytics } from '../services/api.ts'
import api from '../services/apiInterface.ts'
import { ensureError } from '../services/errors.ts'

const Home = () => {
  const { t } = useTranslation()
  const [data, setData] = useState<BatchAnalytics[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await api().analytics.batches();
      setData(response);
    } catch (error_: unknown) {
      setError(ensureError(error_))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect((): void => {
    void fetchData()
  }, [])

  return (
    <div>
      <div className='container mt-2 d-flex flex-column gap-2'>
        <div className='bg-white rounded-2 px-3 py-2'>
          <h1>{t('home')}</h1>
          {isLoading
            ? <p>Loading...</p>
            : error
            ? <p>Error: {error.message}</p>
            : (
              <div>
                <p>Example request from API:</p>
                <ul>
                  {data.map(item => <li key={item.id}>{item.name}</li>)}
                </ul>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
export default Home
