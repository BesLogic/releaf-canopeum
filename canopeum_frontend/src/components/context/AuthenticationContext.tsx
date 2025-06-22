import type { PropsWithChildren } from 'react'
import { createContext, memo, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ConfirmationDialog from '@components/dialogs/ConfirmationDialog'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import type { User } from '@services/api'
import { STORAGE_ACCESS_TOKEN_KEY, STORAGE_REFRESH_TOKEN_KEY } from '@utils/auth.utils'

type IAuthenticationContext = {
  initAuth: () => Promise<void>,
  authenticate: (user: User) => void,
  updateUser: (user: User) => void,
  logout: () => void,
  showLogoutModal: () => void,
  loadSession: () => void,
  isAuthenticated: boolean,
  isSessionLoaded: boolean,
  currentUser: User | undefined,
}

export const AuthenticationContext = createContext<IAuthenticationContext>({
  initAuth: () => new Promise(() => {/* empty */}),
  authenticate: (_: User) => {/* empty */},
  updateUser: (_: User) => {/* empty */},
  logout: () => {/* empty */},
  showLogoutModal: () => {/* empty */},
  loadSession: () => {/* empty */},
  isAuthenticated: false,
  isSessionLoaded: false,
  currentUser: undefined,
})
AuthenticationContext.displayName = 'AuthenticationContext'

const AuthenticationContextProvider = memo(
  (props: PropsWithChildren) => {
    const [user, setUser] = useState<User>()
    const [isSessionLoaded, setIsSessionLoaded] = useState(false)
    const [isInitiated, setIsInitiated] = useState(false)
    const [logoutModalShown, setLogoutModalShown] = useState(false)
    const isInitiatedRef = useRef(isInitiated)
    const { getApiClient } = useApiClient()
    const { t } = useTranslation()
    const { displayUnhandledAPIError } = useErrorHandling()

    const handleLogoutModalClose = (proceed: boolean) => {
      if (proceed) logout()
      setLogoutModalShown(false)
    }

    const loadSession = useCallback(() => setIsSessionLoaded(true), [setIsSessionLoaded])

    const authenticate = useCallback((newUser: User) => {
      setUser(newUser)
      loadSession()
    }, [setUser, loadSession])

    const updateUser = useCallback((updatedUser: User) => setUser(updatedUser), [setUser])

    const initAuth = useCallback(async () => {
      if (isInitiatedRef.current) return

      try {
        const accessToken = sessionStorage.getItem(STORAGE_ACCESS_TOKEN_KEY)
          ?? localStorage.getItem(STORAGE_ACCESS_TOKEN_KEY)

        if (!accessToken) {
          loadSession()

          isInitiatedRef.current = true

          return
        }

        const currentUser = await getApiClient().userClient.current()
        authenticate(currentUser)
      } catch (fetchUserError) {
        displayUnhandledAPIError('errors.fetch-current-user-failed')(fetchUserError)
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

    const showLogoutModal = () => setLogoutModalShown(true)

    const context = useMemo<IAuthenticationContext>(() => (
      {
        currentUser: user,
        isAuthenticated: user !== undefined,
        isSessionLoaded,
        initAuth,
        authenticate,
        updateUser,
        loadSession,
        logout,
        showLogoutModal,
      }
    ), [initAuth, authenticate, updateUser, loadSession, user, logout, isSessionLoaded])

    return (
      <AuthenticationContext.Provider
        value={context}
      >
        {props.children}
        <ConfirmationDialog
          actions={['ok', 'cancel']}
          onClose={handleLogoutModalClose}
          open={logoutModalShown}
          title={t('auth.log-out-confirmation')}
        />
      </AuthenticationContext.Provider>
    )
  },
)

AuthenticationContextProvider.displayName = 'AuthenticationContextProvider'
export default AuthenticationContextProvider
