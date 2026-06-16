import type { Alignment, DocumentComponent } from "../../../types";

export interface BaseFormProps {
  onAdd: (component: DocumentComponent) => void;
}

export const ALIGNMENTS: Alignment[] = ['LEFT', 'CENTER', 'RIGHT'];

export const ALIGNMENT_LABELS: Record<Alignment, string> = {
  LEFT: 'Esquerda',
  CENTER: 'Centro',
  RIGHT: 'Direita',
};