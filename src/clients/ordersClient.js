import { BaseClient } from './baseClient.js';

class OrdersClient extends BaseClient {
  list(token, query = {}) {
    return this.withAuth(this.agent.get('/api/orders').query(query), token);
  }

  get(token, id) {
    return this.withAuth(this.agent.get(`/api/orders/${id}`), token);
  }

  /** `idempotencyKey` makes a retry of the same request safe: the server replays the first result. */
  place(token, items, { idempotencyKey } = {}) {
    const req = this.withAuth(this.agent.post('/api/orders'), token).send({ items });
    return idempotencyKey ? req.set('Idempotency-Key', idempotencyKey) : req;
  }

  cancel(token, id) {
    return this.withAuth(this.agent.post(`/api/orders/${id}/cancel`), token);
  }
}

export const ordersClient = new OrdersClient();
