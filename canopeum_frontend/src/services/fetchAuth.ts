const fetchAuth = async (url: string, options: RequestInit) => {
  const token = sessionStorage.getItem('token')
  const headers = new Headers(options.headers)
  headers.set('Authorization', `Bearer ${token}`)

  return fetch(url, { ...options, headers })
}

export default fetchAuth
