const Item = require('../models/Item');
const Claim = require('../models/Claim');

exports.getDashboard = async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    const lostItems = await Item.countDocuments({ type: 'lost' });
    const foundItems = await Item.countDocuments({ type: 'found' });
    const returnedItems = await Item.countDocuments({ status: 'Returned' });
    const pendingClaims = await Claim.countDocuments({ status: 'Pending' });

    // MongoDB Aggregations
    const categoryBreakdown = await Item.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const locationBreakdown = await Item.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const statusBreakdown = await Item.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: { totalItems, lostItems, foundItems, returnedItems, pendingClaims },
      categoryBreakdown,
      locationBreakdown,
      statusBreakdown
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};