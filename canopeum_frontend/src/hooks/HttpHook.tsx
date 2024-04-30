import { AuthenticationContext, STORAGE_ACCESS_TOKEN_KEY, STORAGE_REFRESH_TOKEN_KEY } from '@components/context/AuthenticationContext'
import { ApiException, RefreshClient, TokenRefresh } from '@services/api'
import { getApiBaseUrl } from '@services/apiSettings'
import { jwtDecode } from 'jwt-decode'
import { useContext } from 'react'

const refreshClient = () => new RefreshClient(getApiBaseUrl())

const useHttp = () => {
  const { logout } = useContext(AuthenticationContext)

  const fetchWithAuth = async (url: string, options: RequestInit) => {
    let accessToken = sessionStorage.getItem(STORAGE_ACCESS_TOKEN_KEY) ??
      localStorage.getItem(STORAGE_ACCESS_TOKEN_KEY)

    if (!accessToken) {
      logout()
      throw new Error('No access token')
    }

    const decodedToken = jwtDecode(accessToken)
    if (
      !decodedToken.exp || new Date() > new Date(decodedToken.exp * 1000)
    ) {
      const refreshToken = sessionStorage.getItem(STORAGE_REFRESH_TOKEN_KEY) ??
        localStorage.getItem(STORAGE_REFRESH_TOKEN_KEY)

      const wasStoredInLocalStorage = !!localStorage.getItem(STORAGE_ACCESS_TOKEN_KEY)
      if (!refreshToken) {
        throw new Error('No refresh token')
      }
      // CHECK IF REFRESH TOKEN IS EXPIRED
      const tokenRefresh = new TokenRefresh({
        access: accessToken,
        refresh: refreshToken,
      })
      const newTokenRefresh = await refreshClient().create(tokenRefresh)
      console.log('newTokenRefresh:', newTokenRefresh)

      localStorage.removeItem(STORAGE_ACCESS_TOKEN_KEY)
      sessionStorage.removeItem(STORAGE_ACCESS_TOKEN_KEY)

      if (wasStoredInLocalStorage) {
        localStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, newTokenRefresh.access)
      } else {
        sessionStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, newTokenRefresh.access)
      }

      accessToken = newTokenRefresh.access
    }

    const headers = new Headers(options.headers)
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }

    let fetchTest: Promise<Response>
    try {
      fetchTest = fetch(url, { ...options, headers })
    } catch (error: unknown) {
      console.log('error 1:', error)
      if (error instanceof ApiException) {
        console.log('error 2:', error)
      }
      throw new Error('')
    }

    return fetchTest
  }

  return {
    fetchWithAuth,
  }
}

export default useHttp
