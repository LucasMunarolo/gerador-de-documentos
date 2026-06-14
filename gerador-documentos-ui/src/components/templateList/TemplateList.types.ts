import type { TemplateResponse } from '../../types';

export interface TemplateListProps {
  templates: TemplateResponse[];
  loading: boolean;
  error: string | null;
  onLoad: (template: TemplateResponse) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
  mode?: 'manage' | 'select';
}