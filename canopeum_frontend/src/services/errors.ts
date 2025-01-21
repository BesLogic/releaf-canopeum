export const ensureError = (error: unknown) => {
  if (error instanceof Error) return error
  if (error === undefined) return new Error(error)

  // eslint-disable-next-line @typescript-eslint/no-base-to-string -- This is a fallback
  return new Error(String(error))
}
