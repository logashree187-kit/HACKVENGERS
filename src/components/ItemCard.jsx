import { Link } from 'react-router-dom';

export default function ItemCard({ item }) {
  if (!item) return null; // Safety check

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{item.title}</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded ${item.type === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {item.type}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-1"><span className="font-semibold">Category:</span> {item.category}</p>
        <p className="text-sm text-gray-500 mb-1"><span className="font-semibold">Location:</span> {item.location}</p>
        <p className="text-sm text-gray-500 mb-3"><span className="font-semibold">Date:</span> {item.date}</p>
      </div>
      <Link to={`/item/${item._id}`} className="w-full text-center bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100 transition mt-4 block font-semibold">
        View Details
      </Link>
    </div>
  );
}