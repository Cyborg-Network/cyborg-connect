export const isPositiveInteger = (input: string): boolean => {
  const positiveIntegerPattern = /^[1-9]\d*$/;
  return positiveIntegerPattern.test(input);
}

export const transformToNumber = (input: string): number => {
  if( isPositiveInteger(input) ) {
    return Number(input)
  } else {
    return 0
  }
}
