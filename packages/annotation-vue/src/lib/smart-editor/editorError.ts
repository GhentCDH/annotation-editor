export type EditorLoadError = {
  /** Short, user-facing description of what went wrong. */
  message: string;
  /** Technical detail from the backend or HTTP client, shown as secondary text. */
  detail?: string;
  /** HTTP status code when it could be determined. */
  status?: number;
  /** True when the backend answered with HTTP 404. */
  isNotFound: boolean;
  /** The original error, kept for logging or host-app handling. */
  cause?: unknown;
};

const NOT_FOUND = 404;

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : null;

const toNumber = (value: unknown): number | undefined => {
  const status = Number(value);
  return Number.isFinite(status) && status > 0 ? status : undefined;
};

const getString = (
  record: Record<string, unknown> | null,
  key: string,
): string | undefined => {
  const value = record?.[key];
  return typeof value === 'string' && value.trim() ? value : undefined;
};

const getErrorDetail = (error: unknown): string | undefined => {
  if (typeof error === 'string') return error;

  const record = asRecord(error);
  const response = asRecord(record?.['response']);
  const data = response?.['data'];

  if (typeof data === 'string') return data;

  return (
    getString(asRecord(data), 'message') ??
    getString(response, 'statusText') ??
    getString(record, 'message')
  );
};

/**
 * Extract an HTTP status from the common error shapes used by axios, fetch
 * wrappers and NestJS-style errors.
 */
export const getErrorStatus = (error: unknown): number | undefined => {
  const record = asRecord(error);
  const response = asRecord(record?.['response']);

  const status =
    toNumber(response?.['status']) ??
    toNumber(record?.['status']) ??
    toNumber(record?.['statusCode']);

  if (status) return status;

  // Last resort: some fetch wrappers only throw `new Error('... 404 ...')`.
  const detail = getErrorDetail(error);
  const match = detail?.match(/\b(4\d{2}|5\d{2})\b/);
  return match ? Number(match[1]) : undefined;
};

/**
 * Normalise any thrown loader error into a shape the SmartEditor can render.
 */
export const toEditorLoadError = (error: unknown): EditorLoadError => {
  const status = getErrorStatus(error);
  const detail = getErrorDetail(error);

  return {
    message: detail ?? 'Could not load the annotation editor.',
    detail,
    status,
    isNotFound: status === NOT_FOUND,
    cause: error,
  };
};
