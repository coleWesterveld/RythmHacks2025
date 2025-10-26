import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, Database, History, Upload } from 'lucide-react';

function MainLayout({ children }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavLink = ({ to, icon: Icon, label }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all ${
          active
            ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
            : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
        }`}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
              <Shield className="h-8 w-8 text-blue-700" />
              <div>
                <div className="text-xl font-bold text-gray-900">Guardian Analytics</div>
                <div className="text-xs text-gray-500">Privacy-Preserving Data Analysis</div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex space-x-2">
              <NavLink to="/" icon={Home} label="Home" />
              <NavLink to="/workspace" icon={Database} label="Query Workspace" />
              <NavLink to="/history" icon={History} label="History" />
            </nav>

            {/* CTA */}
            <Link
              to="/workspace"
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition shadow-sm flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Data</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;