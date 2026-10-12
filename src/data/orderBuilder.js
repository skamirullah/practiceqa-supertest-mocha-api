import { randomUUID } from 'node:crypto';

/** Seeded catalogue facts the order tests rely on. */
export const catalogue = Object.freeze({
  wirelessMouse: { id: 1, price: 799, stock: 42 },
  soldOut: { id: 2 },
  deskItem: { id: 4, stock: 8 },
  notebook: { id: 15, price: 299 },
  unknown: { id: 999 },
});

/** Builder for order payloads: `anOrder().with(1, 3).with(15, 2).build()`. */
export function anOrder() {
  const items = [];
  return {
    with(productId, quantity = 1) {
      items.push({ productId, quantity });
      return this;
    },
    build() {
      return items;
    },
  };
}

export const newIdempotencyKey = () => `order-${randomUUID()}`;
