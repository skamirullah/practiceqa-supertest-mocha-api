// Seeded accounts of the practice API. All data is fictional.
export const users = Object.freeze({
  admin: { username: 'admin', password: 'Admin@123', role: 'admin' },
  ravi: { id: 2, username: 'ravi', password: 'Ravi@123', role: 'customer', ownOrderId: 1 },
  meera: { id: 3, username: 'meera', password: 'Meera@123', role: 'customer', shippedOrderId: 2, placedOrderId: 3 },
});
