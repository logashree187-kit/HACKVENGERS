const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['lost', 'found'], required: true },
  category: { type: String, required: true }, // e.g., Wallet, Electronics, Keys
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  color: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Claimed', 'Returned'], default: 'Open' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // links to User
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);