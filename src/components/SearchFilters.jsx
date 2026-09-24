import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

const CATEGORIES = ['All', 'Wallet', 'Electronics', 'Keys', 'ID Card', 'Bag', 'Clothing', 'Other'];
const STATUSES = ['All', 'Open', 'Claimed', 'Returned'];

export default function SearchFilters({
  search,
  setSearch,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  locationFilter,
  setLocationFilter,
  onReset,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm mb-6 space-y-4">
      {/* Primary search row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by keywords, title, color, or description..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Location search filter */}
        <div className="md:col-span-3">
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Filter location (e.g., Library)..."
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Type toggle switch */}
        <div className="md:col-span-3 flex items-center justify-end gap-2">
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 w-full sm:w-auto">
            {['all', 'lost', 'found'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedType(t)}
                className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold rounded-md capitalize transition ${
                  selectedType === t
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onReset}
            className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            title="Reset filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Pills & Status */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition whitespace-nowrap ${
                (selectedCategory === '' && cat === 'All') || selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-slate-200 rounded-md py-1 px-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700"
          >
            {STATUSES.map((st) => (
              <option key={st} value={st === 'All' ? '' : st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}