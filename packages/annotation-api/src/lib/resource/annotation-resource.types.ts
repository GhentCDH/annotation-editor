export type AnnotationResourceColumnConfig = {
  column: string;
  label: string;
  displayAs: 'id' | 'label';
};

export type AnnotationResourceJsonConfig = {
  type: string;
  table: string;
  database?: string;
  columns: AnnotationResourceColumnConfig[];
};
