import type { DocumentComponent } from '../../types';

export interface InnerComponentListProps {
  title: string;
  components: DocumentComponent[];
  onChange: (components: DocumentComponent[]) => void;
  renderForm: (onAdd: (component: DocumentComponent) => void) => React.ReactNode;
  summarize: (component: DocumentComponent) => string;
}