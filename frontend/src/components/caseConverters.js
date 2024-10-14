// Convert a string from snake_case to camelCase
export const toCamelCase = (str) => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
};

// Recursively convert all keys in an object to camelCase
export const keysToCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((v) => keysToCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[toCamelCase(key)] = keysToCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

// Convert a string from camelCase to snake_case
export const toSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

// Function to convert all keys in an object to snake_case
export const keysToSnakeCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((v) => keysToSnakeCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[toSnakeCase(key)] = keysToSnakeCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

// Function to Capitalize First Letter
export function capitalizeFirstLetters(str) {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
