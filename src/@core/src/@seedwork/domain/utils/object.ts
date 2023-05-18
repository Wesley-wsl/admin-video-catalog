export function deepFreeze<T = any>(obj: T) {
  const propNames: string[] = Object.getOwnPropertyNames(obj);

  for (const name of propNames) {
    const value = obj[name as keyof T];
    if (value && typeof value === "object") deepFreeze(value);
  }

  return Object.freeze(obj);
}
