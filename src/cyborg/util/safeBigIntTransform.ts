export const safeBigIntTransform = (item: number | string): bigint | undefined => {
    try {
        return BigInt(item)
    } catch {
        return undefined
    }
}

export const safeBigIntToNumberTransform = (item: bigint): number | undefined => {
    try {
        return Number(item)
    } catch {
        return undefined
    }
}