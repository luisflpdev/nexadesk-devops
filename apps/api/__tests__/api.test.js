'use strict';

const request = require('supertest');
const { app } = require('../src/app');

describe('NexaDesk API', () => {
  test('GET /healthz -> 200', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  test('GET /readyz -> 200', async () => {
    const res = await request(app).get('/readyz');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ready: true });
  });

  test('GET /version -> 200 with keys', async () => {
    const res = await request(app).get('/version');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('service');
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('gitSha');
    expect(res.body).toHaveProperty('env');
  });

  test('GET /api/ping -> 200', async () => {
    const res = await request(app).get('/api/ping');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('pong', true);
    expect(res.body).toHaveProperty('ts');
  });

  test('GET /metrics -> 200 and contains prometheus text', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/plain/);
    expect(res.text).toMatch(/nexadesk_/);
  });

  test('GET /does-not-exist -> 404', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'not_found' });
  });
});