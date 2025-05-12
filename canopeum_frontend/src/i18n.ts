import { default as i18n } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import resources from './locale'

/* eslint-disable-next-line @typescript-eslint/no-floating-promises
-- Not all browsers we target support top-level await */
void i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    supportedLngs: Object.keys(resources),
    resources,
    detection: { convertDetectedLanguage: lng => lng.split('-')[0] }, // fr-CA -> fr
  })
