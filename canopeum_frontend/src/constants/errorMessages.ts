import type { ApiException } from '@services/api'

export type ErrorMessage = 'EMAIL_TAKEN'

const isErrorMessageType = (value: string): value is ErrorMessage => value === 'EMAIL_TAKEN'

const mapErrorToTranslationString: Record<ErrorMessage, string> = {
  EMAIL_TAKEN: 'errors.email-taken',
}

export const getApiExceptionMessage = (exception: ApiException): string | null => {
  const responseTrimmedFromQuotes = exception.response.replaceAll('"', '')
  if (!isErrorMessageType(responseTrimmedFromQuotes)) {
    return null
  }

  return mapErrorToTranslationString[responseTrimmedFromQuotes]
}
