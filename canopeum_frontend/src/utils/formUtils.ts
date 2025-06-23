export const clearNonPositiveValue = (value?: number) => (!value || value <= 0
  ? ''
  : value)
