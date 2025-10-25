import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, User, Database, Activity, Users, ChevronDown, RefreshCw } from 'lucide-react';
import useStore from '../../store/useStore';

function MainLayout({ children }) {
  const location = useLocation();
  const { userRole, setUserRole } = useStore();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowRoleMenu(false);
      }
    };

    if (showRoleMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showRoleMenu]);

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

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    setShowRoleMenu(false);
    // Reload to reset state
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-700" />
              <span className="text-xl font-bold text-gray-900">Guardian Analytics</span>
            </div>

            {/* Navigation */}
            <nav className="flex space-x-2">
              {userRole === 'admin' ? (
                <>
                  <NavLink to="/" icon={Database} label="Datasets" />
                  <NavLink to="/researchers" icon={Users} label="Researchers" />
                  <NavLink to="/activity" icon={Activity} label="Activity Log" />
                </>
              ) : (
                <>
                  <NavLink to="/" icon={Database} label="My Projects" />
                </>
              )}
            </nav>

            {/* User Menu with Role Switcher */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="h-8 w-8 bg-blue-700 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {userRole === 'admin' ? 'Admin User' : 'Researcher'}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <div className="text-xs font-semibold text-gray-500 uppercase">Switch View</div>
                  </div>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 transition ${
                      userRole === 'admin' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin View</span>
                    {userRole === 'admin' && <span className="ml-auto text-blue-700">✓</span>}
                  </button>
                  <button
                    onClick={() => handleRoleChange('analyst')}
                    className={`w-full flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 transition ${
                      userRole === 'analyst' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>Analyst View</span>
                    {userRole === 'analyst' && <span className="ml-auto text-blue-700">✓</span>}
                  </button>
                  <div className="border-t border-gray-200 mt-2 pt-2 px-4">
                    <div className="text-xs text-gray-500 flex items-center space-x-1">
                      <RefreshCw className="h-3 w-3" />
                      <span>Switch views to test different roles</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
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