import React, { useEffect, useState } from 'react';

// Fallback demo data if backend is offline on laptop
const DEMO_CLAIMS = [
  {
    _id: 'clm_101',
    itemTitle: 'Titan Fastrack Watch',
    category: 'Accessories',
    claimerName: 'Alex Johnson',
    contact: 'alex.j@college.edu',
    proofDescription: 'Has a small scratch on the buckle back and set to 24-hr format.',
    status: 'Approved',
    date: '2026-09-23',
    pickupLocation: 'Campus Security Office (Main Block, Rm 102)'
  },
  {
    _id: 'clm_102',
    itemTitle: 'Blue Hydro Flask 32oz',
    category: 'Bottles & Flasks',
    claimerName: 'Alex Johnson',
    contact: 'alex.j@college.edu',
    proofDescription: 'Covered with GitHub and React stickers on the base.',
    status: 'Pending',
    date: '2026-09-24',
  },
  {
    _id: 'clm_103',
    itemTitle: 'Scientific Calculator fx-991EX',
    category: 'Electronics',
    claimerName: 'Alex Johnson',
    contact: 'alex.j@college.edu',
    proofDescription: 'My name is written in black permanent marker inside the sliding lid.',
    status: 'Rejected',
    date: '2026-09-21',
  }
];

export default function MyClaims() {
  const [claims, setClaims] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClaims() {
      try {
        const response = await fetch('http://localhost:5000/api/claims');
        if (!response.ok) throw new Error('Backend offline');
        const data = await response.json();
        setClaims(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.warn('Backend offline, displaying demo claims preview.');
        setClaims(DEMO_CLAIMS);
      } finally {
        setLoading(false);
      }
    }
    fetchClaims();
  }, []);

  const filteredClaims = claims.filter((c) => {
    if (filter === 'All') return true;
    return c.status?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Claim Requests</h1>
          <p className="text-sm text-slate-500">Track and manage items you have claimed on campus.</p>
        </div>
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Claims List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading your claims...</div>
      ) : filteredClaims.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
          No {filter !== 'All' ? filter.toLowerCase() : ''} claims found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClaims.map((claim) => (
            <div
              key={claim._id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-900 text-base">
                    {claim.itemTitle || `Claim #${claim._id.slice(-5)}`}
                  </h3>
                  {claim.category && (
                    <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-md font-medium">
                      {claim.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {claim.date ? new Date(claim.date).toLocaleDateString() : 'Recent'}
                  </span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                      claim.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : claim.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {claim.status || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Proof description box */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3 text-xs text-slate-600">
                <span className="font-semibold text-slate-800 block mb-0.5">Submitted Ownership Proof:</span>
                "{claim.proofDescription}"
              </div>

              {/* Dynamic Action Instructions */}
              {claim.status === 'Approved' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-800">
                  <span className="text-base leading-none">🎉</span>
                  <div>
                    <span className="font-bold">Claim Approved! </span>
                    Please visit the <b>Main Block Security Desk (Rm 102)</b> with your College Student ID card to collect your item.
                  </div>
                </div>
              )}

              {claim.status === 'Pending' && (
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  Under verification by the Lost & Found management team.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}