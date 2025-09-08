export const truncateAddress = (address: string, screenWidth: number) => {
  if (window.innerWidth < screenWidth) {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  } else {
    return address
  }
}

export const truncateStringFixed = (input: string, numOfChars: number) => {
  return `${input.slice(0,numOfChars)}...${input.slice(-numOfChars)}`
}
