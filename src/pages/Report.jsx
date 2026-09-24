import { useState } from 'react';
import { createItem } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Report() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', 
    type: 'Lost', 
    category: '', 
    color: '',
    description: '', 
    location: '', // Now initialized as empty to force selection
    date: '', 
    imagePreview: null 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createItem(formData);
    alert('Item reported successfully!');
    navigate('/browse');
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Report Lost/Found Item</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 space-y-5">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Title</label>
            <input required type="text" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Fastrack Watch" onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Type</label>
            <select className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="Lost">I Lost Something</option>
              <option value="Found">I Found Something</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Category</label>
            <select required className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="" disabled>Select a Category...</option>
              <option value="Mobile / Electronics">Mobile / Electronics</option>
              <option value="Wallet / Purse">Wallet / Purse</option>
              <option value="Watch / Chain / Jewelry">Watch / Chain / Jewelry</option>
              <option value="Water Bottle">Water Bottle</option>
              <option value="Bag / Backpack">Bag / Backpack</option>
              <option value="Keys">Keys</option>
              <option value="ID Card / Documents">ID Card / Documents</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Color</label>
            <input type="text" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Black & Silver" onChange={e => setFormData({...formData, color: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Upload Image (Optional)</label>
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              accept="image/*"
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const imageUrl = URL.createObjectURL(e.target.files[0]);
                  setFormData({...formData, imagePreview: imageUrl});
                }
              }} 
            />
            {formData.imagePreview && (
              <img src={formData.imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded shadow-md border border-gray-200" />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Description</label>
          <textarea required className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" rows="3" placeholder="Provide unique details like scratches, brands, or contents..." onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Campus / Location</label>
            {/* 👇 THIS IS THE NEW COLLEGE DROPDOWN 👇 */}
            <select required className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}>
              <option value="" disabled>Select College...</option>
              <option value="J.N.N Institute of Engineering">J.N.N Institute of Engineering</option>
              <option value="R.M.K. Engineering College">R.M.K. Engineering College</option>
              <option value="R.M.D. Engineering College">R.M.D. Engineering College</option>
              <option value="Saveetha Engineering College">Saveetha Engineering College</option>
              <option value="S.R.M. Institute of Science">S.R.M. Institute of Science</option>
              <option value="V.I.T. Chennai">V.I.T. Chennai</option>
              <option value="Sathyabama Institute">Sathyabama Institute</option>
              <option value="Other">Other (Specify in desc)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Date (Lost/Found)</label>
            <input required type="date" className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-md mt-4">
          Submit Report
        </button>
      </form>
    </div>
  );
}