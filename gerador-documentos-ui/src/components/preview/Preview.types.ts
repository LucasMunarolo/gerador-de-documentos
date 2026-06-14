import type { Document, Variables } from '../../types';
import type { LoopVariables } from '../variablesFiller/VariablesFiller.types';

export interface PreviewProps {
  document: Document;
  variables: Variables;
  loopVariables?: LoopVariables;
  templateId: number | null;
  templateName: string;
  mode?: 'template' | 'document';
}