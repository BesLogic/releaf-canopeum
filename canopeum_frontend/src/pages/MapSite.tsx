import { useParams } from 'react-router-dom'

import ContactCard  from '../components/ContactCard/ContactCard';

const MapSite = () => {
   
  // @ts-expect-error: We plan on using it
  const { siteId } = useParams()
   

  return (
    <div>
      <h1>Map Site</h1>
      <ContactCard siteId={siteId}/>
    </div>
  )
}
export default MapSite
