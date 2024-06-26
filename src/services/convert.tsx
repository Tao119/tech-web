import { FieldValue } from "firebase/firestore";

export function convertToSnakeCase(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertToSnakeCase(item));
  }

  const snakeObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(
      /[A-Z]/g,
      (match) => `_${match.toLowerCase()}`
    );
    snakeObj[snakeKey] = convertToSnakeCase(value);
  }

  return snakeObj;
}

export function convertToSnakeCaseWithoutFieldValue(obj: any): any {
  if (obj === null || typeof obj !== "object" || obj instanceof FieldValue) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertToSnakeCaseWithoutFieldValue);
  }

  const snakeObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(
      /[A-Z]/g,
      (match) => `_${match.toLowerCase()}`
    );
    snakeObj[snakeKey] = convertToSnakeCaseWithoutFieldValue(value);
  }

  return snakeObj;
}

export function convertToCamelCase(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertToCamelCase(item));
  }

  const camelObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (match, group1) =>
      group1.toUpperCase()
    );
    camelObj[camelKey] = convertToCamelCase(value);
  }

  return camelObj;
}
