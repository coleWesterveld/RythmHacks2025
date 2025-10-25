import { useState } from 'react';
import { useParams } from 'react-router-dom';
import SchemaExplorer from '../components/analyst/SchemaExplorer';
import QueryComposer from '../components/analyst/QueryComposer';
import ResultsPanel from '../components/analyst/ResultsPanel';
import PrivacyBudgetIndicator from '../components/shared/PrivacyBudgetIndicator';
import { mockSchema } from '../data/mockData';

function AnalystWorkspace() {
  const { projectId } = useParams();
  const [budget] = useState({ spent: 1.2, total: 3.0 });
  const [result, setResult] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);

  const handleExecuteQuery = (query) => {
    // Simulate query execution
    const mockResult = {
      label: query.type === 'average' ? 'Average Age' : 
             query.type === 'sum' ? 'Total Sum' : 
             query.type === 'count' ? 'Count' : 'Result',
      value: query.type === 'average' ? '48.3' : 
             query.type === 'sum' ? '1,247' : 
             query.type === 'count' ? '342' : '---',
      unit: query.type === 'average' ? 'years' : 
            query.type === 'count' ? 'records' : '',
      epsilonSpent: query.epsilon,
      accuracy: query.type === 'average' ? '2.1 years' : 
                query.type === 'sum' ? '45 units' : 
                query.type === 'count' ? '8 records' : '---',
      queryId: 'QRY-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      timestamp: new Date().toISOString(),
      queryText: `${query.type.toUpperCase()}(${query.column})${query.filters.length > 0 ? ' WHERE ...' : ''}`,
      executionTime: '0.3s',
      rowsAnalyzed: '1,240',
      remainingBudget: (budget.total - budget.spent - query.epsilon).toFixed(1)
    };

    setResult(mockResult);
    setQueryHistory([
      ...queryHistory,
      {
        label: mockResult.label,
        epsilon: query.epsilon,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <div>
      {/* Role Indicator Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white px-6 py-3 rounded-lg mb-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Activity className="h-5 w-5" />
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

      {/* Header with Privacy Budget */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analyst Workspace</h1>
          <p className="text-gray-600 mt-1">Query datasets with differential privacy</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div>
                <div className="text-xs text-gray-600 mb-1">Your Privacy Budget</div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {(budget.total - budget.spent).toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">/ {budget.total} ε</span>
                </div>
                <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${
                      (budget.total - budget.spent) / budget.total > 0.6
                        ? 'bg-green-500'
                        : (budget.total - budget.spent) / budget.total > 0.3
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{
                      width: `${((budget.total - budget.spent) / budget.total) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Three Panel Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Schema Explorer */}
        <div className="col-span-2">
          <SchemaExplorer schema={mockSchema} />
        </div>

        {/* Center Panel - Query Composer */}
        <div className="col-span-6">
          <QueryComposer
            schema={mockSchema}
            remainingBudget={budget.total - budget.spent}
            onExecuteQuery={handleExecuteQuery}
          />
        </div>

        {/* Right Panel - Results */}
        <div className="col-span-4">
          <ResultsPanel result={result} queryHistory={queryHistory} />
        </div>
      </div>
    </div>
  );
}

export default AnalystWorkspace;
