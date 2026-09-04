import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

function Landing() {
  const [stats, setStats] = useState(null);
  const [statsError, setStatsError] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .get('/api/reports/stats')
      .then((res) => {
        if (!cancelled) setStats(res.data);
      })
      .catch(() => {
        if (!cancelled) setStatsError(true);
      })
      .finally(() => {
        if (!cancelled) setLoadingStats(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <h1>CleanLK</h1>
        <p className="hero-tagline">
          Report an overflowing bin or a missed collection in under a
          minute — and see exactly what happens to it next.
        </p>
        <Link to="/report" className="btn btn-primary btn-large">
          Report an Issue
        </Link>
      </section>

      <section className="card">
        <h2>The problem</h2>
        <p>
          Garbage collection in many Sri Lankan neighbourhoods is inconsistent
          and unpredictable. A truck might skip a street for weeks, or a bin
          might sit overflowing on a main road with no one responsible for
          noticing. When residents do complain, it usually means a phone call
          that nobody logs and nobody can follow up on. Local councils end up
          working blind — with no shared, central view of where the problems
          actually are or which areas need attention most.
        </p>
        <p>
          It hurts two groups directly: <strong>residents</strong> who live
          beside uncollected waste and have no reliable way to flag it, and{' '}
          <strong>council staff</strong> who want to respond but have no data
          to work from.
        </p>
      </section>

      <section className="card">
        <h2>The solution</h2>
        <p>
          CleanLK gives both sides a shared system. A citizen files a report
          in under a minute — location, waste type, a short description, and
          an optional photo. Every report lands in one shared list instead of
          a phone call that goes nowhere. Council staff then move each report
          through <span className="badge badge-pending">Pending</span>{' '}
          <span className="badge badge-progress">In Progress</span>{' '}
          <span className="badge badge-collected">Collected</span>, and
          anyone can see the current status at any time.
        </p>
      </section>

      <section className="card">
        <h2>Live impact</h2>
        {loadingStats && <p>Loading live stats…</p>}
        {!loadingStats && statsError && (
          <p>
            Live stats are unavailable right now — check back shortly. The
            rest of CleanLK still works as normal.
          </p>
        )}
        {!loadingStats && !statsError && stats && (
          <>
            <div className="stats-grid">
              <div className="stat-tile">
                <span className="stat-number">{stats.total}</span>
                <span className="stat-label">Total reports</span>
              </div>
              <div className="stat-tile">
                <span className="stat-number">{stats.pending}</span>
                <span className="stat-label">Pending</span>
              </div>
              <div className="stat-tile">
                <span className="stat-number">{stats.inProgress}</span>
                <span className="stat-label">In progress</span>
              </div>
              <div className="stat-tile">
                <span className="stat-number">{stats.collected}</span>
                <span className="stat-label">Collected</span>
              </div>
            </div>

            {stats.topAreas && stats.topAreas.length > 0 && (
              <div className="top-areas">
                <h3>Most-affected areas</h3>
                <ul>
                  {stats.topAreas.map((area) => (
                    <li key={area.area}>
                      {area.area} — {area.count}{' '}
                      {area.count === 1 ? 'report' : 'reports'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>

      <section className="card">
        <h2>How it works</h2>
        <ol className="steps">
          <li>
            <strong>Spot a problem.</strong> An overflowing bin, a missed
            collection, illegal dumping — anything that needs council
            attention.
          </li>
          <li>
            <strong>Report it.</strong> Add the location, waste type, a short
            description and, if you have one, a photo.
          </li>
          <li>
            <strong>Council picks it up.</strong> Staff see every report in
            one shared list and start working on it.
          </li>
          <li>
            <strong>Track the status.</strong> Watch it move from pending to
            in progress to collected — no phone calls needed.
          </li>
        </ol>
      </section>
    </div>
  );
}

export default Landing;
