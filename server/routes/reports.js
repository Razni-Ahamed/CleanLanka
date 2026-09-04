const express = require('express');
const Report = require('../models/Report');

const router = express.Router();

// POST /api/reports - owned by Kishakya (report submission)
router.post('/', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

// GET /api/reports - owned by Jinathi (browse/search/filter)
router.get('/', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

// GET /api/reports/:id
router.get('/:id', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

// PATCH /api/reports/:id - owned by Razni (admin status management)
router.patch('/:id', (req, res) => {
  res.status(501).json({ error: 'Not implemented yet' });
});

module.exports = router;
