import type { Variables } from "../../types";

export interface NormalVariablesSectionProps {
  vars: string[];
  values: Variables;
  onChange: (key: string, value: string) => void;
}
