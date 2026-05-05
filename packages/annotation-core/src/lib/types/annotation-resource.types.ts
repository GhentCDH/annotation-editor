export type AnnotationResourceDefinition = {
  type: string;
  table: string;
  database?: string;
  field: { id: string; label: string };
  prefix: string;
};
