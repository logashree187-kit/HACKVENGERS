import { Link } from "react-router-dom";
import { Search, PlusCircle, FileCheck2, ShieldCheck } from "lucide-react";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        <Link
          to="/"
          className="text-2xl font-bold text-green-700"
        >
          LostFound+
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-700 hover:text-green-700"
          >
            Home
          </Link>

          <Link
            to="/browse"
            className="flex items-center gap-2 text-gray-700 hover:text-green-700"
          >
            <Search size={18} />
            Browse
          </Link>

          <Link
            to="/report"
            className="flex items-center gap-2 text-gray-700 hover:text-green-700"
          >
            <PlusCircle size={18} />
            Report
          </Link>

          <Link
            to="/claims"
            className="flex items-center gap-2 text-gray-700 hover:text-green-700"
          >
            <FileCheck2 size={18} />
            My Claims
          </Link>

          <Link
            to="/admin"
            className="flex items-center gap-2 text-gray-700 hover:text-green-700"
          >
            <ShieldCheck size={18} />
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;