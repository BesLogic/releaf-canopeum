import { useParams } from 'react-router-dom'

import ContactCard  from '../components/ContactCard/ContactCard';

const MapSite = () => {
  const { siteId } = useParams();

  return (
    <div>
      <h1>Map Site</h1>
      <ContactCard />
    </div>
  )
}
export default MapSite
