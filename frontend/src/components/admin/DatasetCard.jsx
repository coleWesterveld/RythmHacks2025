import PrivacyBudgetIndicator from '../shared/PrivacyBudgetIndicator';
import { FileText, Users, Activity } from 'lucide-react';

function DatasetCard({ dataset }) {
  const { name, source, epsilonSpent, epsilonTotal, researchers, queries, status } = dataset;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
            <FileText className="h-4 w-4" />
            <span>{source}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {status}
        </span>
      </div>

      {/* Privacy Budget */}
      <div className="flex justify-center my-6">
        <PrivacyBudgetIndicator spent={epsilonSpent} total={epsilonTotal} size="md" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">{researchers} researchers</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Activity className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">{queries} queries</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition shadow-sm">
          Manage Access
        </button>
        <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
          View Queries
        </button>
      </div>
    </div>
  );
}

export default DatasetCard;