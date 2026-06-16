import type { LoopVariables } from "./VariablesFiller.types";

export interface LoopVariablesSectionProps {
  vars: string[];
  values: LoopVariables;
  onChange: (key: string, values: string[]) => void;
}