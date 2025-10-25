import { useState } from 'react';
import { Download, Calendar, Filter } from 'lucide-react';
import ActivityLogComponent from '../components/admin/ActivityLog';

function ActivityLogPage() {
  const [activities] = useState([
    {
      id: 1,
      type: 'query',
      researcher: 'Dr. Sarah Chen',
      timestamp: new Date().toISOString(),
      description: 'Executed private query on patient demographics',
      query: 'SELECT AVG(age) FROM patient_records WHERE condition = \'Diabetes\'',
      dataset: 'Patient Demographics Q3 2024',
      epsilon: '0.5',
      accuracy: '±2.1 years'
    },
    {
      id: 2,
      type: 'access_granted',
      researcher: 'Prof. Michael Rodriguez',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      description: 'Access granted to new dataset',
      dataset: 'Employee Salary Data 2024',
      epsilon: null
    },
    {
      id: 3,
      type: 'query',
      researcher: 'Dr. Sarah Chen',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      description: 'Computed sum of hospital days',
      query: 'SELECT SUM(days_in_hospital) FROM patient_records WHERE city = \'Toronto\'',
      dataset: 'Patient Demographics Q3 2024',
      epsilon: '0.8',
      accuracy: '±45 days'
    },
    {
      id: 4,
      type: 'warning',
      researcher: 'Prof. Michael Rodriguez',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      description: 'Privacy budget running low (20% remaining)',
      dataset: 'Employee Salary Data 2024',
      epsilon: null
    },
    {
      id: 5,
      type: 'query',
      researcher: 'Prof. Michael Rodriguez',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      description: 'Counted records by category',
      query: 'SELECT COUNT(*) FROM student_records WHERE grade_level = \'Senior\'',
      dataset: 'Student Academic Records',
      epsilon: '0.3',
      accuracy: '±8 records'
    },
    {
      id: 6,
      type: 'budget_exceeded',
      researcher: 'Dr. Emma Wilson',
      timestamp: new Date(Date.now() - 18000000).toISOString(),
      description: 'Query rejected - insufficient privacy budget',
      dataset: 'Patient Demographics Q3 2024',
      epsilon: null
    }
  ]);

  const [dateRange, setDateRange] = useState('7days');

  return (
    <div>
      {/* Role Indicator Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-3 rounded-lg mb-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Activity className="h-5 w-5" />
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
          <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-600 mt-1">Monitor all queries and access changes for compliance</p>
        </div>
        <button className="bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition shadow-md">
          <Download className="h-5 w-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-1">Total Queries Today</div>
          <div className="text-3xl font-bold text-gray-900">24</div>
          <div className="text-xs text-green-600 mt-1">↑ 12% from yesterday</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-1">Active Researchers</div>
          <div className="text-3xl font-bold text-gray-900">8</div>
          <div className="text-xs text-gray-500 mt-1">Currently querying</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-1">Avg. Epsilon per Query</div>
          <div className="text-3xl font-bold text-gray-900">0.4</div>
          <div className="text-xs text-gray-500 mt-1">Last 24 hours</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-1">Budget Warnings</div>
          <div className="text-3xl font-bold text-yellow-600">3</div>
          <div className="text-xs text-gray-500 mt-1">Researchers below 30%</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="custom">Custom range</option>
            </select>
          </div>
          
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
            <option value="">All Researchers</option>
            <option value="sarah">Dr. Sarah Chen</option>
            <option value="michael">Prof. Michael Rodriguez</option>
          </select>

          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
            <option value="">All Datasets</option>
            <option value="patient">Patient Demographics</option>
            <option value="employee">Employee Salary</option>
            <option value="student">Student Records</option>
          </select>

          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
            <option value="">All Activity Types</option>
            <option value="query">Queries</option>
            <option value="access">Access Changes</option>
            <option value="warning">Warnings</option>
          </select>

          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition ml-auto">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700">More Filters</span>
          </button>
        </div>
      </div>

      {/* Activity Log */}
      <ActivityLogComponent activities={activities} />
    </div>
  );
}

export default ActivityLogPage;
