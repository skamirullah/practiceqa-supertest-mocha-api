import { expect } from 'chai';
import { authClient } from '../src/clients/authClient.js';
import { users } from '../src/data/users.js';
import { expectContract } from '../src/utils/contract.js';

describe('Authentication', () => {
  it('@smoke logs in and identifies the user from the token', async () => {
    const token = await authClient.tokenFor(users.ravi);
    const res = await authClient.me(token).expect(200);
    expect(res.body).to.include({ username: 'ravi', role: 'customer' });
  });

  it('@regression never returns the password in the login response', async () => {
    const res = await authClient.login(users.ravi).expect(200);
    expect(JSON.stringify(res.body)).to.not.include(users.ravi.password);
  });

  it('@regression rejects a wrong password with 401 and the error contract', async () => {
    const res = await authClient.login({ username: 'ravi', password: 'wrong' }).expect(401);
    await expectContract(res.body, 'Error');
  });

  it('@regression rejects a missing token and says which scheme to use', async () => {
    const res = await authClient.me().expect(401);
    expect(res.headers['www-authenticate']).to.include('Bearer');
  });

  it('@regression invalidates the token on logout', async () => {
    const token = await authClient.tokenFor(users.ravi);
    await authClient.logout(token).expect(204);
    await authClient.me(token).expect(401);
  });

  it('@regression locks the account after 5 failed logins and returns Retry-After', async () => {
    for (let attempt = 0; attempt < 5; attempt++) {
      await authClient.login({ username: 'meera', password: 'wrong' }).expect(401);
    }
    const res = await authClient.login(users.meera).expect(429);
    expect(Number(res.headers['retry-after'])).to.be.greaterThan(0);
  });
});
