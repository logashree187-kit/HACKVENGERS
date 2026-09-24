import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Report from './pages/Report';
import Details from './pages/Details';
import Admin from './pages/Admin';
import Claims from './pages/Claims';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="min-h-screen pt-16 container mx-auto px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/report" element={<Report />} />
          <Route path="/item/:id" element={<Details />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;