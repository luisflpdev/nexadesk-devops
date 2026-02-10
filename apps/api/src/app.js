'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const pino = require('pino');
const client = require('prom-client');

// ===== Config =====
const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_VERSION = process.env.APP_VERSION || '0.0.0';
const GIT_SHA = process.env.GIT_SHA || 'local';
const SERVICE_NAME = process.env.SERVICE_NAME || 'nexadesk-api';

// ===== Logger =====
const logger = pino({
  level: process.env.LOG_LEVEL || (NODE_ENV === 'production' ? 'info' : 'debug'),
  base: {
    service: SERVICE_NAME,
    version: APP_VERSION,
    git_sha: GIT_SHA
  }
});

// ===== Metrics =====
client.collectDefaultMetrics({
  prefix: 'nexadesk_',
});

const httpRequestDuration = new client.Histogram({
  name: 'nexadesk_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5]
});

const httpRequestTotal = new client.Counter({
  name: 'nexadesk_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// ===== App =====
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationSec = Number(end - start) / 1e9;

    const route = req.route?.path || req.path;

    httpRequestDuration.labels(req.method, route, String(res.statusCode)).observe(durationSec);
    httpRequestTotal.labels(req.method, route, String(res.statusCode)).inc();

    logger.info({
      msg: 'request',
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Math.round(durationSec * 1000)
    });
  });

  next();
});

// ===== Routes =====
app.get('/healthz', (req, res) => {
  res.status(200).json({ ok: true });
});

app.get('/readyz', async (req, res) => {
  res.status(200).json({ ready: true });
});

app.get('/version', (req, res) => {
  res.status(200).json({
    service: SERVICE_NAME,
    version: APP_VERSION,
    gitSha: GIT_SHA,
    env: NODE_ENV
  });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.get('/api/ping', (req, res) => {
  res.status(200).json({
    pong: true,
    ts: new Date().toISOString()
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'not_found' });
});

// Error handler
app.use((err, req, res, _next) => {
  void _next;
  logger.error({ err }, 'unhandled_error');
  res.status(500).json({ error: 'internal_error' });
});

module.exports = { app, logger };