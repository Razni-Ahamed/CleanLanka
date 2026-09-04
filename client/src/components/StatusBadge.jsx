const STATUS_META = {
  pending: { label: 'Pending', className: 'badge-pending' },
  'in-progress': { label: 'In Progress', className: 'badge-progress' },
  collected: { label: 'Collected', className: 'badge-collected' },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, className: 'badge-pending' };

  return <span className={`badge ${meta.className}`}>{meta.label}</span>;
}

export default StatusBadge;
