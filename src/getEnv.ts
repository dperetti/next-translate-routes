import type { TRouteBranch } from './types'

// declare global type for globalThis
declare const globalThis: any
declare global {
  var i18nConfig: any & { routesTree: TRouteBranch }

  interface Window {
    i18nConfig: Object & { routesTree: TRouteBranch };
  }
}

export const getRoutesTree = () => {
  if (typeof window === 'undefined') {
    return global.i18nConfig?.routesTree || {}
  }
  return window.i18nConfig?.routesTree || {}
}

// export const getRoutesTree = () => JSON.parse(process.env.NEXT_PUBLIC_ROUTES || 'null') as TRouteBranch
export const getLocales = () => (process.env.NEXT_PUBLIC_LOCALES || '').split(',') as string[]
export const getDefaultLocale = () => process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string | undefined
