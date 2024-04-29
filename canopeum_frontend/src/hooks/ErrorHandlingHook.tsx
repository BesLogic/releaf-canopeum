import { getApiExceptionMessage } from '@constants/errorMessages'
import { ApiException } from '@services/api'
import { useTranslation } from 'react-i18next'

const useErrorHandling = () => {
  const { t: translate } = useTranslation()

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

  return {
    getErrorMessage,
  }
}

export default useErrorHandling
