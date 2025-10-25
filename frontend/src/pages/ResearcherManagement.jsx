import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import ResearcherTable from '../components/admin/ResearcherTable';
import { mockResearchers } from '../data/mockData';

function ResearcherManagement() {
  const [researchers] = useState(mockResearchers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <div>
      {/* Role Indicator Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-3 rounded-lg mb-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium opacity-90">Current View</div>
            <div className="text-lg font-bold">Admin Dashboard</div>
          </div>
        </div>
        <div className="text-sm opacity-90">
          Manage datasets, researchers, and privacy budgets
        </div>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Researcher Management</h1>
          <p className="text-gray-600 mt-1">Manage researcher access and privacy budgets</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition shadow-md"
        >
          <Plus className="h-5 w-5" />
          <span>Invite Researcher</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or institution..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition">
            <Filter className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700">Filter</span>
          </button>
        </div>
      </div>

      {/* Researcher Table */}
      <ResearcherTable researchers={researchers} />

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Invite Researcher</h2>
              <p className="text-gray-600 mt-1">Grant access to datasets with privacy budget allocation</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="researcher@university.edu"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Institution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution
                </label>
                <input
                  type="text"
                  placeholder="University or Organization"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Dataset Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grant Access to Datasets *
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-primary" />
                    <span className="text-sm text-gray-700">Patient Demographics Q3 2024</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-primary" />
                    <span className="text-sm text-gray-700">Employee Salary Data 2024</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded text-primary" />
                    <span className="text-sm text-gray-700">Student Academic Records</span>
                  </label>
                </div>
              </div>

              {/* Access Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Level *
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option>Viewer</option>
                  <option>Analyst</option>
                  <option>Full Access</option>
                </select>
              </div>

              {/* Epsilon Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Epsilon Budget Allocation
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  defaultValue="3.0"
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>0.5 ε</span>
                  <span className="font-medium text-gray-900">3.0 ε</span>
                  <span>10.0 ε</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This is the total privacy budget the researcher can spend on queries
                </p>
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Expiration (Optional)
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition shadow-sm">
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResearcherManagement;
