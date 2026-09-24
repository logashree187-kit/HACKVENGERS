import React, { useEffect, useState } from 'react';

// Fallback demo statistics if backend is offline on laptop
const DEMO_DASHBOARD = {
  totalItems: 48,
  lostItems: 28,
  foundItems: 20,
  pendingClaims: 5,
  returnedItems: 14,
  categoryStats: [
    { category: 'Electronics', count: 18, pct: 38 },
    { category: 'Bottles & Flasks', count: 12, pct: 25 },
    { category: 'ID Cards / Documents', count: 10, pct: 21 },
    { category: 'Accessories', count: 8, pct: 16 },
  ],
  hotspots: [
    { location: 'Canteen / Cafeteria', count: 15 },
    { location: 'Library / Study Hall', count: 11 },
    { location: 'Main Block', count: 9 },
  ]
};

const DEMO_ADMIN_CLAIMS = [
  {
    _id: 'clm_101',
    itemTitle: 'Fastrack Silver Dial Watch',
    claimerName: 'Alex Johnson',
    contact: 'alex.j@college.edu',
    proofDescription: 'Scratch on the rear cover plate near battery screw.',
    status: 'Pending',
    date: '2026-09-24'
  },
  {
    _id: 'clm_102',
    itemTitle: 'Dell 65W Type-C Laptop Charger',
    claimerName: 'Sneha Patel',
    contact: '9840123456',
    proofDescription: 'White tape wrapped around the joint near the connector head.',
    status: 'Pending',
    date: '2026-09-24'
  }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(DEMO_DASHBOARD);
  const [claims, setClaims] = useState(DEMO_ADMIN_CLAIMS);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [dashRes, claimsRes] = await Promise.all([
        fetch('http://localhost:5000/api/dashboard'),
        fetch('http://localhost:5000/api/claims')
      ]);

      if (dashRes.ok) {
        const dData = await dashRes.json();
        setStats(dData.data || dData);
      }
      if (claimsRes.ok) {
        const cData = await claimsRes.json();
        setClaims(cData.data || cData);
      }
    } catch (err) {
      console.warn('Backend offline, using demo dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClaimAction = async (claimId, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/claims/${claimId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      // Refresh
      loadData();
    } catch (err) {
      console.warn('Backend offline: updating state locally.');
      // Local optimistic update so UI is immediately interactive
      setClaims(claims.map((c) => (c._id === claimId ? { ...c, status: newStatus } : c)));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Campus Security & Admin Portal</h1>
        <p className="text-sm text-slate-500">Monitor lost and found reconciliation metrics and verify student claims.</p>
      </div>

      {/* Top 5 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {[
          { label: 'Total Tracked', val: stats.totalItems, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Lost Items', val: stats.lostItems, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Found Items', val: stats.foundItems, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Pending Claims', val: stats.pendingClaims, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Returned', val: stats.returnedItems, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">
              {kpi.label}
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl md:text-3xl font-black ${kpi.color}`}>{kpi.val}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Row: Category Distribution + Campus Hotspots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-800 text-sm">Top Misplaced Categories</h3>
          <div className="space-y-3 pt-1">
            {(stats.categoryStats || DEMO_DASHBOARD.categoryStats).map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                  <span>{cat.category}</span>
                  <span className="text-slate-500">{cat.count} items ({cat.pct || 25}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${cat.pct || 25}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Hotspots */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-800 text-sm">High-Frequency Campus Locations</h3>
          <div className="space-y-2.5 pt-1">
            {(stats.hotspots || DEMO_DASHBOARD.hotspots).map((spot, i) => (
              <div key={i} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl text-xs">
                <span className="font-semibold text-slate-700">📍 {spot.location}</span>
                <span className="font-bold text-slate-900 bg-white border px-2 py-0.5 rounded-md shadow-2xs">
                  {spot.count} reports
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Claims Verification Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Claim Verification Desk</h3>
            <p className="text-xs text-slate-400">Review student proof of possession and take action.</p>
          </div>
          <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 font-bold px-3 py-1 rounded-full">
            {claims.filter((c) => c.status === 'Pending').length} Pending Review
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b">
              <tr>
                <th className="px-6 py-3.5">Item</th>
                <th className="px-6 py-3.5">Claimant</th>
                <th className="px-6 py-3.5">Stated Proof</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {claims.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400 text-xs">
                    No active claims submitted yet.
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">{claim.itemTitle || claim.itemId}</td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-medium text-slate-800">{claim.claimerName}</div>
                      <div className="text-slate-400">{claim.contact}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-xs line-clamp-2">
                      "{claim.proofDescription}"
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          claim.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : claim.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {claim.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleClaimAction(claim._id, 'Approved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleClaimAction(claim._id, 'Rejected')}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                      >
                        ✕ Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}