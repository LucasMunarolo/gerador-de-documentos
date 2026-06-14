import type { Variables } from '../../types';

export type LoopVariables = Record<string, string[]>;

export interface VariablesFillerProps {
  normalVars: string[];
  loopVars: string[];
  variables: Variables;
  loopVariables: LoopVariables;
  onVariableChange: (key: string, value: string) => void;
  onLoopVariableChange: (key: string, values: string[]) => void;
}