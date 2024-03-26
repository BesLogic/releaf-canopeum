let apiBaseUrl = 'http://localhost:4000'

export type ApiSettings = {
  apiBaseUrl: string,
}

export const setApiSetting = ({ apiBaseUrl: baseUrl }: ApiSettings) => (
  apiBaseUrl = baseUrl
)

export const getApiBaseUrl = () => apiBaseUrl
