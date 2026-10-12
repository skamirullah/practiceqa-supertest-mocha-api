// Single place for everything that changes between environments.
const port = Number(process.env.API_PORT ?? 4100);

export const env = {
  port,
  /** Set API_URL to test a server you started yourself; otherwise the suite starts its own. */
  externalUrl: process.env.API_URL || null,
  baseUrl: process.env.API_URL || `http://127.0.0.1:${port}`,
};
