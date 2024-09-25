import type { ApiException } from '@services/api'

export type ErrorMessage = 'CURRENT_PASSWORD_INVALID' | 'EMAIL_TAKEN' | 'NEW_PASSWORDS_DO_NOT_MATCH'

const isErrorMessageType = (value: string): value is ErrorMessage =>
  value === 'CURRENT_PASSWORD_INVALID'
  || value === 'EMAIL_TAKEN'
  || value === 'NEW_PASSWORDS_DO_NOT_MATCH'

const mapErrorToTranslationString: Record<ErrorMessage, string> = {
  EMAIL_TAKEN: 'errors.email-taken',
  CURRENT_PASSWORD_INVALID: 'errors.current-password-invalid',
  NEW_PASSWORDS_DO_NOT_MATCH: 'password-error-must-match',
}

export const getApiExceptionMessage = (exception: ApiException): string | null => {
  const responseTrimmedFromQuotes = exception.response.replaceAll('"', '')
  if (!isErrorMessageType(responseTrimmedFromQuotes)) {
    return null
  }

  return mapErrorToTranslationString[responseTrimmedFromQuotes]
}
