import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Database, Clock, AlertCircle } from 'lucide-react';
import PrivacyBudgetIndicator from '../components/shared/PrivacyBudgetIndicator';

function ProjectDashboard() {
  const navigate = useNavigate();
  const [projects] = useState([
    {
      id: 1,
      name: 'Diabetes Treatment Efficacy Study',
      datasets: ['Patient Demographics Q3 2024', 'Treatment Outcomes'],
      epsilonSpent: 1.2,
      epsilonTotal: 4.0,
      status: 'Active',
      queriesRun: 8,
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      name: 'Salary Equity Analysis',
      datasets: ['Employee Salary Data 2024'],
      epsilonSpent: 2.8,
      epsilonTotal: 3.0,
      status: 'Active',
      queriesRun: 15,
      lastActivity: '5 hours ago'
    },
    {
      id: 3,
      name: 'Student Performance Metrics',
      datasets: ['Student Academic Records'],
      epsilonSpent: 0.5,
      epsilonTotal: 5.0,
      status: 'Active',
      queriesRun: 3,
      lastActivity: '1 day ago'
    }
  ]);

  const [pendingRequests] = useState([
    {
      id: 1,
      projectName: 'Healthcare Cost Analysis',
      requestedDatasets: ['Patient Demographics Q3 2024', 'Billing Records'],
      requestDate: '2024-10-20',
      status: 'Pending'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Budget Exhausted':
        return 'bg-red-100 text-red-700';
      case 'Awaiting Approval':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      {/* Role Indicator Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white px-6 py-3 rounded-lg mb-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium opacity-90">Current View</div>
            <div className="text-lg font-bold">Researcher Workspace</div>
          </div>
        </div>
        <div className="text-sm opacity-90">
          Query datasets with differential privacy guarantees
        </div>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-1">Access your authorized research projects</p>
        </div>
        <button className="bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition shadow-md">
          <Plus className="h-5 w-5" />
          <span>New Project Request</span>
        </button>
      </div>

      {/* Active Projects Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/workspace/${project.id}`)}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 pr-2">{project.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>

              {/* Datasets */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                  <Database className="h-3 w-3" />
                  <span>Authorized Datasets</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {project.datasets.map((dataset, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                    >
                      {dataset.length > 25 ? dataset.substring(0, 25) + '...' : dataset}
                    </span>
                  ))}
                </div>
              </div>

              {/* Privacy Budget */}
              <div className="flex justify-center my-6">
                <PrivacyBudgetIndicator
                  spent={project.epsilonSpent}
                  total={project.epsilonTotal}
                  size="sm"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500">Queries Run</div>
                  <div className="text-lg font-semibold text-gray-900">{project.queriesRun}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Last Activity</div>
                  <div className="text-sm font-medium text-gray-700">{project.lastActivity}</div>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition shadow-sm flex items-center justify-center space-x-2">
                <span>Open Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Content in a Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Pending Access Requests</h3>
          </div>
          {pendingRequests.length > 0 ? (
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="font-medium text-gray-900 mb-2">{request.projectName}</div>
                  <div className="text-xs text-gray-600 mb-2">
                    Requested: {new Date(request.requestDate).toLocaleDateString()}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {request.requestedDatasets.map((dataset, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {dataset}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No pending requests</p>
          )}
        </div>

        {/* Resources & Help */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Getting Started</h3>
          </div>
          <div className="space-y-3">
            <a href="#" className="block p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition">
              <div className="font-medium text-blue-900 text-sm mb-1">
                📘 Understanding Privacy Budgets
              </div>
              <div className="text-xs text-blue-700">
                Learn how epsilon budgets protect privacy
              </div>
            </a>
            <a href="#" className="block p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition">
              <div className="font-medium text-green-900 text-sm mb-1">
                🎓 Query Building Guide
              </div>
              <div className="text-xs text-green-700">
                Step-by-step tutorial for creating queries
              </div>
            </a>
            <a href="#" className="block p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition">
              <div className="font-medium text-purple-900 text-sm mb-1">
                🔐 Best Practices for Privacy
              </div>
              <div className="text-xs text-purple-700">
                Tips for maximizing data utility
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDashboard;
