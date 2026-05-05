import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

import type { DataSourceEntry, DataSourceJsonConfig } from './data-source.types';

type DataSourceModule = {
  default: unknown;
};

/**
 * IMPORTANT:
 * Vite needs a statically analyzable glob.
 * We intentionally scope it to a predictable folder structure.
 */
const modules = import.meta.glob<DataSourceModule>('./**/index.{ts,js}');

/**
 * Scan a directory for data-source subdirectories and load their configs + clients.
 */
export const loadDataSourcesFromDir = async (
  dirPath: string,
): Promise<DataSourceEntry[]> => {
  if (!existsSync(dirPath)) return [];

  const entries = readdirSync(dirPath, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  const results: DataSourceEntry[] = [];

  for (const dir of dirs) {
    const basePath = join(dirPath, dir);
    const jsonFile = join(basePath, 'data-source.json');

    if (!existsSync(jsonFile)) continue;

    const config: DataSourceJsonConfig = JSON.parse(
      readFileSync(jsonFile, 'utf-8'),
    );

    const importer = resolveModule(basePath);

    if (!importer) continue;

    const mod = await importer();
    const client = mod.default;

    if (!client) continue;

    results.push({ config, client });
  }

  return results;
};

/**
 * Convert filesystem path → Vite glob key safely
 */
const resolveModule = (absPath: string) => {
  const rel = relative(process.cwd(), absPath).replace(/\\/g, '/');
  const key = `./${rel}/index.ts`;

  return modules[key];
};
