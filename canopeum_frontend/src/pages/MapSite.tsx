import { useParams } from 'react-router-dom'

import AnnouncementCard from '../components/AnnouncementCard/AnnouncementCard';

const MapSite = () => {
   
  const { siteId } = useParams()

  return (
    <div>
      <h1>Map Site</h1>
      <AnnouncementCard siteId={ Number(siteId) } />
    </div>
  )
}
export default MapSite
