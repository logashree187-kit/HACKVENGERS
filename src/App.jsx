import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Details from './pages/Details';
import Report from './pages/Report';
import Claims from './pages/Claims';
import Admin from './pages/Admin';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/items/:id" element={<Details />} />
          <Route path="/report" element={<Report />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}