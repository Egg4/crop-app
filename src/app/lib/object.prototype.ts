interface Object {
  isObject(object: any): boolean;
  deepEqual(object1: Object, object2: Object): boolean;
}

Object.isObject = function(object: any): boolean {
  return object != null && typeof object === 'object';
}

Object.deepEqual = function(object1: Object, object2: Object): boolean {
  if (!object1 && !object2) return true;
  if (!object1 || !object2) return false;

  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
	const val1 = object1[key];
    const val2 = object2[key];

    const areArrays = Array.isArray(val1) && Array.isArray(val2);
    if (areArrays && !Array.deepEqual(val1, val2)) return false;

    const areObjects = Object.isObject(val1) && Object.isObject(val2);
    if (areObjects && !Object.deepEqual(val1, val2)) return false;

    if (!areArrays && !areObjects && val1 !== val2) return false;
  }

  return true;
}