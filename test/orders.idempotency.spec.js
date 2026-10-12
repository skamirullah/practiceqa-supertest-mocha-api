import { expect } from 'chai';
import { authClient } from '../src/clients/authClient.js';
import { ordersClient } from '../src/clients/ordersClient.js';
import { productsClient } from '../src/clients/productsClient.js';
import { anOrder, catalogue, newIdempotencyKey } from '../src/data/orderBuilder.js';
import { users } from '../src/data/users.js';

describe('Orders: safe retries with Idempotency-Key', () => {
  let meera;
  const items = anOrder().with(catalogue.deskItem.id, 2).build();

  beforeEach(async () => {
    meera = await authClient.tokenFor(users.meera);
  });

  it('@regression replays the first order when the same key is sent twice', async () => {
    const idempotencyKey = newIdempotencyKey();

    const first = await ordersClient.place(meera, items, { idempotencyKey }).expect(201);
    const retry = await ordersClient.place(meera, items, { idempotencyKey }).expect(201);

    expect(retry.headers['idempotent-replayed']).to.equal('true');
    expect(retry.body.id).to.equal(first.body.id);
    expect(await productsClient.stockOf(catalogue.deskItem.id), 'stock is reduced once').to.equal(catalogue.deskItem.stock - 2);
  });

  it('@regression creates two orders when the keys differ', async () => {
    const first = await ordersClient.place(meera, items, { idempotencyKey: newIdempotencyKey() }).expect(201);
    const second = await ordersClient.place(meera, items, { idempotencyKey: newIdempotencyKey() }).expect(201);

    expect(second.body.id).to.not.equal(first.body.id);
    expect(await productsClient.stockOf(catalogue.deskItem.id)).to.equal(catalogue.deskItem.stock - 4);
  });
});
