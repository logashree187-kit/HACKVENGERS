import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { createItem } from '../api';

const CATEGORIES = ['Wallet', 'Electronics', 'Keys', 'ID Card', 'Bag', 'Clothing', 'Other'];

export default function Report() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [createdItem, setCreatedItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'lost',
    category: 'Electronics',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    color: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await createItem({
        ...formData,
      });

      // Safely resolve the item object whether wrapped in response.data, response.item, or direct
      const resolved = response?.item || response?.data || response;
      setCreatedItem(resolved);

      // Reset form
      setFormData({
        title: '',
        type: 'lost',
        category: 'Electronics',
        description: '',
        location: '',
        date: new Date().toISOString().split('T')[0],
        color: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit item report.');
    } finally {
      setSubmitting(false);
    }
  };

  // Safely extract the MongoDB ObjectId
  const resolvedItemId =
    createdItem?._id || createdItem?.item?._id || createdItem?.data?._id || createdItem?.id;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Report an Item
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          Submit details into campus database to trigger instant deterministic matching.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {createdItem && (
          <div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 text-xs sm:text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Report filed successfully into LostFound+!</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {resolvedItemId ? (
                <Link
                  to={`/items/${resolvedItemId}`}
                  className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 inline-flex items-center gap-1"
                >
                  Inspect Item Matches <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link
                  to="/browse"
                  className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 inline-flex items-center gap-1"
                >
                  Browse Items <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
              <Link
                to="/browse"
                className="px-3.5 py-1.5 bg-white border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold hover:bg-emerald-50"
              >
                Back to Feed
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Report Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: 'lost' }))}
                className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                  formData.type === 'lost'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-200'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                I Lost An Item
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: 'found' }))}
                className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                  formData.type === 'found'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                I Found An Item
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Item Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g., Apple AirPods Pro Case with Pikachu Keychain"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Dominant Color <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="color"
                required
                placeholder="e.g., Space Gray, Black, Red"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Campus Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g., Library 2nd Floor, Room 204"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Date Discovered / Lost <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Description & Identifying Marks <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Include unique keywords, scratches, brand names, or specific contents to maximize match precision."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/browse')}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Publish Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}