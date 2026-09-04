import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import ReportCard from '../components/ReportCard';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'collected', label: 'Collected' },
];

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyIds, setBusyIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    api
      .get('/api/reports')
      .then((res) => {
        if (cancelled) return;
        setReports(res.data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.error || 'Could not load reports. Please try again.');
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [requestId]);

  const counts = useMemo(() => {
    const tally = { pending: 0, 'in-progress': 0, collected: 0 };

    reports.forEach((report) => {
      if (report.status in tally) tally[report.status] += 1;
    });

    return tally;
  }, [reports]);

  const visibleReports = statusFilter
    ? reports.filter((report) => report.status === statusFilter)
    : reports;

  function markBusy(id) {
    setBusyIds((ids) => [...ids, id]);
  }

  function clearBusy(id) {
    setBusyIds((ids) => ids.filter((busyId) => busyId !== id));
  }

  async function handleStatusChange(report, nextStatus) {
    if (report.status === nextStatus) return;

    setActionError('');
    markBusy(report._id);

    try {
      const res = await api.patch(`/api/reports/${report._id}`, { status: nextStatus });
      setReports((current) =>
        current.map((item) => (item._id === report._id ? res.data : item))
      );
    } catch (err) {
      setActionError(
        err.response?.data?.error || 'Could not update that report. Please try again.'
      );
    } finally {
      clearBusy(report._id);
    }
  }

  async function handleDelete(report) {
    const confirmed = window.confirm(`Delete the report from ${report.location}?`);
    if (!confirmed) return;

    setActionError('');
    markBusy(report._id);

    try {
      await api.delete(`/api/reports/${report._id}`);
      setReports((current) => current.filter((item) => item._id !== report._id));
    } catch (err) {
      setActionError(
        err.response?.data?.error || 'Could not delete that report. Please try again.'
      );
    } finally {
      clearBusy(report._id);
    }
  }

  function renderActions(report) {
    const busy = busyIds.includes(report._id);

    return (
      <div className="admin-actions">
        <div className="admin-status-controls">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`btn btn-sm ${
                report.status === option.value ? 'btn-primary' : 'btn-secondary'
              }`}
              disabled={busy || report.status === option.value}
              onClick={() => handleStatusChange(report, option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-sm btn-danger"
          disabled={busy}
          onClick={() => handleDelete(report)}
        >
          Delete
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>

      <p className="admin-note">
        Municipal staff view for tracking and updating reported issues. This
        prototype has no login, so anyone with the link can update a status.
      </p>

      <div className="stats-grid">
        <div className="stat-tile">
          <span className="stat-number">{reports.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-tile">
          <span className="stat-number">{counts.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-tile">
          <span className="stat-number">{counts['in-progress']}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-tile">
          <span className="stat-number">{counts.collected}</span>
          <span className="stat-label">Collected</span>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="form-group admin-filter">
          <label className="form-label" htmlFor="admin-status-filter">
            Show
          </label>
          <select
            id="admin-status-filter"
            className="form-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">All reports</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {actionError && <div className="alert alert-error">{actionError}</div>}

      {loading && <p className="loading">Loading reports…</p>}

      {!loading && error && (
        <div className="card empty-state">
          <p className="field-error">{error}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setRequestId((id) => id + 1)}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && reports.length === 0 && (
        <div className="card empty-state">
          <p>No reports have been submitted yet.</p>
        </div>
      )}

      {!loading && !error && reports.length > 0 && visibleReports.length === 0 && (
        <div className="card empty-state">
          <p>No reports with this status.</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setStatusFilter('')}
          >
            Show all reports
          </button>
        </div>
      )}

      {!loading && !error && visibleReports.length > 0 && (
        <>
          <p className="field-hint result-count">
            {visibleReports.length} report{visibleReports.length === 1 ? '' : 's'}
          </p>
          <div className="reports-grid">
            {visibleReports.map((report) => (
              <ReportCard key={report._id} report={report} actions={renderActions(report)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
