import type { User } from '@models/User'
import type { FunctionComponent, ReactNode } from 'react'
import { createContext, memo, useCallback, useMemo, useState } from 'react'

type IAuthenticationContext = {
  authenticate: (user: User) => void,
  logout: () => void,
  loadSession: () => void,
  isAuthenticated: boolean,
  isSessionLoaded: boolean,
  currentUser: User | undefined,
}

export const AuthenticationContext = createContext<IAuthenticationContext>({
  authenticate: (_: User) => {/* empty */ },
  logout: () => {/* empty */ },
  loadSession: () => {/* empty */ },
  isAuthenticated: false,
  isSessionLoaded: false,
  currentUser: undefined,
})

const AuthenticationContextProvider: FunctionComponent<{ readonly children?: ReactNode }> = memo(props => {
  const [user, setUser] = useState<User>()
  const [isSessionLoaded, setIsSessionLoaded] = useState(false)

  const loadSession = () => setIsSessionLoaded(true)

  const authenticate = useCallback((newUser: User) => {
    setUser(newUser)
    loadSession()
  }, [setUser])

  const logout = useCallback(() => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('refreshToken')

    setUser(undefined)
  }, [setUser])

  const context = useMemo<IAuthenticationContext>(() => (
    {
      currentUser: user,
      isAuthenticated: user !== undefined,
      isSessionLoaded,
      authenticate,
      loadSession,
      logout,
    }
  ), [authenticate, user, logout, isSessionLoaded])

  return (
    <AuthenticationContext.Provider
      value={context}
    >
      {props.children}
    </AuthenticationContext.Provider>
  )
})

AuthenticationContextProvider.displayName = 'AuthenticationContextProvider'
export default AuthenticationContextProvider
