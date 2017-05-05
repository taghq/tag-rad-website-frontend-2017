
/**
 * Convert number from old range to new range
 * @source http://stackoverflow.com/questions/929103/convert-a-number-range-to-another-range-maintaining-ratio
 */
const convertToRange = (value, oldMin, oldMax, newMin, newMax) => (((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;

export default convertToRange;
