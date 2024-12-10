import type { PropsWithChildren } from 'react'
import { createContext, memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type ILanguageContext = {
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string,
  translateValue: (translatable: Translatable) => string,
}

type Translatable = Record<string, unknown> & {
  en: string,
  fr: string,
}

export const LanguageContext = createContext<ILanguageContext>({
  formatDate: (_: Date | string) => '',
  translateValue: (_: Translatable) => '',
})
LanguageContext.displayName = 'LanguageContext'

const { timeZone } = new Intl.DateTimeFormat().resolvedOptions()

const LanguageContextProvider = memo(
  (props: PropsWithChildren) => {
    const { i18n } = useTranslation()

    const formatDate = useCallback((date: Date | string, options?: Intl.DateTimeFormatOptions) => {
      if (typeof date === 'string') {
        date = new Date(date)
      }

      const fullOptions: Intl.DateTimeFormatOptions = {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone,
        ...options,
      }

      return new Intl.DateTimeFormat(i18n.language, fullOptions).format(date)
    }, [i18n])

    const translateValue = useCallback(
      (translable: Translatable) => {
        const value = translable[i18n.language]
        if (typeof value !== 'string') {
          throw new TypeError(`The value of language '${i18n.language}' is not a string`)
        }

        return value
      },
      [i18n],
    )

    const context = useMemo<ILanguageContext>(() => (
      {
        formatDate,
        translateValue,
      }
    ), [formatDate, translateValue])

    return <LanguageContext.Provider value={context}>{props.children}</LanguageContext.Provider>
  },
)

LanguageContextProvider.displayName = 'LanguageContextProvider'
export default LanguageContextProvider
