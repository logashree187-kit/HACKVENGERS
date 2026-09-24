const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET /api/matches/:itemId - Deterministic Smart Match algorithm
router.get('/:itemId', async (req, res) => {
  try {
    const targetItem = await Item.findById(req.params.itemId);
    if (!targetItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // Compare lost against found, or found against lost
    const oppositeType = targetItem.type === 'lost' ? 'found' : 'lost';
    const candidates = await Item.find({
      type: oppositeType,
      status: { $ne: 'Returned' }
    });

    const matches = [];

    candidates.forEach(candidate => {
      let score = 0;
      const reasons = [];

      // 1. Category match (30 points)
      if (candidate.category && targetItem.category &&
          candidate.category.toLowerCase().trim() === targetItem.category.toLowerCase().trim()) {
        score += 30;
        reasons.push('Same category');
      }

      // 2. Location match (30 points)
      if (candidate.location && targetItem.location &&
          (candidate.location.toLowerCase().includes(targetItem.location.toLowerCase()) ||
           targetItem.location.toLowerCase().includes(candidate.location.toLowerCase()))) {
        score += 30;
        reasons.push('Same location');
      }

      // 3. Color match (20 points)
      if (candidate.color && targetItem.color &&
          candidate.color.toLowerCase().trim() === targetItem.color.toLowerCase().trim()) {
        score += 20;
        reasons.push('Same color');
      }

      // 4. Keyword match in Title or Description (10 points)
      const targetWords = `${targetItem.title} ${targetItem.description}`.toLowerCase().split(/\s+/);
      const candidateWords = `${candidate.title} ${candidate.description}`.toLowerCase().split(/\s+/);
      const commonWords = targetWords.filter(w => w.length > 3 && candidateWords.includes(w));

      if (commonWords.length > 0) {
        score += 10;
        reasons.push(`Keywords matched (${[...new Set(commonWords)].slice(0, 2).join(', ')})`);
      }

      // 5. Date proximity within 7 days (10 points)
      if (candidate.date && targetItem.date) {
        const diffDays = Math.abs(new Date(candidate.date) - new Date(targetItem.date)) / (1000 * 60 * 60 * 24);
        if (diffDays <= 7) {
          score += 10;
          reasons.push('Dates within 7 days');
        }
      }

      if (score > 0) {
        matches.push({
          itemId: candidate._id,
          candidate,
          score,
          reason: reasons
        });
      }
    });

    // Sort descending by highest score
    matches.sort((a, b) => b.score - a.score);

    res.json({
      itemId: targetItem._id,
      targetItem,
      matches
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;