import { useTranslation } from 'react-i18next'

const News = () => {
  const { t } = useTranslation()

  return (
    <div>
      <div className='container mt-2 d-flex flex-column gap-2'>
        <h1 className='text-light'>{t('news.title')}</h1>
        <h2 className='text-light'>{t('news.subTitle')}</h2>
      </div>
    </div>
  )
}

export default News
