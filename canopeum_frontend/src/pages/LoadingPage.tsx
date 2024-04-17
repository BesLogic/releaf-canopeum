import { NAVBAR_HEIGHT } from '@components/Navbar'
import { CircularProgress } from '@mui/material'

const LoadingPage = () => (
  <div
    className='w-100 d-flex justify-content-center align-items-center text-light'
    style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
  >
    <CircularProgress color='secondary' size={75} />
  </div>
)

export default LoadingPage
