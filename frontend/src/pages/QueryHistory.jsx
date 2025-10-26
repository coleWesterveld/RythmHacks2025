import { useState } from 'react';
import { Clock, Filter, Search } from 'lucide-react';

function QueryHistory() {
  const [queries] = useState([]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Query History</h1>
        <p className="text-gray-600 mt-1">Review your privacy-preserving queries</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search queries..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50 transition">
            <Filter className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700">Filter</span>
          </button>
        </div>
      </div>

      {/* Query List */}
      <div className="space-y-4">
        {queries.map((query) => (
          <div key={query.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Query {query.queryId}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(query.executedAt)}</span>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-3">
                  <code className="text-sm text-gray-800 font-mono">{query.queryText}</code>
                </div>
                <div className="text-xs text-gray-600">
                  Dataset: {query.dataset}
                </div>
              </div>
              <div className="ml-6">
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  ε {query.epsilonSpent}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <div className="text-xs text-gray-500 mb-1">Private Result</div>
                <div className="text-lg font-semibold text-gray-900">{query.result}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Ground Truth</div>
                <div className="text-lg font-semibold text-green-700">{query.groundTruth}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Accuracy</div>
                <div className="text-lg font-semibold text-purple-700">{query.accuracy}</div>
              </div>
            </div>

            {/* No certificate/download actions */}
          </div>
        ))}
      </div>

      {/* Empty State - if no queries */}
      {queries.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Clock className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Queries Yet</h3>
          <p className="text-gray-600 mb-6">
            Start running privacy-preserving queries to see your history here
          </p>
          <a
            href="/workspace"
            className="inline-flex items-center space-x-2 bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition"
          >
            <span>Go to Query Workspace</span>
          </a>
        </div>
      )}
    </div>
  );
}

export default QueryHistory;

