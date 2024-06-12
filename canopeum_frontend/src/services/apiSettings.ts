const apiBaseUrl = import.meta.env.VITE_API_URL

console.log(apiBaseUrl)

export type ApiSettings = {
  apiBaseUrl: string,
}

// export const setApiSetting = (apiSettings: ApiSettings) => ({ apiBaseUrl } = apiSettings)

export const getApiBaseUrl = () => apiBaseUrl
