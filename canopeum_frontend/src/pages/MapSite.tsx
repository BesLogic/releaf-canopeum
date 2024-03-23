import { useParams } from 'react-router-dom'

const MapSite = () => {
  const { siteId } = useParams();

  return (
    <div>
      <h1>Map Site</h1>
    </div>
  )
}
export default MapSite
