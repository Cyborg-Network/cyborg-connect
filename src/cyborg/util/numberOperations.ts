export const isPositiveInteger = (input: string): boolean => {
  const positiveIntegerPattern = /^[1-9]\d*$/
  return positiveIntegerPattern.test(input)
}

export const transformToNumber = (input: string): number | undefined => {
  if (isPositiveInteger(input)) {
    return Number(input)
  } else if (input === ""){
    return 0
  } else if (input === "0"){
    return 0
  } else {
    return undefined
  }
}

export const safeNumberToBigIntTransform = (item: number | string | undefined): bigint | undefined => {
    if (typeof item === "number") {
        if(!Number.isFinite(item) || !Number.isInteger(item)) {
            return undefined
        }
        return BigInt(item);
    }

  if (typeof item === "string") {
    try {
      const asBigInt = BigInt(item);
      // Check if reverse conversion still matches the input
      if (asBigInt.toString() === item) {
        return asBigInt;
      }
    } catch {
      return undefined;
    }
  }

  if (typeof item === "undefined") {
    return undefined
  }

  return undefined;
}

export const safeBigIntToNumberTransform = (item: bigint): number | undefined => {
    try {
        return Number(item)
    } catch {
        return undefined
    }
}