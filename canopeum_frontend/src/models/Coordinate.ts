const VALID_CARDINALS = ['N', 'S', 'E', 'W'] as const

export type Cardinal = typeof VALID_CARDINALS[number]

// We default to no cardinality so we know the user forgot to input it
// and we don't have to deal with non-numeric input (default to 0 for all fields)
export type DefaultCoordinate = Omit<Coordinate, 'cardinal'> & { cardinal?: Coordinate['cardinal'] }

export type Coordinate = {
  degrees: number,
  minutes: number,
  seconds: number,
  miliseconds: number,
  cardinal: Cardinal,
}

export const defaultLatitude: DefaultCoordinate = {
  degrees: 0,
  minutes: 0,
  seconds: 0,
  miliseconds: 0,
  cardinal: 'N',
}

export const defaultLongitude: DefaultCoordinate = {
  degrees: 0,
  minutes: 0,
  seconds: 0,
  miliseconds: 0,
  cardinal: 'W',
}

export const coordinateToString = (coord: Coordinate) =>
  `${coord.degrees}°${coord.minutes}'${coord.seconds}.${coord.miliseconds}"${coord.cardinal}`

export const extractCoordinate = (coordinates: string) => {
  const char1 = coordinates.indexOf('°')
  const char2 = coordinates.indexOf("'")
  const char3 = coordinates.indexOf('.')
  const char4 = coordinates.indexOf('"')

  /* eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  -- NOTE: It should be impossible for the nullish coalescence to happen here,
  We're also type-guarding the string union immediatly after */
  const cardinal = coordinates.at(-1) as Cardinal
  if (!(VALID_CARDINALS.includes(cardinal))) {
    throw new RangeError(
      `The last character of coordinates string must be ${VALID_CARDINALS.toString()}`,
    )
  }

  return {
    degrees: Number(coordinates.slice(0, char1)),
    minutes: Number(coordinates.slice(char1 + 1, char2)),
    seconds: Number(coordinates.slice(char2 + 1, char3)),
    miliseconds: Number(coordinates.slice(char3 + 1, char4)),
    cardinal,
  }
}
