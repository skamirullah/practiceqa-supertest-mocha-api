import { expect } from 'chai';
import { utilityClient } from '../src/clients/utilityClient.js';

describe('Service health', () => {
  it('@smoke reports a healthy, clean (non-buggy) server', async () => {
    const res = await utilityClient.health().expect(200);
    expect(res.body.status).to.equal('ok');
    expect(res.body.mode, 'tests assume the clean build').to.equal('clean');
    expect(res.headers['x-request-id']).to.match(/^[0-9a-f-]{36}$/);
  });

  it('@regression publishes an OpenAPI 3 contract covering the order endpoints', async () => {
    const res = await utilityClient.openApi().expect(200);
    expect(res.body.openapi).to.match(/^3\./);
    expect(res.body.paths).to.include.keys('/api/orders', '/api/orders/{id}', '/api/orders/{id}/cancel');
  });
});
