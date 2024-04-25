import type { ReactNode } from 'react'

type Props = {
  readonly children: ReactNode,
}

const AuthPageLayout = ({ children }: Props) => (
  <div className='d-flex bg-primary vh-100'>
    <div className='d-none d-md-block col-md-6 login-background' />

    <div className='
      col-12
      col-md-6
      d-flex
      flex-column
      align-items-center
      bg-cream
      px-3
      py-4
      overflow-y-auto
    '>
      {children}
    </div>
  </div>
)

export default AuthPageLayout
