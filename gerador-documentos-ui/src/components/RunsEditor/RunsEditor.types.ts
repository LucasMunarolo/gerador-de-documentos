import type { TextRun } from '../../types';

export interface RunsEditorProps {
  runs: TextRun[];
  onChange: (runs: TextRun[]) => void;
}