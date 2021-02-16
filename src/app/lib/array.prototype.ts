import './object.prototype';

interface Array<T> {
  deepEqual(array1: T[], array2: T[]): boolean;
}

Array.deepEqual = function (array1: [], array2: []): boolean {
  if (!array1 || !array2) return false;

  if (array1.length !== array2.length) return false;

  for (var i = 0, l=this.length; i < l; i++) {
	const val1 = array1[i];
    const val2 = array2[i];

    const areArrays = Array.isArray(val1) && Array.isArray(val2);
    if (areArrays && !Array.deepEqual(val1, val2)) return false;

    const areObjects = Object.isObject(val1) && Object.isObject(val2);
    if (areObjects && !Object.deepEqual(val1, val2)) return false;

    if (!areArrays && !areObjects && val1 !== val2) return false;
  }

  return true;
}