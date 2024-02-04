function groupBy<T, K extends keyof any>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T[]> {
  return array.reduce((accumulator, item) => {
    const key = getKey(item);
    accumulator[key] = [...(accumulator[key] || []), item];
    return accumulator;
  }, {} as Record<K, T[]>);
}
export { groupBy };
