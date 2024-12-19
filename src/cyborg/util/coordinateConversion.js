const SCALE_FACTOR = 1000000

export function floatCoordinateToI32Coordinate(value) {
  if (typeof value !== 'number') {
    throw new Error('Value must be a number')
  }

  const scaledValue = Math.floor(value * SCALE_FACTOR)

  if (scaledValue < -2147483648 || scaledValue > 2147483647) {
    throw new Error('Scaled value exceeds i32 range')
  }

  return scaledValue
}

// Convert what comes from substrate to a 'real' coordinate
export function i32CoordinateToFloatCoordinate(value) {
  const cleanedString = value.replace(/,/g, '')
  const integer = parseInt(cleanedString)

  return integer / SCALE_FACTOR
}
