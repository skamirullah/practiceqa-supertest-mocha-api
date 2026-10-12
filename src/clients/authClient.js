import { BaseClient } from './baseClient.js';

class AuthClient extends BaseClient {
  login(credentials) {
    return this.agent.post('/api/auth/login').send(credentials);
  }

  me(token) {
    return this.withAuth(this.agent.get('/api/auth/me'), token);
  }

  logout(token) {
    return this.withAuth(this.agent.post('/api/auth/logout'), token);
  }

  /** Logs in and returns just the token; fails loudly if the login itself breaks. */
  async tokenFor(user) {
    const res = await this.login({ username: user.username, password: user.password }).expect(200);
    return res.body.token;
  }
}

export const authClient = new AuthClient();
