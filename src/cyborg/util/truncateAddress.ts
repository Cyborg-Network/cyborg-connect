export const truncateAddress = (address: string, screenWidth: number) => {
  if (window.innerWidth < screenWidth) {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  } else {
    return address
  }
}
