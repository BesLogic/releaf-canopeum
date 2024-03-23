export const ensureError = (error: unknown) => {
  if (error instanceof Error) return error
  if (error === undefined) return new Error(error)

  return new Error(String(error))
}
