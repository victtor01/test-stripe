export function isNilOrEmptyObject(value: unknown): boolean {
  return (
    value == null ||
    (typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0)
  );
}