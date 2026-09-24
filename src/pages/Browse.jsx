import { useEffect, useState } from 'react';
import { getItems } from '../api';
import ItemCard from '../components/ItemCard';

export default function Browse() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); // All, Lost, Found

  useEffect(() => {
    getItems().then(data => setItems(data));
  }, []);

  // FRONTEND MAGIC: Filter items instantly based on search and dropdown!
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Browse Items</h1>
        
        {/* Search and Filter Controls */}
        <div className="flex w-full md:w-auto gap-2">
          <input 
            type="text" 
            placeholder="Search watches, bottles..." 
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="border border-gray-300 p-2 rounded-lg outline-none bg-white"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Items</option>
            <option value="Lost">Only Lost</option>
            <option value="Found">Only Found</option>
          </select>
        </div>
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow text-center border border-gray-100">
          <p className="text-xl text-gray-500 font-semibold mb-2">No items found.</p>
          <p className="text-gray-400">Try changing your search keywords or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}