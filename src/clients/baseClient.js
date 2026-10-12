import request from 'supertest';
import { env } from '../config/env.js';

/**
 * Thin wrapper over SuperTest. Resource clients extend it so tests read as
 * `ordersClient.place(token, items)` instead of repeating URLs and headers.
 */
export class BaseClient {
  constructor(baseUrl = env.baseUrl) {
    this.agent = request(baseUrl);
  }

  /** Adds the Bearer header only when a token is given, so negative tests can omit it. */
  withAuth(req, token) {
    return token ? req.set('Authorization', `Bearer ${token}`) : req;
  }
}
