function notFound(req, res) {
  res.status(404).json({ error: 'Route not found' });
}

// Express identifies an error handler by its four arguments, so `next` has to
// stay in the signature even though it isn't called.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  // Mongoose schema validation - surface the field messages, not the stack.
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((fieldError) => fieldError.message)
      .join(' ');
    return res.status(400).json({ error: message });
  }

  // A malformed Mongo id (e.g. /api/reports/not-an-id).
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
