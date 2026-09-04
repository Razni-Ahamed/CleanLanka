import { useEffect, useState } from 'react';
import api from '../api/client';
import FilterBar from '../components/FilterBar';
import ReportCard from '../components/ReportCard';

const EMPTY_FILTERS = { search: '', status: '', wasteType: '' };

function ReportsListPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.wasteType) params.wasteType = filters.wasteType;

    api
      .get('/api/reports', { params })
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
  }, [filters, requestId]);

  const hasActiveFilters = Boolean(filters.search || filters.status || filters.wasteType);

  function handleRetry() {
    setRequestId((id) => id + 1);
  }

  return (
    <div className="page">
      <h1>Browse Reports</h1>

      <FilterBar filters={filters} onChange={setFilters} />

      {loading && <p className="field-hint">Loading reports…</p>}

      {!loading && error && (
        <div className="card empty-state">
          <p className="field-error">{error}</p>
          <button type="button" className="btn btn-primary" onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && reports.length === 0 && hasActiveFilters && (
        <div className="card empty-state">
          <p>No reports match your current filters.</p>
          <button type="button" className="btn btn-secondary" onClick={() => setFilters(EMPTY_FILTERS)}>
            Clear filters
          </button>
        </div>
      )}

      {!loading && !error && reports.length === 0 && !hasActiveFilters && (
        <div className="card empty-state">
          <p>No reports have been submitted yet.</p>
        </div>
      )}

      {!loading && !error && reports.length > 0 && (
        <>
          <p className="field-hint result-count">
            {reports.length} report{reports.length === 1 ? '' : 's'}
          </p>
          <div className="reports-grid">
            {reports.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ReportsListPage;
