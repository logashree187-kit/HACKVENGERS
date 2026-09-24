const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Claim = require('../models/Claim');

// GET /api/dashboard - MongoDB Aggregation Analytics
router.get('/', async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    const lostItems = await Item.countDocuments({ type: 'lost' });
    const foundItems = await Item.countDocuments({ type: 'found' });
    const returnedItems = await Item.countDocuments({ status: 'Returned' });
    const pendingClaims = await Claim.countDocuments({ status: 'Pending' });

    // Aggregation 1: Group by Category
    const categoryBreakdown = await Item.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Aggregation 2: Group by Location
    const locationBreakdown = await Item.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Aggregation 3: Group by Status
    const statusBreakdown = await Item.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalItems,
        lostItems,
        foundItems,
        returnedItems,
        pendingClaims
      },
      categoryBreakdown,
      locationBreakdown,
      statusBreakdown
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;