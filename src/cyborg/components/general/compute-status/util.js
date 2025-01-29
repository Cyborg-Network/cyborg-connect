export const parseGaugeMetric = (usageDataArray, totalUsageAvailable, type) => {
    let current = usageDataArray[usageDataArray.length -1];
    console.log(`${type} total ${totalUsageAvailable}`)
    console.log(`${type} current ${current}`)
    if(totalUsageAvailable){
      let percentage = (current / totalUsageAvailable) * 100;
      return Number(parseFloat(percentage.toFixed(2)));
    } else {
      return Number(parseFloat(current.toFixed(2)));
    }
}
