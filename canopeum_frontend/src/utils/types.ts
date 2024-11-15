// TODO: This should be added to beslogic libraries

/**
 * Useful To create an interface type from a class, where you can spread the object
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- We do mean any Function
export type ExcludeFunctions<T> = { [K in keyof T as (T[K] extends Function ? never : K)]: T[K] }
