import { useParams } from 'react-router-dom'

const MapSite = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- We plan on using it
  const { siteId } = useParams()

  return (
    <div>
      <h1>Map Site</h1>
    </div>
  )
}
export default MapSite
