import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Cohesive demo items that match your Claims and Admin pages
const DEFAULT_BROWSE_ITEMS = [
  {
    _id: 'item_1',
    title: 'Titan Fastrack Watch',
    type: 'found',
    category: 'Accessories (Watch, Glasses, Rings)',
    location: 'Canteen / Cafeteria, V.I.T. Chennai',
    date: '2026-09-23',
    color: 'Silver & Black',
    description: 'Silver mesh strap watch found on the table near the juice counter.',
    status: 'Claimed'
  },
  {
    _id: 'item_2',
    title: 'Blue Hydro Flask 32oz',
    type: 'lost',
    category: 'Bottles & Flasks',
    location: 'Library / Study Hall, V.I.T. Chennai',
    date: '2026-09-24',
    color: 'Navy Blue',
    description: '32oz wide mouth flask covered with GitHub and programming stickers.',
    status: 'Pending'
  },
  {
    _id: 'item_3',
    title: 'Apple AirPods Pro (2nd Gen)',
    type: 'found',
    category: 'Electronics (Laptop, Phone, Charger)',
    location: 'Main Block, V.I.T. Chennai',
    date: '2026-09-24',
    color: 'White',
    description: 'Found in Classroom 302 on the third row bench after class.',
    status: 'Open'
  },
  {
    _id: 'item_4',
    title: 'Scientific Calculator fx-991EX',
    type: 'lost',
    category: 'Electronics (Laptop, Phone, Charger)',
    location: 'Computer Lab / Workshop, V.I.T. Chennai',
    date: '2026-09-21',
    color: 'Black',
    description: 'Casio ClassWiz calculator with my name written in marker inside the cover.',
    status: 'Open'
  }
];

export default function Browse() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function fetchItems() {
      try {
        // Try real backend first
        const response = await fetch('http://localhost:5000/api/items');
        if (!response.ok) throw new Error('Backend offline');
        const data = await response.json();
        setItems(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.warn('Backend offline: Loading synchronized preview items.');
        // Load default items + any items you just reported on the Report page!
        const localSaved = JSON.parse(localStorage.getItem('preview_items') || '[]');
        setItems([...localSaved, ...DEFAULT_BROWSE_ITEMS]);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  // Filter items based on search and dropdowns
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.location?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());

    const matchesType = selectedType === 'all' || item.type?.toLowerCase() === selectedType.toLowerCase();
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Browse Lost & Found Items</h1>
          <p className="text-sm text-slate-500">Search and filter reported items across campus.</p>
        </div>
        <Link
          to="/report"
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-sm"
        >
          + Report New Item
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="🔍 Search title, location, description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types (Lost & Found)</option>
          <option value="lost">Lost Items Only</option>
          <option value="found">Found Items Only</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-slate-300 rounded-xl px-3.5 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="Electronics (Laptop, Phone, Charger)">Electronics</option>
          <option value="Bottles & Flasks">Bottles & Flasks</option>
          <option value="Accessories (Watch, Glasses, Rings)">Accessories</option>
          <option value="ID Cards / Documents">ID Cards / Documents</option>
          <option value="Bags & Backpacks">Bags & Backpacks</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Item Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading campus items...</div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          No items match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const isLost = item.type?.toLowerCase() === 'lost';

            return (
              <div
                key={item._id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2.5">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isLost ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                      {item.status || 'Open'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-1 mb-1">{item.title}</h3>
                  <p className="text-xs text-blue-600 font-medium mb-3 line-clamp-1">{item.category}</p>

                  <div className="text-xs text-slate-500 space-y-1.5 mb-4">
                    <p className="line-clamp-1">📍 {item.location}</p>
                    <p>🗓️ {item.date ? new Date(item.date).toLocaleDateString() : 'Recent'}</p>
                    {item.color && <p>🎨 Color: {item.color}</p>}
                  </div>
                </div>

                <Link
                  to={`/item/${item._id}`}
                  className="block text-center w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-600 font-semibold text-xs rounded-xl border border-slate-200 transition"
                >
                  View Details & Matches →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}