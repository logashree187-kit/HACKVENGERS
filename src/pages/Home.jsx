import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';
import { getItems, getDashboardStats } from '../api';
import ItemCard from '../components/ItemCard';
import Loading from '../components/Loading';

export default function Home() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLandingData() {
      try {
        const [itemsRes, statsRes] = await Promise.allSettled([
          getItems(),
          getDashboardStats(),
        ]);

        if (itemsRes.status === 'fulfilled') {
          setItems((itemsRes.value || []).slice(0, 3));
        }
        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLandingData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200 bg-linear-to-b from-indigo-50/60 via-white to-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Deterministic AI-Assisted Recovery for Campuses
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Lost something on campus? <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-indigo-500">
              Recover it with LostFound+
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A real-time matching network connecting students, security, and administrative desks. 
            Automating ownership verification with deterministic 100-point signal scoring.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/report"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition text-xs sm:text-sm"
            >
              Report Lost Item
            </Link>
            <Link
              to="/report"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-200 transition text-xs sm:text-sm"
            >
              Report Found Item
            </Link>
            <Link
              to="/browse"
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-300 shadow-xs transition text-xs sm:text-sm flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-slate-400" />
              Browse Feed
            </Link>
          </div>

          {/* Real Backend Statistics Bar */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Tracked</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalItems ?? '--'}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Lost Reports</span>
              <p className="text-2xl font-black text-rose-600 mt-1">{stats?.lostItems ?? '--'}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Found Items</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{stats?.foundItems ?? '--'}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Returned Safely</span>
              <p className="text-2xl font-black text-indigo-600 mt-1">{stats?.returnedItems ?? '--'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How It Works</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            The closed-loop pipeline transforming missing property into verified returns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Report</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Submit a detailed log with category, location, date, color, and distinguishing identifiers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Match</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Our 100-point algorithm scores opposite records on category, venue, keywords, and dates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Claim</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Legitimate owners submit unique proof-of-possession, automatically locking the item.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center mb-4">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Return</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Admins approve verification, permanently marking items as safely returned to owner.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Items Live Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Recent Campus Reports</h2>
            <p className="text-xs text-slate-500 mt-0.5">Live records streaming from database</p>
          </div>
          <Link
            to="/browse"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
          >
            View All Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Loading count={3} label="Streaming live reports..." />
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
            No items in database yet. Be the first to report!
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white pt-10 pb-8 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800 text-sm">LostFound+</span>
            <span className="text-slate-400">| Intelligent Campus Recovery System</span>
          </div>
          <div>Powered by MongoDB Atlas & Deterministic Match Engine</div>
        </div>
      </footer>
    </div>
  );
}