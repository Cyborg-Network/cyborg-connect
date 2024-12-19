export const getComputeHourPrice = async (api) => {
  return await api.query.payment.pricePerHour();
}
