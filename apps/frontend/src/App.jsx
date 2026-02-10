import { useEffect, useState } from 'react';

function StatusPill({ ok, text }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 10px',
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.15)',
        background: ok ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
        color: ok ? '#86efac' : '#fca5a5',
        fontSize: 12,
        fontWeight: 600
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: ok ? '#22c55e' : '#ef4444',
          display: 'inline-block'
        }}
      />
      {text}
    </span>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [apiOk, setApiOk] = useState(false);
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState(null);

  async function fetchPing() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ping', { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setPayload(data);
      setApiOk(true);
    } catch (e) {
      setApiOk(false);
      setPayload(null);
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPing();
  }, []);

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>NexaDesk</h1>
          <p className="subtitle">
            Frontend SPA (Vite + React) consumindo a API em <code>/api</code>
          </p>
        </div>

        <div className="actions">
          {loading ? (
            <StatusPill ok={false} text="Checando API..." />
          ) : apiOk ? (
            <StatusPill ok={true} text="API Online" />
          ) : (
            <StatusPill ok={false} text="API Offline" />
          )}

          <button className="btn" onClick={fetchPing} disabled={loading}>
            {loading ? 'Atualizando...' : 'Recarregar'}
          </button>
        </div>
      </header>

      <main className="content">
        <section className="card">
          <h2>Status</h2>

          {loading && <p>Carregando status da API...</p>}

          {!loading && apiOk && (
            <>
              <p className="ok">Conexão com a API estabelecida.</p>
              <pre className="codeblock">{JSON.stringify(payload, null, 2)}</pre>
            </>
          )}

          {!loading && !apiOk && (
            <>
              <p className="error">Não foi possível acessar a API.</p>
              {error && <pre className="codeblock">{error}</pre>}
              <p className="hint">
                Em Kubernetes, o Ingress vai rotear <code>/api</code> para o serviço da API.
              </p>
            </>
          )}
        </section>

        <section className="card">
          <h2>Observabilidade</h2>
          <ul>
            <li>API expõe métricas em <code>/metrics</code> (Prometheus).</li>
            <li>Worker expõe métricas em <code>:9090/metrics</code>.</li>
            <li>Health checks: <code>/healthz</code> e <code>/readyz</code> (Kubernetes probes).</li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <span>Projeto DevOps: CI/CD • GitOps • Observabilidade</span>
      </footer>
    </div>
  );
}