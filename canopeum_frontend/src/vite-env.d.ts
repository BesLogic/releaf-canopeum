// https://github.com/pd4d10/vite-plugin-svgr#usage
/// <reference types="vite-plugin-svgr/client" />

// https://vite.dev/guide/env-and-mode.html#intellisense-for-typescript

/// <reference types="vite/client" />

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict to disallow unknown keys.
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

declare const VITE_BUILD_DATE: Date
