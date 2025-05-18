/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare const VITE_BUILD_DATE: Date

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

// TODO: Add these to Beslogic.Libraries and make public
type Falsy = '' | 0 | 0n | false | null | undefined

// Allows usage of Array.filter(Boolean)
interface Array<T> {
  filter<S extends T>(predicate: BooleanConstructor, thisArgument?: unknown): Exclude<S, Falsy>[]
}
