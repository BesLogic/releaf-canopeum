let apiBaseUrl = 'http://localhost:3000'

export type ApiSettings = {
  apiBaseUrl: string,
}

export const setApiSetting = (apiSettings: ApiSettings) => ({ apiBaseUrl } = apiSettings)

export const getApiBaseUrl = () => apiBaseUrl
