function groupBy(array, key) {
  return array.reduce((acc, obj) => {
    const groupKey = obj[key];

    // Check if the key already exists in the accumulator
    if (!acc[groupKey]) {
      // If not, create a new array for the key
      acc[groupKey] = [];
    }

    // Push the current object to the array for the key
    acc[groupKey].push(obj);

    return acc;
  }, {});
}

export { groupBy };
