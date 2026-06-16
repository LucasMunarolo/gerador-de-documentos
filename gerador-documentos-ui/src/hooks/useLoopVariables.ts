import type { LoopVariables } from "../../public/variablesFiller/VariablesFiller.types";

export function useLoopVariables(
  loopVariables: LoopVariables,
  onChange: (key: string, values: string[]) => void,
) {
  function addRow(key: string) {
    onChange(key, [...(loopVariables[key] ?? []), ""]);
  }

  function updateRow(key: string, index: number, value: string) {
    const updated = [...(loopVariables[key] ?? [])];
    updated[index] = value;
    onChange(key, updated);
  }

  function removeRow(key: string, index: number) {
    onChange(
      key,
      (loopVariables[key] ?? []).filter((_, i) => i !== index),
    );
  }

  return { addRow, updateRow, removeRow };
}
