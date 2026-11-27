import { type UIAnnotationDefinition } from '@ghentcdh/annotation-ui';

import {
  type AnnotationDefinitionsState,
  type AnnotationLoadError,
} from '../definitions/useAnnotationDefinitions';

export type StatusState = 'error' | 'warning' | 'ok';

export type StatusIssue = {
  severity: 'error' | 'warning' | 'info';
  source: 'loader' | 'definition';
  target: string;
  message: string;
  anchor: string;
};

export type StatusRow = {
  key: string;
  anchor: string;
  title: string;
  id?: string;
  state: StatusState;
  def?: UIAnnotationDefinition;
  loadError?: AnnotationLoadError;
  raw?: unknown;
};

export type StatusFilter = 'all' | 'errors';

/** Mirrors crouton-vue status.utils stateClasses so both status pages look alike. */
export const stateClasses: Record<
  StatusState,
  { dot: string; badge: string; border: string; text: string }
> = {
  error: {
    dot: 'bg-error',
    badge: 'bg-error/10 text-error border border-error/40',
    border: 'border-error/40',
    text: 'text-error',
  },
  warning: {
    dot: 'bg-warning',
    badge: 'bg-warning/10 text-warning border border-warning/40',
    border: 'border-warning/40',
    text: 'text-warning',
  },
  ok: {
    dot: 'bg-success',
    badge: 'bg-success/10 text-success border border-success/40',
    border: 'border-success/40',
    text: 'text-success',
  },
};

export const errorCount = (state: AnnotationDefinitionsState | null): number =>
  state ? state.loadErrors.length + (state.error ? 1 : 0) : 0;

export const worstState = (
  state: AnnotationDefinitionsState | null,
): StatusState => {
  if (!state) return 'warning';
  if (errorCount(state) > 0) return 'error';
  if (state.loading) return 'warning';
  return 'ok';
};

const loadErrorKey = (err: AnnotationLoadError, index: number): string =>
  err.id ?? err.name ?? `error-${index}`;

export const buildRows = (
  state: AnnotationDefinitionsState | null,
): StatusRow[] => {
  if (!state) return [];
  const errors: StatusRow[] = state.loadErrors.map((err, i) => {
    const key = loadErrorKey(err, i);
    return {
      key,
      anchor: `def-${key}`,
      title: err.name ?? err.id ?? 'Unknown',
      id: err.id,
      state: 'error',
      loadError: err,
      raw: err.raw,
    };
  });
  const defs: StatusRow[] = state.definitions.map((def) => ({
    key: def.id,
    anchor: `def-${def.id}`,
    title: def.title ?? def.name,
    id: def.id,
    state: 'ok',
    def,
    raw: state.rawJsonMap[def.id],
  }));
  return [...errors, ...defs];
};

export const filterRows = (
  rows: StatusRow[],
  filter: StatusFilter,
  search: string,
): StatusRow[] => {
  const q = search.trim().toLowerCase();
  return rows.filter(
    (r) =>
      (filter === 'all' || r.state === 'error') &&
      (!q ||
        r.title.toLowerCase().includes(q) ||
        (r.id ?? '').toLowerCase().includes(q) ||
        (r.def?.name ?? '').toLowerCase().includes(q)),
  );
};

export const collectIssues = (
  state: AnnotationDefinitionsState | null,
): StatusIssue[] => {
  if (!state) return [];
  const issues: StatusIssue[] = [];
  if (state.error) {
    issues.push({
      severity: 'error',
      source: 'loader',
      target: 'definitions',
      message: state.error.message,
      anchor: 'definitions',
    });
  }
  state.loadErrors.forEach((err, i) => {
    const key = loadErrorKey(err, i);
    issues.push({
      severity: 'error',
      source: 'definition',
      target: err.name ?? err.id ?? 'Unknown',
      message: err.error,
      anchor: `def-${key}`,
    });
  });
  return issues;
};

/** Compiled definition without the heavy runtime bits (resource, style fns). */
export const compiledDefinition = (def: UIAnnotationDefinition) => {
  const { resource: _r, style: _s, ...rest } = def;
  return rest;
};
