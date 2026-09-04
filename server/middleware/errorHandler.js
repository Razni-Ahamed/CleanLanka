function notFound(req, res) {
  res.status(404).json({ error: 'Route not found' });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((fieldError) => fieldError.message)
      .join(' ');
    return res.status(400).json({ error: message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid report ID' });
  }

  const status = err.statusCode || 500;
  const message = err.statusCode
    ? err.message
    : 'Something went wrong on the server';

  return res.status(status).json({ error: message });
}

module.exports = { notFound, errorHandler };
