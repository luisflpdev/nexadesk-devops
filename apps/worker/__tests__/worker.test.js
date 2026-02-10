'use strict';

describe('Worker sanity', () => {
  test('process env defaults should not crash', () => {
    // Teste simples: garante que valores padrão são coerentes
    const METRICS_PORT = Number(process.env.METRICS_PORT || 9090);
    const JOB_INTERVAL_MS = Number(process.env.JOB_INTERVAL_MS || 2000);

    expect(Number.isFinite(METRICS_PORT)).toBe(true);
    expect(METRICS_PORT).toBeGreaterThan(0);

    expect(Number.isFinite(JOB_INTERVAL_MS)).toBe(true);
    expect(JOB_INTERVAL_MS).toBeGreaterThan(0);
  });
});