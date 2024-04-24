import { STORAGE_ACCESS_TOKEN_KEY } from '@components/context/AuthenticationContext'

const fetchAuth = async (url: string, options: RequestInit) => {
  const token = sessionStorage.getItem(STORAGE_ACCESS_TOKEN_KEY) ??
    localStorage.getItem(STORAGE_ACCESS_TOKEN_KEY)
  const headers = new Headers(options.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return fetch(url, { ...options, headers })
}

export default fetchAuth
