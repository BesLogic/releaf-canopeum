import { TokenRefresh, TokenRefreshRequest } from '@services/api'
import getApiClient from '@services/apiInterface'
import { jwtDecode } from 'jwt-decode'
import type { FunctionComponent, ReactNode } from 'react'
import { createContext, memo, useCallback, useEffect, useMemo, useState } from 'react'

export type UserRole = 'MegaAdmin' | 'Admin' | 'User'

type User = {
  firstname: string,
  lastname: string,
  email: string,
  role: UserRole,
  image: string,
}

type IAuthenticationContext = {
  authenticate: (user: User) => void,
  logout: () => void,
  isAuthenticated: boolean,
  currentUser: User | undefined,
}

export const AuthenticationContext = createContext<IAuthenticationContext>({
  authenticate: (_: User) => {/* empty */},
  logout: () => {/* empty */},
  isAuthenticated: false,
  currentUser: undefined,
})

const AuthenticationContextProvider: FunctionComponent<{ readonly children?: ReactNode }> = memo(props => {
  const [user, setUser] = useState<User>()

  const authenticate = useCallback((newUser: User) => setUser(newUser), [setUser])

  const logout = useCallback(() => setUser(undefined), [setUser])

  const context = useMemo<IAuthenticationContext>(() => (
    {
      currentUser: user,
      isAuthenticated: user !== undefined,
      authenticate,
      logout,
    }
  ), [authenticate, user, logout])

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (token) {
      getApiClient().refreshClient.create(
        new TokenRefreshRequest({ refresh: sessionStorage.getItem('refreshToken') ?? '' }),
      )
        .then((response: TokenRefresh) => {
          const decodedToken = jwtDecode(response.access) as { role: UserRole }
          authenticate({
            email: response.email ?? '',
            firstname: response.firstName ?? '',
            image: '',
            lastname: response.lastName ?? '',
            role: decodedToken.role as UserRole,
          })
        })
        .catch(() => logout())
    }
  }, [])

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
