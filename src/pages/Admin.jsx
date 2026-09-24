import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Layers, 
  CheckCircle, 
  HelpCircle, 
  PackageOpen, 
  RefreshCw, 
  Tag, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';
import { getDashboardStats } from '../api';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';

const PIE_COLORS = ['#38BDF8', '#818CF8', '#34D399', '#F87171'];

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Failed to fetch dashboard aggregation stats from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) return <Loading count={4} label="Calculating dashboard aggregations..." />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-sm text-slate-600 mb-4">{error}</p>
        <button
          onClick={loadStats}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  // Formatting Native Mongo Aggregations
  const categoryData = (stats?.byCategory || []).map((item) => ({
    name: item._id || 'Other',
    count: item.count || 0,
  }));

  const locationData = (stats?.byLocation || []).map((item) => ({
    name: item._id || 'Campus Area',
    count: item.count || 0,
  }));

  const statusPieData = (stats?.byStatus || []).map((st) => ({
    name: st._id || 'Status',
    value: st.count || 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Campus Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time loss reports, found inventories, recovery rate, and hotspot alerts.
          </p>
        </div>
        <button
          onClick={loadStats}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Pipeline
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Items"
          value={stats?.totalItems}
          icon={Layers}
          color="indigo"
          subtitle="All recorded reports"
        />
        <StatCard
          title="Lost Items"
          value={stats?.lostItems}
          icon={HelpCircle}
          color="rose"
          subtitle="Missing belongings"
        />
        <StatCard
          title="Found Items"
          value={stats?.foundItems}
          icon={PackageOpen}
          color="emerald"
          subtitle="Awaiting claimant"
        />
        <StatCard
          title="Pending Claims"
          value={stats?.pendingClaims}
          icon={ShieldCheck}
          color="amber"
          subtitle="Awaiting verification"
        />
        <div className="col-span-2 md:col-span-1">
          <StatCard
            title="Returned"
            value={stats?.returnedItems}
            icon={CheckCircle}
            color="purple"
            subtitle="Successfully closed"
          />
        </div>
      </div>

      {/* Recharts Bento Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-indigo-600" />
              Incidence by Category
            </h3>
            <span className="text-[11px] text-slate-400">Total volume</span>
          </div>

          <div className="h-64 w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No categorical aggregations recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Status Proportions Donut Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Status Distribution
          </h3>

          <div className="h-52 w-full flex items-center justify-center">
            {statusPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">No status distributions available.</div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 text-center">
            Proportion of active records across lifecycle states
          </div>
        </div>
      </div>

      {/* Campus Location Hotspots Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-4">
          <MapPin className="w-4 h-4 text-rose-500" />
          Campus Incident Hotspots
        </h3>

        {locationData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {locationData.map((loc, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between"
              >
                <span className="text-xs font-semibold text-slate-700 truncate pr-2">{loc.name}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-indigo-600">
                  {loc.count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No location hot-zones identified yet.</p>
        )}
      </div>
    </div>
  );
}