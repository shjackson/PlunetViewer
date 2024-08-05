export function percentile(arr: number[], value: number): number {
  const currentIndex = 0;
  const totalCount = arr.reduce((count, currentValue) => {
    if (currentValue < value) {
      return count + 1; // add 1 to `count`
    } else if (currentValue === value) {
      return count + 0.5; // add 0.5 to `count`
    }
    return count + 0;
  }, currentIndex);
  return (totalCount * 100) / arr.length;
};