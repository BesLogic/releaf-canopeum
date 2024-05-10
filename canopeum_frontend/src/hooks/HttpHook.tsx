import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { RefreshClient, TokenRefresh } from '@services/api'
import { getApiBaseUrl } from '@services/apiSettings'
import { STORAGE_ACCESS_TOKEN_KEY, STORAGE_REFRESH_TOKEN_KEY } from '@utils/auth.utils'
import { jwtDecode } from 'jwt-decode'
import { useCallback, useContext } from 'react'

const MILLISECONDS_IN_SECOND = 1000

const refreshClient = () => new RefreshClient(getApiBaseUrl())

const useHttp = () => {
  const { logout } = useContext(AuthenticationContext)

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit) => {
    // Store token in zustand store?
    let accessToken = sessionStorage.getItem(STORAGE_ACCESS_TOKEN_KEY) ??
      localStorage.getItem(STORAGE_ACCESS_TOKEN_KEY)

    const headers = new Headers(options.headers)
    if (!accessToken) {
      return fetch(url, { ...options, headers })
      // TODO(NicolasDontigny): Instead of logging out when there is no access token,
      // Handle a 401 or 403 response here
    }

    const decodedAccessToken = jwtDecode(accessToken)
    if (
      !decodedAccessToken.exp ||
      new Date() > new Date(decodedAccessToken.exp * MILLISECONDS_IN_SECOND)
    ) {
      const refreshToken = sessionStorage.getItem(STORAGE_REFRESH_TOKEN_KEY) ??
        localStorage.getItem(STORAGE_REFRESH_TOKEN_KEY)

      const wasStoredInLocalStorage = !!localStorage.getItem(STORAGE_ACCESS_TOKEN_KEY)
      if (!refreshToken) {
        throw new Error('No refresh token')
      }

      const decodedRefreshToken = jwtDecode(refreshToken)
      if (
        !decodedRefreshToken.exp ||
        new Date() > new Date(decodedRefreshToken.exp * MILLISECONDS_IN_SECOND)
      ) {
        logout()
      }

      const tokenRefresh = new TokenRefresh({
        access: accessToken,
        refresh: refreshToken,
      })
      const newTokenRefresh = await refreshClient().create(tokenRefresh)

      localStorage.removeItem(STORAGE_ACCESS_TOKEN_KEY)
      sessionStorage.removeItem(STORAGE_ACCESS_TOKEN_KEY)

      if (wasStoredInLocalStorage) {
        localStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, newTokenRefresh.access)
      } else {
        sessionStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, newTokenRefresh.access)
      }

      accessToken = newTokenRefresh.access
    }

    headers.set('Authorization', `Bearer ${accessToken}`)

    return fetch(url, { ...options, headers })
  }, [logout])

  return {
    fetchWithAuth,
  }
}

export default useHttp
