const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Item = require('../models/Item');

// 1. POST /api/claims - Submit a claim
router.post('/', async (req, res) => {
  try {
    const { itemId, claimantId, message } = req.body;

    const targetItem = await Item.findById(itemId);
    if (!targetItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const newClaim = new Claim({
      itemId,
      claimantId: claimantId || '654321654321654321654321', // Fallback ID for hackathon demo
      message
    });

    const savedClaim = await newClaim.save();

    // Mark item as Claimed while under review
    targetItem.status = 'Claimed';
    await targetItem.save();

    res.status(201).json({
      success: true,
      message: 'Claim submitted successfully',
      claim: savedClaim
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. GET /api/claims - Get all claims
router.get('/', async (req, res) => {
  try {
    const claims = await Claim.find().populate('itemId').sort({ createdAt: -1 });
    res.json({ success: true, count: claims.length, claims });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. PUT /api/claims/:id - Approve or Reject a claim
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    claim.status = status;
    await claim.save();

    // When approved, mark item as Returned
    if (status === 'Approved') {
      await Item.findByIdAndUpdate(claim.itemId, { status: 'Returned' });
    } else if (status === 'Rejected') {
      await Item.findByIdAndUpdate(claim.itemId, { status: 'Open' });
    }

    res.json({
      success: true,
      message: `Claim status updated to ${status}`,
      claim
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;