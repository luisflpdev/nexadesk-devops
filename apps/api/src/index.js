'use strict';

const { app, logger } = require('./app');

const PORT = Number(process.env.PORT || 3000);

const server = app.listen(PORT, () => {
  logger.info({ msg: 'server_started', port: PORT });
});

function shutdown(signal) {
  logger.warn({ msg: 'shutdown_start', signal });

  server.close((err) => {
    if (err) {
      logger.error({ err }, 'shutdown_error');
      process.exit(1);
    }
    logger.info({ msg: 'shutdown_complete' });
    process.exit(0);
  });

  setTimeout(() => {
    logger.error({ msg: 'shutdown_forced_timeout' });
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);