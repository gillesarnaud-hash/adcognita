const request = require('supertest');
const app = require('../server');

describe('Auth API', () => {
  const testUser = { email: `test_${Date.now()}@test.fr`, password: 'Test1234!', firstName: 'Test', lastName: 'User' };
  let accessToken;

  it('POST /api/auth/register — crée un compte', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('POST /api/auth/login — connecte un utilisateur', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    accessToken = res.body.data.accessToken;
  });

  it('POST /api/auth/login — rejette un mauvais mot de passe', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testUser.email, password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me — retourne le profil avec token valide', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(testUser.email);
  });

  it('GET /api/auth/me — refuse sans token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('Health', () => {
  it('GET /health — retourne ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
