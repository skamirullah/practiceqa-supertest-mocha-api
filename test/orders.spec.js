import { expect } from 'chai';
import { authClient } from '../src/clients/authClient.js';
import { ordersClient } from '../src/clients/ordersClient.js';
import { productsClient } from '../src/clients/productsClient.js';
import { anOrder, catalogue } from '../src/data/orderBuilder.js';
import { users } from '../src/data/users.js';
import { expectContract } from '../src/utils/contract.js';

describe('Orders', () => {
  let ravi;

  beforeEach(async () => {
    ravi = await authClient.tokenFor(users.ravi);
  });

  it('@smoke places an order, totals it correctly and reduces stock', async () => {
    const { wirelessMouse, notebook } = catalogue;
    const items = anOrder().with(wirelessMouse.id, 3).with(notebook.id, 2).build();

    const res = await ordersClient.place(ravi, items).expect(201);

    await expectContract(res.body, 'Order');
    expect(res.body.status).to.equal('PLACED');
    expect(res.body.total).to.equal(wirelessMouse.price * 3 + notebook.price * 2);
    expect(res.body.items.map((line) => line.lineTotal)).to.deep.equal([wirelessMouse.price * 3, notebook.price * 2]);
    expect(await productsClient.stockOf(wirelessMouse.id)).to.equal(wirelessMouse.stock - 3);
  });

  it('@regression requires a token to place an order', async () => {
    await ordersClient.place(null, anOrder().with(catalogue.wirelessMouse.id).build()).expect(401);
  });

  const invalidOrders = [
    { name: 'an empty basket', items: [] },
    { name: 'an unknown product', items: anOrder().with(catalogue.unknown.id).build() },
    { name: 'more than the per-line limit', items: anOrder().with(catalogue.wirelessMouse.id, 11).build() },
  ];
  for (const { name, items } of invalidOrders) {
    it(`@regression rejects ${name} with 422`, async () => {
      const res = await ordersClient.place(ravi, items).expect(422);
      await expectContract(res.body, 'Error');
    });
  }

  it('@regression refuses a sold-out product with 409 OUT_OF_STOCK', async () => {
    const res = await ordersClient.place(ravi, anOrder().with(catalogue.soldOut.id).build()).expect(409);
    expect(res.body.error.code).to.equal('OUT_OF_STOCK');
  });

  it('@regression cancels a placed order and returns the stock', async () => {
    const before = await productsClient.stockOf(catalogue.wirelessMouse.id);

    const res = await ordersClient.cancel(ravi, users.ravi.ownOrderId).expect(200);

    expect(res.body.status).to.equal('CANCELLED');
    expect(await productsClient.stockOf(catalogue.wirelessMouse.id)).to.be.greaterThan(before);
  });

  it('@regression cannot cancel an order that has already shipped', async () => {
    const meera = await authClient.tokenFor(users.meera);
    await ordersClient.cancel(meera, users.meera.shippedOrderId).expect(409);
  });
});
