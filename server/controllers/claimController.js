const Claim = require('../models/Claim');
const Item = require('../models/Item');

exports.createClaim = async (req, res) => {
  try {
    const { itemId, claimantId, message } = req.body;
    const targetItem = await Item.findById(itemId);
    if (!targetItem) return res.status(404).json({ success: false, message: 'Item not found' });

    const newClaim = new Claim({
      itemId,
      claimantId: claimantId || '654321654321654321654321', // Fallback ID for demo
      message
    });

    const savedClaim = await newClaim.save();
    targetItem.status = 'Claimed';
    await targetItem.save();

    res.status(201).json({ success: true, message: 'Claim submitted successfully', claim: savedClaim });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getClaims = async (req, res) => {
  try {
    const claims = await Claim.find().populate('itemId').sort({ createdAt: -1 });
    res.json({ success: true, count: claims.length, claims });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateClaimStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ success: false, message: 'Claim not found' });

    claim.status = status;
    await claim.save();

    if (status === 'Approved') {
      await Item.findByIdAndUpdate(claim.itemId, { status: 'Returned' });
    } else if (status === 'Rejected') {
      await Item.findByIdAndUpdate(claim.itemId, { status: 'Open' });
    }

    res.json({ success: true, message: `Claim status updated to ${status}`, claim });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};