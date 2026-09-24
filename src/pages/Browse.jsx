import React, { useEffect, useState, useMemo } from 'react';
import { getItems } from '../api';
import ItemCard from '../components/ItemCard';
import SearchFilters from '../components/SearchFilters';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

export default function Browse() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getItems();
      setItems(data || []);
    } catch (err) {
      setError('Unable to fetch items. Verify server is listening on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleReset = () => {
    setSearch('');
    setLocationFilter('');
    setSelectedType('all');
    setSelectedCategory('');
    setSelectedStatus('');
  };

  // Dynamic filter pipeline
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Type (lost / found)
      if (selectedType !== 'all' && item.type?.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }
      // Category
      if (selectedCategory && item.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Status
      if (selectedStatus && item.status?.toLowerCase() !== selectedStatus.toLowerCase()) {
        return false;
      }
      // Location substring
      if (
        locationFilter.trim() &&
        !item.location?.toLowerCase().includes(locationFilter.trim().toLowerCase())
      ) {
        return false;
      }
      // Search keywords across title, description, color
      if (search.trim()) {
        const q = search.toLowerCase();
        const inTitle = item.title?.toLowerCase().includes(q);
        const inDesc = item.description?.toLowerCase().includes(q);
        const inColor = item.color?.toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inColor) return false;
      }
      return true;
    });
  }, [items, search, locationFilter, selectedType, selectedCategory, selectedStatus]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Campus Lost & Found Feed
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search, filter, and discover reported belongings across facilities.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg self-start shadow-xs">
          Showing: <span className="text-indigo-600">{filteredItems.length}</span> of {items.length} records
        </div>
      </div>

      <SearchFilters
        search={search}
        setSearch={setSearch}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        onReset={handleReset}
      />

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-xl mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <Loading count={6} label="Fetching real items from database..." />
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No items found"
          message="No active records correspond to your query. Try broadening your criteria or reset filters."
          actionLabel="Clear Filters"
          onActionClick={handleReset}
        />
      )}
    </div>
  );
}