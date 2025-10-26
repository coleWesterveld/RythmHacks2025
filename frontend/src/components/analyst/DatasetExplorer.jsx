import { Database, Upload, ChevronDown, ChevronRight, Lock } from 'lucide-react';
import { useState } from 'react';

function DatasetExplorer({ datasets, selectedDataset, onSelectDataset, onUploadClick }) {
  const [expandedDatasets, setExpandedDatasets] = useState({});

  const toggleExpand = (datasetId) => {
    setExpandedDatasets(prev => ({
      ...prev,
      [datasetId]: !prev[datasetId]
    }));
  };

  const getBudgetColor = (remaining, total) => {
    const percentage = (remaining / total) * 100;
    if (percentage > 60) return 'text-green-600';
    if (percentage > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Your Datasets</h3>
          <button
            onClick={onUploadClick}
            className="p-1.5 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
            title="Upload new dataset"
          >
            <Upload className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500">Select a dataset to query</p>
      </div>

      {/* Dataset List */}
      <div className="flex-1 overflow-y-auto p-3">
        {datasets && datasets.length > 0 ? (
          <div className="space-y-2">
            {datasets.map((dataset) => (
              <div key={dataset.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Dataset Header */}
                <button
                  onClick={() => {
                    onSelectDataset(dataset);
                    toggleExpand(dataset.id);
                  }}
                  className={`w-full p-3 text-left hover:bg-gray-50 transition ${
                    selectedDataset?.id === dataset.id ? 'bg-blue-50 border-l-4 border-l-blue-700' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Database className="h-4 w-4 text-blue-700 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {dataset.name}
                        </span>
                      </div>
                      {dataset.description && (
                        <p className="text-xs text-gray-500 mb-2">{dataset.description}</p>
                      )}
                      
                      {/* Budget Info */}
                      <div className="flex items-center space-x-1 text-xs">
                        <Lock className={`h-3 w-3 ${getBudgetColor(dataset.epsilonRemaining, dataset.epsilonTotal)}`} />
                        <span className={getBudgetColor(dataset.epsilonRemaining, dataset.epsilonTotal)}>
                          {dataset.epsilonRemaining.toFixed(1)} / {dataset.epsilonTotal} ε
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div
                          className={`h-1 rounded-full ${
                            (dataset.epsilonRemaining / dataset.epsilonTotal) > 0.6
                              ? 'bg-green-500'
                              : (dataset.epsilonRemaining / dataset.epsilonTotal) > 0.3
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{
                            width: `${(dataset.epsilonRemaining / dataset.epsilonTotal) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                    {expandedDatasets[dataset.id] ? (
                      <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>

                {/* Schema Preview */}
                {expandedDatasets[dataset.id] && dataset.schema && (
                  <div className="px-3 pb-3 bg-gray-50 border-t border-gray-200">
                    <div className="text-xs font-semibold text-gray-700 mb-2 mt-2">Columns:</div>
                    <div className="space-y-1">
                      {dataset.schema.columns.slice(0, 5).map((col, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs">
                          <span>{col.icon || '📊'}</span>
                          <span className={col.queryable ? 'text-gray-700' : 'text-gray-400'}>
                            {col.name}
                          </span>
                          {col.queryable ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <Lock className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      ))}
                      {dataset.schema.columns.length > 5 && (
                        <div className="text-xs text-gray-500 mt-1">
                          +{dataset.schema.columns.length - 5} more columns
                        </div>
                      )}
                    </div>
                    
                    {dataset.recordCount && (
                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                        {dataset.recordCount.toLocaleString()} records
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Database className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-3">No datasets yet</p>
            <button
              onClick={onUploadClick}
              className="text-sm text-blue-700 hover:text-blue-800 font-medium"
            >
              Upload your first dataset
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          <div className="flex items-center space-x-1 mb-1">
            <Lock className="h-3 w-3" />
            <span>All data encrypted at rest</span>
          </div>
          <a href="#" className="text-blue-600 hover:text-blue-700">
            Learn about privacy guarantees →
          </a>
        </div>
      </div>
    </div>
  );
}

export default DatasetExplorer;

