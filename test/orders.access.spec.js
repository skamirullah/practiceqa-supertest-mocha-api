import { expect } from 'chai';
import { authClient } from '../src/clients/authClient.js';
import { ordersClient } from '../src/clients/ordersClient.js';
import { users } from '../src/data/users.js';

describe('Orders: who can see what', () => {
  it('@smoke shows a customer only their own orders', async () => {
    const ravi = await authClient.tokenFor(users.ravi);
    const res = await ordersClient.list(ravi).expect(200);
    expect(res.body.data).to.not.be.empty;
    expect(res.body.data.every((order) => order.userId === users.ravi.id)).to.equal(true);
  });

  it('@regression blocks a customer from reading or cancelling someone else\'s order', async () => {
    const ravi = await authClient.tokenFor(users.ravi);
    await ordersClient.get(ravi, users.ravi.ownOrderId).expect(200);
    await ordersClient.get(ravi, users.meera.shippedOrderId).expect(403);
    await ordersClient.cancel(ravi, users.meera.placedOrderId).expect(403);
  });

  it('@regression lets an admin see every order and filter by status', async () => {
    const admin = await authClient.tokenFor(users.admin);
    const all = await ordersClient.list(admin).expect(200);
    const shipped = await ordersClient.list(admin, { status: 'SHIPPED' }).expect(200);
    expect(all.body.total).to.equal(3);
    expect(shipped.body.data.map((order) => order.id)).to.deep.equal([users.meera.shippedOrderId]);
  });
});
