import { Activity, Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

function ActivityLogComponent({ activities }) {
  const getActionIcon = (type) => {
    switch (type) {
      case 'query':
        return <Activity className="h-5 w-5 text-blue-600" />;
      case 'access_granted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'budget_exceeded':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Filter
            </button>
            <button className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-blue-700 transition">
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <div key={activity.id} className="p-6 hover:bg-gray-50 transition">
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                {getActionIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{activity.researcher}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{formatTime(activity.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{activity.description}</p>
                    
                    {/* Query Details */}
                    {activity.query && (
                      <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                        <code className="text-xs text-gray-800">{activity.query}</code>
                      </div>
                    )}

                    {/* Dataset and Accuracy */}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      {activity.dataset && (
                        <span className="flex items-center space-x-1">
                          <span className="font-medium">Dataset:</span>
                          <span>{activity.dataset}</span>
                        </span>
                      )}
                      {activity.accuracy && (
                        <span className="flex items-center space-x-1">
                          <span className="font-medium">Accuracy:</span>
                          <span>{activity.accuracy}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Epsilon Badge */}
                  {activity.epsilon && (
                    <div className="flex-shrink-0 ml-4">
                      <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        ε {activity.epsilon}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityLogComponent;
