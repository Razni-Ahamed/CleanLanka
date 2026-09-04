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

  // Raised by the unique index on User.email when an address is already taken.
  if (err.code === 11000) {
    return res.status(409).json({ error: 'An account with that email already exists.' });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  const status = err.statusCode || 500;
  const message = err.statusCode
    ? err.message
    : 'Something went wrong on the server';

  return res.status(status).json({ error: message });
}

module.exports = { notFound, errorHandler };
