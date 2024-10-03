import enLang from './en/index'
import frLang from './fr/index'

// NOTE: Object shape consistency is checked in each export rather than only here
// because we want to check for excess properties.
// https://www.typescriptlang.org/docs/handbook/2/objects.html#excess-property-checks
export default {
  en: enLang,
  fr: frLang,
}
