const Item = require('../models/Item');

exports.getMatches = async (req, res) => {
  try {
    const targetItem = await Item.findById(req.params.itemId);
    if (!targetItem) return res.status(404).json({ success: false, message: 'Item not found' });

    const oppositeType = targetItem.type === 'lost' ? 'found' : 'lost';
    const candidates = await Item.find({ type: oppositeType, status: { $ne: 'Returned' } });

    const matches = [];

    candidates.forEach(candidate => {
      let score = 0;
      const reasons = [];

      // 1. Category (30 pts)
      if (candidate.category && targetItem.category &&
          candidate.category.toLowerCase().trim() === targetItem.category.toLowerCase().trim()) {
        score += 30;
        reasons.push('Same category');
      }

      // 2. Location (30 pts)
      if (candidate.location && targetItem.location &&
          (candidate.location.toLowerCase().includes(targetItem.location.toLowerCase()) ||
           targetItem.location.toLowerCase().includes(candidate.location.toLowerCase()))) {
        score += 30;
        reasons.push('Same location');
      }

      // 3. Color (20 pts)
      if (candidate.color && targetItem.color &&
          candidate.color.toLowerCase().trim() === targetItem.color.toLowerCase().trim()) {
        score += 20;
        reasons.push('Same color');
      }

      // 4. Keywords (10 pts)
      const targetWords = `${targetItem.title} ${targetItem.description}`.toLowerCase().split(/\s+/);
      const candidateWords = `${candidate.title} ${candidate.description}`.toLowerCase().split(/\s+/);
      const common = targetWords.filter(w => w.length > 3 && candidateWords.includes(w));
      if (common.length > 0) {
        score += 10;
        reasons.push(`Keywords matched (${[...new Set(common)].slice(0, 2).join(', ')})`);
      }

      // 5. Date Proximity (10 pts)
      if (candidate.date && targetItem.date) {
        const diffDays = Math.abs(new Date(candidate.date) - new Date(targetItem.date)) / (1000 * 60 * 60 * 24);
        if (diffDays <= 7) {
          score += 10;
          reasons.push('Dates within 7 days');
        }
      }

      if (score > 0) {
        matches.push({ itemId: candidate._id, candidate, score, reason: reasons });
      }
    });

    matches.sort((a, b) => b.score - a.score);
    res.json({ itemId: targetItem._id, targetItem, matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};