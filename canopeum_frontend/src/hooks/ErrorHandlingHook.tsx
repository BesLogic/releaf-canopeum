import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { SnackbarContext } from '@components/context/SnackbarContext'
import { getApiExceptionMessage } from '@constants/errorMessages'
import { ApiException } from '@services/api'

const useErrorHandling = () => {
  const { t: translate } = useTranslation()
  const { openAlertSnackbar } = useContext(SnackbarContext)

  const getErrorMessage = (error: unknown, defaultMessage?: string) => {
    defaultMessage ??= translate('generic.error-default')

    if (!(error instanceof ApiException)) {
      return defaultMessage
    }

    const mappedMessage = getApiExceptionMessage(error)

    return mappedMessage
      ? translate(mappedMessage)
      : defaultMessage
  }

  const displayUnhandledAPIError = (
    fallbackMessageTranslationKey: string,
    translationOptions?: Record<string, string | undefined>,
  ) =>
  (error: unknown) =>
    openAlertSnackbar(
      getErrorMessage(error, translate(fallbackMessageTranslationKey, translationOptions)),
      { severity: 'error' },
    )

  return {
    getErrorMessage,
    displayUnhandledAPIError,
  }
}

export default useErrorHandling
