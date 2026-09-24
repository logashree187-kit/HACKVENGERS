import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById, getMatches, createClaim } from '../api';

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // Fetch the specific item and its matches when the page loads
    getItemById(id).then(data => {
      console.log("Item Details loaded:", data);
      setItem(data);
    });
    
    getMatches(id).then(data => {
      setMatches(data);
    });
  }, [id]);

  const handleClaim = async () => {
    await createClaim({ itemId: id });
    alert("Claim request sent for Admin verification!");
    navigate('/claims'); // Redirect to claims page after clicking
  };

  // If the data hasn't loaded yet, show a loading message
  if (!item) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-500">Loading details...</h2>
      </div>
    );
  }

  return (
    <div className="py-8 grid md:grid-cols-3 gap-8">
      {/* Left Column: Item Information */}
      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <span className={`px-3 py-1 text-sm font-bold rounded ${item.type === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {item.type}
          </span>
        </div>
        
        <p className="text-gray-500 mb-6 font-semibold">Status: {item.status}</p>
        
        <div className="space-y-4 mb-8 bg-gray-50 p-4 rounded-lg">
          <p><strong className="text-gray-700">Category:</strong> {item.category}</p>
          <p><strong className="text-gray-700">Location:</strong> {item.location}</p>
          <p><strong className="text-gray-700">Date:</strong> {item.date}</p>
          <p><strong className="text-gray-700">Color:</strong> {item.color}</p>
          <p><strong className="text-gray-700">Description:</strong> {item.description}</p>
        </div>

        <button onClick={handleClaim} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition w-full md:w-auto shadow-md">
          Claim This Item
        </button>
      </div>

      {/* Right Column: AI / Possible Matches */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-100 h-fit">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          Possible Matches
        </h2>
        
        {matches.length === 0 ? (
          <p className="text-gray-500 text-sm">No matches found at the moment.</p>
        ) : (
          matches.map(m => (
            <div key={m._id} className="p-3 border border-blue-100 bg-blue-50 rounded-lg mb-3 flex justify-between items-center">
              <span className="font-semibold text-gray-800">{m.title}</span>
              <span className="text-sm font-bold text-blue-600 bg-white px-2 py-1 rounded shadow-sm">
                {m.matchPercentage}% Match
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}