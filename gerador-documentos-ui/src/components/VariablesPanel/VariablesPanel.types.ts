import type { Variables } from "../../types";

export interface VariablesPanelProps {
  variables: Variables;
  onAdd: (key: string, value: string) => void;
  onRemove: (key: string) => void;
}
