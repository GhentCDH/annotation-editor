export type AnnotationColumnFieldInput = {
  type: 'autocomplete' | 'text' | 'select';
  options: {
    uri?: string;
    resource?: string;
    valueKey?: string;
    labelKey?: string;
    enableCreate?: boolean | string;
  };
};

export type AnnotationColumnConfig = {
  id: string;
  label: string;
  hiddenInMetadata?: boolean;
  hiddenInForm?: boolean;
  displayKey?: string;
  type?: {
    type: string;
    properties?: Record<string, { type: string }>;
  };
  fieldInput?: AnnotationColumnFieldInput;
};

export type AnnotationJsonConfig = {
  id: string;
  name: string;
  color: string;
  type?: string;
  icon?: string;
  isRoot?: boolean;
  allowedChildren?: string[];
  allowedLinks?: string[];
  columns?: AnnotationColumnConfig[];
  ui_schema?: unknown;
  metadata_schema?: unknown;
  target?: 'gutter' | 'underline' | 'highlight';
};
