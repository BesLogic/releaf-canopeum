import { CircularProgress } from '@mui/material'

const LoadingPage = () => (
  <div className='
    w-100
    h-100
    d-flex
    justify-content-center
    align-items-center
    text-light
    flex-grow-1'>
    <CircularProgress color='secondary' size={75} />
  </div>
)

export default LoadingPage
