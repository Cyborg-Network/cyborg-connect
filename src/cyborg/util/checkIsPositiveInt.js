export const isPositiveInteger = (input) => {
  const positiveIntegerPattern = /^[1-9]\d*$/;
  return positiveIntegerPattern.test(input);
}
