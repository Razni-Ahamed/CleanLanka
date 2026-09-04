const express = require('express');
const Report = require('../models/Report');

const router = express.Router();

const STATUSES = ['pending', 'in-progress', 'collected'];

// POST /api/reports - owned by Kishakya (report submission)
router.post('/', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

// GET /api/reports/stats - owned by Amalki (landing page impact stats).
// Keep this above GET /:id: Express matches in order, so declaring /:id first
// would treat the literal string "stats" as an id.
router.get('/stats', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

// GET /api/reports - owned by Jinathi (browse/search/filter)
router.get('/', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

// GET /api/reports/:id - owned by Jinathi
router.get('/:id', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

// PATCH /api/reports/:id - admin status update
router.patch('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Please choose a valid status: ${STATUSES.join(', ')}.`,
      });
    }

    // Only the status is updatable here, so a bad request can't overwrite the
    // location or description of a report it doesn't own.
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/reports/:id - remove a resolved or spam report
router.delete('/:id', async (req, res, next) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ message: 'Report deleted', report });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
