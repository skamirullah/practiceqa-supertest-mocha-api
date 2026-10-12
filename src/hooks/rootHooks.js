// Every test starts from the same data: the API keeps state in memory, so reset it first.
import { utilityClient } from '../clients/utilityClient.js';

export const mochaHooks = {
  async beforeEach() {
    await utilityClient.reset().expect(200);
  },
};
