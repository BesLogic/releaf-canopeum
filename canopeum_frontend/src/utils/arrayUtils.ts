// TODO: These should be added to beslogic libraries

export const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue =>
  value !== null && value !== undefined

// From type T, get the keys matching type V
type KeysWithValsOfType<T, V> = keyof { [P in keyof T as T[P] extends V ? P : never]: P }
// Equivalent of Record<any, T>, but without type issues
type RecordAnyKey<T> = Record<string, T> | Record<number, T> | Record<symbol, T>

export const sum = (values: number[]) => values.reduce((previous, current) => previous + current, 0)

/**
 * An optimized version of `sum(values.map(value => value.key))`
 *
 * The key is type-safe, and objects implementing index of type any will return any
 * (which can be caught with `@typescript-eslint/no-unsafe-*`)
 */
export const mapSum = <
  T extends RecordAnyKey<unknown>,
  P extends KeysWithValsOfType<T, number | null | undefined>,
>(
  values: T[],
  key: P,
): Exclude<T[P], null | undefined> =>
  // @ts-expect-error: Type 'number' is not assignable to type 'Exclude<T[P], null | undefined>'
  values.reduce(
    (previous, current) =>
      previous + (
        //
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion --
        The retriction using KeysWithValsOfType ensures the value obtained from the key is of known
        type. We don't want the the objects to be restricted to *only* those value types */
        (current[key] as number | null | undefined) ?? 0
      ),
    0,
  )
