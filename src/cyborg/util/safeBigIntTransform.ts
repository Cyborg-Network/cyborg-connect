export const safeBigIntTransform = (item: number): bigint | undefined => {
    try {
        return BigInt(item)
    } catch {
        return undefined
    }
}