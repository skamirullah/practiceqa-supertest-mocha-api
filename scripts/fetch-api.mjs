// Downloads the practice API (one dependency-free file) into .cache/ the first time it is needed.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE = 'https://www.practiceqaautomation.com/downloads/practiceqa-api.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const API_FILE = path.join(root, '.cache', 'practiceqa-api.mjs');

export async function fetchApi() {
  if (existsSync(API_FILE)) return API_FILE;
  const response = await fetch(SOURCE);
  if (!response.ok) throw new Error(`Could not download the practice API: HTTP ${response.status}`);
  mkdirSync(path.dirname(API_FILE), { recursive: true });
  writeFileSync(API_FILE, await response.text());
  return API_FILE;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`Practice API ready at ${await fetchApi()}`);
}
