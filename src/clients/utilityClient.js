import { BaseClient } from './baseClient.js';

class UtilityClient extends BaseClient {
  health() {
    return this.agent.get('/api/health');
  }

  reset() {
    return this.agent.post('/api/reset');
  }

  openApi() {
    return this.agent.get('/openapi.json');
  }
}

export const utilityClient = new UtilityClient();
