import StatusBadge from './StatusBadge';

function timeAgo(dateValue) {
  const date = new Date(dateValue);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;

  return date.toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' });
}

function ReportCard({ report, children, actions }) {
  const { location, wasteType, description, imageUrl, reportedBy, status, createdAt } = report;

  return (
    <div className="card report-card">
      <div className="report-card-header">
        <h3 className="report-card-location">{location}</h3>
        <StatusBadge status={status} />
      </div>

      <p className="report-card-waste-type">{wasteType}</p>

      {imageUrl && (
        <img className="report-card-image" src={imageUrl} alt={`Reported issue at ${location}`} />
      )}

      <p className="report-card-description">{description}</p>

      <p className="report-card-meta">
        Reported by {reportedBy} &middot; {timeAgo(createdAt)}
      </p>

      {(actions || children) && <div className="report-card-actions">{actions || children}</div>}
    </div>
  );
}

export default ReportCard;
