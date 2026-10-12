import { BaseClient } from './baseClient.js';

class ProductsClient extends BaseClient {
  list(query = {}) {
    return this.agent.get('/api/products').query(query);
  }

  get(id) {
    return this.agent.get(`/api/products/${id}`);
  }

  async stockOf(id) {
    return (await this.get(id).expect(200)).body.stock;
  }
}

export const productsClient = new ProductsClient();
