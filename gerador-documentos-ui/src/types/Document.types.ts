export type MarkType = 'BOLD' | 'ITALIC' | 'UNDERLINE';

export type Alignment = 'LEFT' | 'CENTER' | 'RIGHT';

export interface LoopRun {
  items: Record<string, string>[];
  runs: TextRun[];
}

export interface TextRun {
  text: string;
  marks: MarkType[];
  loopRun?: LoopRun;
}

export interface Signature {
  type: 'SIGNATURE';
  name: string;
  document: string;
}

export interface Header {
  type: 'HEADER';
  components: DocumentComponent[];
  border?: boolean;
}

export interface Image {
  type: 'IMAGE';
  url: string;
  width: number;
  height: number;
  alignment: Alignment;
}

export interface Paragraph {
  type: 'PARAGRAPH';
  marginLeft?: number;
  alignment: Alignment;
  runs: TextRun[];
}

export interface Clause {
  type: 'CLAUSE';
  number: number[];
  runs: TextRun[];
}

export interface LineBreak {
  type: 'LINE_BREAK';
  points: number;
}

export interface UnorderedList {
  type: 'UNORDERED_LIST';
  elements: Paragraph[];
}

export interface Title {
  type: 'TITLE';
  runs: TextRun[];
  alignment: Alignment;
}

export interface Loop {
  type: 'LOOP';
  items: Record<string, string>[];
  components: DocumentComponent[];
}

export interface Conditional {
  type: 'CONDITIONAL';
  variable: string;
  value: string;
  components: DocumentComponent[];
}

export type DocumentComponent =
  | Paragraph
  | Clause
  | LineBreak
  | UnorderedList
  | Title
  | Loop
  | Conditional
  | Signature
  | Header
  | Image;

export type Variables = Record<string, string>;

export interface Document {
  components: DocumentComponent[];
  variables?: Variables;
}