const express = require('express');
const Report = require('../models/Report');

const router = express.Router();

const STATUSES = ['pending', 'in-progress', 'collected'];
const WASTE_TYPES = ['Household', 'Plastic', 'Organic', 'Other'];

router.post('/', async (req, res, next) => {
  const { location, wasteType, description, imageUrl, reportedBy } = req.body;
  const errors = [];

  const trimmedLocation = typeof location === 'string' ? location.trim() : '';
  if (!trimmedLocation) {
    errors.push('Please tell us where the problem is.');
  }

  if (!wasteType || !WASTE_TYPES.includes(wasteType)) {
    errors.push(`Please choose a valid waste type: ${WASTE_TYPES.join(', ')}.`);
  }

  const trimmedDescription = typeof description === 'string' ? description.trim() : '';
  if (!trimmedDescription) {
    errors.push('Please describe the problem.');
  } else if (trimmedDescription.length > 300) {
    errors.push('Please keep the description under 300 characters.');
  }

  if (imageUrl && (typeof imageUrl !== 'string' || !imageUrl.startsWith('http'))) {
    errors.push('The photo link looks invalid.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(' ') });
  }

  const trimmedReportedBy =
    typeof reportedBy === 'string' && reportedBy.trim() ? reportedBy.trim() : 'Anonymous';

  try {
    const report = await Report.create({
      location: trimmedLocation,
      wasteType,
      description: trimmedDescription,
      imageUrl: imageUrl || '',
      reportedBy: trimmedReportedBy,
    });

    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    const statusCounts = await Report.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const counts = { pending: 0, 'in-progress': 0, collected: 0 };
    let total = 0;
    statusCounts.forEach(({ _id, count }) => {
      if (_id in counts) counts[_id] = count;
      total += count;
    });

    const topAreasResult = await Report.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const topAreas = topAreasResult.map(({ _id, count }) => ({
      area: _id,
      count,
    }));

    res.json({
      total,
      pending: counts.pending,
      inProgress: counts['in-progress'],
      collected: counts.collected,
      topAreas,
    });
  } catch (err) {
    next(err);
  }
});

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.get('/', async (req, res, next) => {
  try {
    const { status, area, wasteType, search } = req.query;
    const filter = {};

    if (status) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({
          error: `Please choose a valid status: ${STATUSES.join(', ')}.`,
        });
      }
      filter.status = status;
    }

    if (wasteType) {
      if (!WASTE_TYPES.includes(wasteType)) {
        return res.status(400).json({
          error: `Please choose a valid waste type: ${WASTE_TYPES.join(', ')}.`,
        });
      }
      filter.wasteType = wasteType;
    }

    if (area) {
      filter.location = new RegExp(escapeRegex(area), 'i');
    }

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ location: searchRegex }, { description: searchRegex }];
    }

    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (err) {
    next(err);
  }
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
