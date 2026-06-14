import type { DocumentComponent } from '../../types';

export interface ComponentFormProps {
  onAdd: (component: DocumentComponent) => void;
  /** Tipos que não devem aparecer como opção (ex: evitar Loop dentro de Loop) */
  excludeTypes?: DocumentComponent['type'][];
}