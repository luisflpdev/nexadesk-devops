'use strict';

const http = require('http');
const pino = require('pino');
const client = require('prom-client');

// ===== Config =====
const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_VERSION = process.env.APP_VERSION || '0.0.0';
const GIT_SHA = process.env.GIT_SHA || 'local';
const SERVICE_NAME = process.env.SERVICE_NAME || 'nexadesk-worker';

const METRICS_PORT = Number(process.env.METRICS_PORT || 9090);
const JOB_INTERVAL_MS = Number(process.env.JOB_INTERVAL_MS || 2000);

// ===== Logger =====
const logger = pino({
  level: process.env.LOG_LEVEL || (NODE_ENV === 'production' ? 'info' : 'debug'),
  base: { service: SERVICE_NAME, version: APP_VERSION, git_sha: GIT_SHA }
});

// ===== Metrics =====
client.collectDefaultMetrics({ prefix: 'nexadesk_' });

const jobsProcessed = new client.Counter({
  name: 'nexadesk_worker_jobs_processed_total',
  help: 'Total number of jobs processed by the worker',
  labelNames: ['result']
});

const jobDuration = new client.Histogram({
  name: 'nexadesk_worker_job_duration_seconds',
  help: 'Duration of worker jobs in seconds',
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5]
});

// ===== Metrics server =====
const metricsServer = http.createServer(async (req, res) => {
  if (req.url === '/metrics') {
    res.writeHead(200, { 'Content-Type': client.register.contentType });
    res.end(await client.register.metrics());
    return;
  }
  if (req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not_found' }));
});

metricsServer.listen(METRICS_PORT, () => {
  logger.info({ msg: 'metrics_server_started', port: METRICS_PORT });
});

// ===== Worker loop =====
let isShuttingDown = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function doJob() {
  // Simulação profissional (estrutura real): mede duração e resultado.
  const endTimer = jobDuration.startTimer();
  try {
    // "Trabalho" do job (simulado)
    await sleep(200 + Math.floor(Math.random() * 300));

    // Simula chance baixa de falha
    const failed = Math.random() < 0.03;
    if (failed) {
      throw new Error('simulated_job_failure');
    }

    jobsProcessed.labels('success').inc();
    logger.info({ msg: 'job_processed', result: 'success' });
  } catch (err) {
    jobsProcessed.labels('error').inc();
    logger.warn({ msg: 'job_processed', result: 'error', err: err.message });
  } finally {
    endTimer();
  }
}

async function loop() {
  logger.info({ msg: 'worker_started', intervalMs: JOB_INTERVAL_MS });

  while (!isShuttingDown) {
    await doJob();
    await sleep(JOB_INTERVAL_MS);
  }

  logger.info({ msg: 'worker_stopped' });
}

loop().catch((err) => {
  logger.error({ err }, 'worker_crash');
  process.exit(1);
});

// ===== Graceful shutdown =====
async function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.warn({ msg: 'shutdown_start', signal });

  // Fecha servidor de métricas
  metricsServer.close((err) => {
    if (err) {
      logger.error({ err }, 'metrics_shutdown_error');
    } else {
      logger.info({ msg: 'metrics_shutdown_complete' });
    }
  });

  // Dá um tempo pro loop encerrar
  setTimeout(() => {
    logger.info({ msg: 'shutdown_complete' });
    process.exit(0);
  }, 1000).unref();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);