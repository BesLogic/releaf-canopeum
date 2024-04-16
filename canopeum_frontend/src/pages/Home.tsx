import { AuthenticationContext } from '@components/context/AuthenticationContext.tsx'
import PostWidget from '@components/social/PostWidget.tsx'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Post } from '../services/api.ts'
import getApiClient from '../services/apiInterface.ts'

const Home = () => {
  const { t: translate } = useTranslation()
  const { currentUser } = useContext(AuthenticationContext)
  const [newsPosts, setNewsPosts] = useState<Post[]>([])

  const fetchNewsPosts = async () => setNewsPosts(await getApiClient().newsClient.all())

  useEffect(() => void fetchNewsPosts(), [])

  if (!currentUser) return (<div />)



  return (
    <div>
      <div className='container py-4 px-5'>
        <div>
          <h1 className="text-light">{translate('home.title', { username: currentUser.username })}</h1>

          <h6 className="text-light">{translate('home.subtitle')}</h6>
        </div>

        <div className="mt-4 d-flex flex-column gap-2">
          {newsPosts.map(post => <PostWidget key={post.id} post={post} viewMode='user' />)}
        </div>
      </div>
    </div>
  )
}
export default Home
