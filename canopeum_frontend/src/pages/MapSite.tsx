import { useParams } from 'react-router-dom'

import ContactCard  from '../components/ContactCard/ContactCard';

const MapSite = () => {
  /* eslint-disable @typescript-eslint/no-unused-vars -- We plan on using it */
  // @ts-expect-error: We plan on using it
  const { siteId } = useParams()
  /* eslint-enable @typescript-eslint/no-unused-vars */

  return (
    <div>
      <h1>Map Site</h1>
      <ContactCard />
    </div>
  )
}
export default MapSite
