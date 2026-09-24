import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const COLLEGES = [
  'J.N.N Institute of Engineering',
  'R.M.K. Engineering College',
  'R.M.D. Engineering College',
  'Saveetha Engineering College',
  'S.R.M. Institute of Science',
  'V.I.T. Chennai',
  'Sathyabama Institute',
  'Other',
];

const CAMPUS_LOCATIONS = [
  'Main Block',
  'Canteen / Cafeteria',
  'Classroom',
  'Auditorium',
  'Department Block',
  'Playground / Sports Ground',
  'Library / Study Hall',
  'Computer Lab / Workshop',
  'Hostel / Dormitory',
  'Parking Lot / Bus Bay',
  'Admin Office',
  'Other',
];

const CATEGORIES = [
  'Electronics (Laptop, Phone, Charger)',
  'Bottles & Flasks',
  'ID Cards / Documents',
  'Accessories (Watch, Glasses, Rings)',
  'Bags & Backpacks',
  'Clothing',
  'Keys / Wallets',
  'Books & Stationery',
  'Other',
];

export default function Report() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('lost');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [college, setCollege] = useState('');
  const [customCollege, setCustomCollege] = useState('');
  const [locationSpot, setLocationSpot] = useState('');
  const [customLocationSpot, setCustomLocationSpot] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    const finalCollege = college === 'Other' ? customCollege.trim() : college;
    const finalSpot = locationSpot === 'Other' ? customLocationSpot.trim() : locationSpot;

    if (!finalCollege || !finalSpot) {
      setStatusMessage({ type: 'error', text: 'Please fill in both College and Location Spot.' });
      setSubmitting(false);
      return;
    }

    const payload = {
      title: title.trim(),
      type: type,
      category: category || 'Other',
      color: color.trim(),
      location: `${finalSpot}, ${finalCollege}`,
      description: description.trim(),
      date: date,
    };

    try {
      // Tries to connect to backend
      const response = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }

      alert('Item submitted successfully to backend!');
      navigate('/browse');
    } catch (err) {
      // Backend is offline on your laptop: Prevent crash & simulate success
      console.warn('Backend server offline. Running in local preview mode:', err.message);

      // Save locally so you don't lose data while testing UI
      const existing = JSON.parse(localStorage.getItem('preview_items') || '[]');
      existing.unshift({ _id: Date.now().toString(), ...payload, status: 'Open' });
      localStorage.setItem('preview_items', JSON.stringify(existing));

      setStatusMessage({
        type: 'success',
        text: 'Preview mode: Item saved locally (backend is offline on this laptop).',
      });

      setTimeout(() => {
        navigate('/browse');
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Report an Item</h2>
        <p className="text-sm text-slate-500 mb-6">File a claim for a misplaced or discovered item.</p>

        {statusMessage && (
          <div
            className={`mb-5 p-3.5 border rounded-xl text-sm font-medium ${
              statusMessage.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Title & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Fastrack Watch"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="lost">I Lost Something</option>
                <option value="found">I Found Something</option>
              </select>
            </div>
          </div>

          {/* Row 2: Category & Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a Category...</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Color</label>
              <input
                type="text"
                placeholder="e.g. Black & Silver"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 3: College & Campus Location Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">College / Campus</label>
              <select
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select College...</option>
                {COLLEGES.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Campus Location / Spot</label>
              <select
                required
                value={locationSpot}
                onChange={(e) => setLocationSpot(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Location Spot...</option>
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic Inputs when "Other" is selected */}
          {(college === 'Other' || locationSpot === 'Other') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
              {college === 'Other' ? (
                <div>
                  <label className="block text-xs font-semibold text-blue-700 mb-1">Enter College Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Loyola College"
                    value={customCollege}
                    onChange={(e) => setCustomCollege(e.target.value)}
                    className="w-full border border-blue-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : <div />}

              {locationSpot === 'Other' ? (
                <div>
                  <label className="block text-xs font-semibold text-blue-700 mb-1">Specify Location Spot *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Near Gate 3 Water Cooler"
                    value={customLocationSpot}
                    onChange={(e) => setCustomLocationSpot(e.target.value)}
                    className="w-full border border-blue-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : <div />}
            </div>
          )}

          {/* Row 4: Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea
              rows="3"
              required
              placeholder="Brand markings, stickers, serial numbers, scratches, or contents..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Row 5: Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date (Lost/Found)</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl transition shadow-sm hover:shadow disabled:bg-blue-300"
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}