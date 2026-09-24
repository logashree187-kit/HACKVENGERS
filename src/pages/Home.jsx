import { Link } from 'react-router-dom';
import { Search, PlusCircle, CheckCircle } from 'lucide-react'; // Professional Icons

export default function Home() {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <div className="text-center mb-20 mt-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 pb-2">
          Lost It? Found It? <br /> Let's Get It Back.
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          The smartest campus lost and found platform. We connect lost items with their rightful owners across colleges in seconds.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/report" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 text-lg">
            <PlusCircle size={22} /> Report Item
          </Link>
          <Link to="/browse" className="bg-white border-2 border-gray-200 text-gray-800 px-8 py-3 rounded-full font-bold hover:border-blue-600 hover:text-blue-600 transition shadow-sm flex items-center justify-center gap-2 text-lg">
            <Search size={22} /> Browse Items
          </Link>
        </div>
      </div>

      {/* How it works Section */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
          <div className="flex justify-center mb-4"><PlusCircle size={48} className="text-blue-500" /></div>
          <h3 className="text-xl font-bold mb-2 text-gray-800">1. Report</h3>
          <p className="text-gray-500">Quickly upload details and a photo of what you lost or found on campus.</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
          <div className="flex justify-center mb-4"><Search size={48} className="text-indigo-500" /></div>
          <h3 className="text-xl font-bold mb-2 text-gray-800">2. Match</h3>
          <p className="text-gray-500">Our system automatically suggests potential matches between lost and found items.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
          <div className="flex justify-center mb-4"><CheckCircle size={48} className="text-green-500" /></div>
          <h3 className="text-xl font-bold mb-2 text-gray-800">3. Claim</h3>
          <p className="text-gray-500">Verify your ownership with the admin desk and get your item safely returned.</p>
        </div>
      </div>
    </div>
  );
}