// Mocha global fixtures: start the practice API once for the whole run and stop it afterwards.
import { spawn } from 'node:child_process';
import { fetchApi } from '../../scripts/fetch-api.mjs';
import { env } from '../config/env.js';

let server;

async function waitUntilHealthy(timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(`${env.baseUrl}/api/health`)).ok) return;
    } catch {
      // not listening yet
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Practice API did not start on ${env.baseUrl}`);
}

export async function mochaGlobalSetup() {
  if (env.externalUrl) return waitUntilHealthy();
  const file = await fetchApi();
  server = spawn(process.execPath, [file, `--port=${env.port}`, '--quiet'], { stdio: 'ignore' });
  await waitUntilHealthy();
}

export async function mochaGlobalTeardown() {
  server?.kill();
}
