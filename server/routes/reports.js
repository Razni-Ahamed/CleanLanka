const express = require('express');
const Report = require('../models/Report');

const router = express.Router();

const STATUSES = ['pending', 'in-progress', 'collected'];

router.post('/', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

router.get('/stats', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

router.get('/', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

router.patch('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Please choose a valid status: ${STATUSES.join(', ')}.`,
      });
    }

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
