import { useEffect, useState } from 'react';

const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'collected', label: 'Collected' },
];

const WASTE_TYPES = ['Household', 'Plastic', 'Organic', 'Other'];

const EMPTY_FILTERS = { search: '', status: '', wasteType: '' };

function FilterBar({ filters, onChange }) {
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  useEffect(() => {
    if (searchInput === filters.search) return undefined;

    const timeoutId = setTimeout(() => {
      onChange({ ...filters, search: searchInput });
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function handleClear() {
    setSearchInput('');
    onChange(EMPTY_FILTERS);
  }

  const hasActiveFilters = filters.search || filters.status || filters.wasteType;

  return (
    <div className="filter-bar">
      <input
        type="text"
        className="form-input filter-search"
        placeholder="Search by location or description…"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        aria-label="Search reports"
      />

      <select
        className="form-select filter-select"
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        className="form-select filter-select"
        value={filters.wasteType}
        onChange={(e) => onChange({ ...filters, wasteType: e.target.value })}
        aria-label="Filter by waste type"
      >
        <option value="">All waste types</option>
        {WASTE_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={handleClear}
        disabled={!hasActiveFilters}
      >
        Clear filters
      </button>
    </div>
  );
}

export default FilterBar;
