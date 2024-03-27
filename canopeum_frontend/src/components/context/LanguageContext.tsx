import type { FunctionComponent, ReactNode } from 'react'
import { createContext, memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type ILanguageContext = {
  formatDate: (date: Date | string) => string,
  translateValue: (translatable: Translatable) => string,
}

type Translatable = Record<string, string> & {
  en: string,
  fr: string,
}

export const LanguageContext = createContext<ILanguageContext>({
  formatDate: (_: Date | string) => '',
  translateValue: (_: Translatable) => '',
})

const { timeZone } = Intl.DateTimeFormat().resolvedOptions()

const LanguageContextProvider: FunctionComponent<{ readonly children?: ReactNode }> = memo(props => {
  const { i18n } = useTranslation()

  const formatDate = useCallback((date: Date | string) => {
    if (typeof date === 'string') {
      date = new Date(date)
    }

    return Intl.DateTimeFormat(i18n.language, { dateStyle: 'long', timeStyle: 'short', timeZone })
      .format(date)
  }, [i18n])

  const translateValue = useCallback((translable: Translatable) => translable[i18n.language], [i18n])

  const context = useMemo<ILanguageContext>(() => (
    {
      formatDate,
      translateValue,
    }
  ), [formatDate, translateValue])

  return (
    <LanguageContext.Provider
      value={context}
    >
      {props.children}
    </LanguageContext.Provider>
  )
})

LanguageContextProvider.displayName = 'LanguageContextProvider'
export default LanguageContextProvider
