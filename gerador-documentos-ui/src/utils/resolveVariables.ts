import type { Variables } from "../types";

export function resolveText(text: string, variables: Variables): string {
  return Object.entries(variables).reduce(
    (acc, [key, value]) =>
      acc.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value),
    text,
  );
}
