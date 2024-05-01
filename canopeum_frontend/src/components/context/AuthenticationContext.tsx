import useApiClient from '@hooks/ApiClientHook'
import type { TokenRefresh, User } from '@services/api'
import type { FunctionComponent, ReactNode } from 'react'
import { createContext, memo, useCallback, useMemo, useRef, useState } from 'react'

export const STORAGE_ACCESS_TOKEN_KEY = 'token'
export const STORAGE_REFRESH_TOKEN_KEY = 'refreshToken'

type IAuthenticationContext = {
  initAuth: () => Promise<void>,
  authenticate: (user: User) => void,
  updateUser: (user: User) => void,
  storeToken: (token: TokenRefresh, remember: boolean) => void,
  logout: () => void,
  loadSession: () => void,
  isAuthenticated: boolean,
  isSessionLoaded: boolean,
  currentUser: User | undefined,
}

export const AuthenticationContext = createContext<IAuthenticationContext>({
  initAuth: () => new Promise(() => {/* empty */}),
  authenticate: (_: User) => {/* empty */},
  updateUser: (_: User) => {/* empty */},
  storeToken: (_: TokenRefresh, __: boolean) => {/* empty */},
  logout: () => {/* empty */},
  loadSession: () => {/* empty */},
  isAuthenticated: false,
  isSessionLoaded: false,
  currentUser: undefined,
})

const storeToken = (token: TokenRefresh, remember = false) => {
  if (remember) {
    localStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, token.access)
    localStorage.setItem(STORAGE_REFRESH_TOKEN_KEY, token.refresh)
  } else {
    sessionStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, token.access)
    sessionStorage.setItem(STORAGE_REFRESH_TOKEN_KEY, token.refresh)
  }
}

const AuthenticationContextProvider: FunctionComponent<{ readonly children?: ReactNode }> = memo(
  props => {
    const [user, setUser] = useState<User>()
    const [isSessionLoaded, setIsSessionLoaded] = useState(false)
    const [isInitiated, setIsInitiated] = useState<boolean>(false)
    const isInitiatedRef = useRef(isInitiated)

    const { getApiClient } = useApiClient()

    const loadSession = useCallback(() => setIsSessionLoaded(true), [setIsSessionLoaded])

    const authenticate = useCallback((newUser: User) => {
      setUser(newUser)
      loadSession()
    }, [setUser, loadSession])

    const updateUser = useCallback((updatedUser: User) => setUser(updatedUser), [setUser])

    const initAuth = useCallback(async () => {
      if (isInitiatedRef.current) return

      try {
        const accessToken = sessionStorage.getItem(STORAGE_ACCESS_TOKEN_KEY) ??
          localStorage.getItem(STORAGE_ACCESS_TOKEN_KEY)

        if (!accessToken) {
          loadSession()

          isInitiatedRef.current = true

          return
        }

        const currentUser = await getApiClient().userClient.current()
        authenticate(currentUser)
      } catch {
        /* empty */
      } finally {
        loadSession()
        setIsInitiated(true)
      }
    }, [authenticate, loadSession, getApiClient])

    const logout = useCallback(() => {
      sessionStorage.removeItem(STORAGE_ACCESS_TOKEN_KEY)
      sessionStorage.removeItem(STORAGE_REFRESH_TOKEN_KEY)
      localStorage.removeItem(STORAGE_ACCESS_TOKEN_KEY)
      localStorage.removeItem(STORAGE_REFRESH_TOKEN_KEY)

      setUser(undefined)
    }, [setUser])

    const context = useMemo<IAuthenticationContext>(() => (
      {
        currentUser: user,
        isAuthenticated: user !== undefined,
        isSessionLoaded,
        initAuth,
        authenticate,
        updateUser,
        storeToken,
        loadSession,
        logout,
      }
    ), [initAuth, authenticate, updateUser, loadSession, user, logout, isSessionLoaded])

    return (
      <AuthenticationContext.Provider
        value={context}
      >
        {props.children}
      </AuthenticationContext.Provider>
    )
  },
)

AuthenticationContextProvider.displayName = 'AuthenticationContextProvider'
export default AuthenticationContextProvider
