import type { Document, DocumentComponent, Variables } from '../../types';

export interface EditorProps {
  document: Document;
  variables: Variables;
  onAddComponent: (component: DocumentComponent) => void;
  onRemoveComponent: (index: number) => void;
  onMoveComponent: (index: number, direction: 'up' | 'down') => void;
  onAddVariable?: (key: string, value: string) => void;
  onRemoveVariable?: (key: string) => void;
  showVariables?: boolean;
}