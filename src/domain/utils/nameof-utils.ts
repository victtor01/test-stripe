export function nameof<T>(selector: (obj: T) => unknown): string {
  return selector
    .toString()
    .match(/\.([a-zA-Z0-9_]+);?\s*\}?$/)?.[1] ?? "";
}