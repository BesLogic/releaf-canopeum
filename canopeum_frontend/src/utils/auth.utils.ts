import type { TokenRefresh } from '@services/api'

export const STORAGE_ACCESS_TOKEN_KEY = 'token'
export const STORAGE_REFRESH_TOKEN_KEY = 'refreshToken'

export const storeToken = (token: TokenRefresh, remember = false) => {
  if (remember) {
    localStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, token.access)
    localStorage.setItem(STORAGE_REFRESH_TOKEN_KEY, token.refresh)
  } else {
    sessionStorage.setItem(STORAGE_ACCESS_TOKEN_KEY, token.access)
    sessionStorage.setItem(STORAGE_REFRESH_TOKEN_KEY, token.refresh)
  }
}
