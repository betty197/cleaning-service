import { useEffect, useState } from "react";

function readStoredSession() {
  try {
    const serializedUser = localStorage.getItem("cleanpro_user");
    return {
      token: localStorage.getItem("cleanpro_token"),
      user: serializedUser ? JSON.parse(serializedUser) : null
    };
  } catch {
    return { token: null, user: null };
  }
}

function readTokenExpiry(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(window.atob(payload));
    return claims.exp ? new Date(claims.exp * 1000) : null;
  } catch {
    return null;
  }
}

export default function Sessions() {
  const [session, setSession] = useState(readStoredSession);
  const [checkedAt, setCheckedAt] = useState(() => new Date());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const refresh = () => {
      setSession(readStoredSession());
      setCheckedAt(new Date());
      setNow(Date.now());
    };
    const timer = window.setInterval(refresh, 5000);
    window.addEventListener("storage", refresh);
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
    };
  }, []);

  const expiresAt = session.token ? readTokenExpiry(session.token) : null;
  const credentialExpired = expiresAt && expiresAt.getTime() <= now;

  return (
    <section className="session-monitor-page">
      <div className="session-monitor-heading">
        <div>
          <span className="eyebrow">SECURITY & ACCESS</span>
          <h1>Live Session Monitor</h1>
          <p>Current authenticated session for this browser.</p>
        </div>
        <span className="session-refresh-state">
          <span className="session-live-dot" /> Live · refreshed {checkedAt.toLocaleTimeString()}
        </span>
      </div>

      <div className="session-monitor-grid">
        <article className="session-status-panel">
          <div className="session-panel-label">CURRENT SESSION</div>
          <div className="session-status-line">
            <span className={`session-status-indicator ${credentialExpired ? "is-expired" : ""}`} />
            <strong>{!session.token ? "No credential found" : credentialExpired ? "Credential expired" : "Credential present"}</strong>
          </div>
          <p>Session credentials are checked locally every 5 seconds. Server-side revocation is not available in this application.</p>
          <dl className="session-detail-list">
            <div><dt>Account</dt><dd>{session.user?.full_name || session.user?.email || "Unknown user"}</dd></div>
            <div><dt>Role</dt><dd>{session.user?.role || "Not available"}</dd></div>
            <div><dt>Token expiry</dt><dd>{expiresAt ? expiresAt.toLocaleString() : "Not provided by token"}</dd></div>
            <div><dt>Last checked</dt><dd>{checkedAt.toLocaleTimeString()}</dd></div>
          </dl>
        </article>

        <article className="session-device-panel">
          <div className="session-panel-label">THIS DEVICE</div>
          <h2>Browser session</h2>
          <p className="session-device-description">This view reflects the authenticated session stored in this browser only. It does not represent other users or devices.</p>
          <div className="session-device-meta">
            <span>Connection</span><strong>{navigator.onLine ? "Online" : "Offline"}</strong>
            <span>Browser</span><strong>{navigator.userAgentData?.brands?.[0]?.brand || navigator.userAgent.split(" ").slice(-1)[0]}</strong>
          </div>
        </article>
      </div>
    </section>
  );
}