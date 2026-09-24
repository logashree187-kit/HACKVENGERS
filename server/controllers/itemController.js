const Item = require('../models/Item');

exports.createItem = async (req, res) => {
  try {
    const { title, type, category, description, location, date, color, reportedBy } = req.body;
    const newItem = new Item({
      title,
      type,
      category,
      description,
      location,
      date,
      color,
      reportedBy: reportedBy || null,
      status: 'Open'
    });
    const savedItem = await newItem.save();
    res.status(201).json({ success: true, message: 'Item reported successfully', item: savedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedItem) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};