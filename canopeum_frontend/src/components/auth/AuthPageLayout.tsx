import type { ReactNode } from 'react'

type Props = {
  readonly children: ReactNode,
}

const AuthPageLayout = ({ children }: Props) => (
  <div className='d-flex bg-primary' style={{ height: '100vh' }}>
    <div className='login-background' style={{ width: '55%' }} />
    <div
      className='d-flex flex-column align-items-center bg-white px-3 py-4 overflow-y-auto'
      style={{ width: '45%' }}
    >
      {children}
    </div>
  </div>
)

export default AuthPageLayout
