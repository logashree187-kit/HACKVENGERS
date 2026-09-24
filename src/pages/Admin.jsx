import { useEffect, useState } from 'react';
import { getDashboardStats } from '../api';

export default function Admin() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total" value={stats.total} />
        <StatCard title="Lost" value={stats.lost} />
        <StatCard title="Found" value={stats.found} />
        <StatCard title="Pending Claims" value={stats.pending} />
        <StatCard title="Returned" value={stats.returned} />
      </div>
      <div className="bg-white p-6 shadow rounded">
        <p className="text-gray-500 text-center">Dashboard Management Controls (Table of Items / Approve Claims will go here)</p>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow border border-gray-100 text-center">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
    </div>
  );
}