import { useState } from 'react';
import { Download, Plus, CheckCircle, Lock, Clock, Database } from 'lucide-react';

function ResultsPanel({ result, queryHistory }) {
  const [activeTab, setActiveTab] = useState('result'); // 'result' or 'details'

  if (!result) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <Database className="h-16 w-16 text-gray-300 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Yet</h3>
          <p className="text-gray-600 mb-4">
            Run your first private query to see results here
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <div className="text-sm font-medium text-blue-900 mb-2">Quick Start Tips:</div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Select columns from the schema explorer</li>
              <li>• Choose your query type and column</li>
              <li>• Adjust privacy/accuracy trade-off</li>
              <li>• Click "Run Private Query"</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full flex flex-col">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-4 px-6 pt-4">
          <button
            onClick={() => setActiveTab('result')}
            className={`pb-3 px-2 font-medium text-sm border-b-2 transition ${
              activeTab === 'result'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🔒 Private Result
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-2 font-medium text-sm border-b-2 transition ${
              activeTab === 'details'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📊 Query Details
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'result' ? (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 border border-green-200 rounded-lg p-4">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Query executed with privacy guarantee</span>
            </div>

            {/* Result Display */}
            <div className="text-center py-8">
              <div className="text-sm text-gray-500 mb-2">{result.label}</div>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {result.value}
              </div>
              <div className="text-sm text-gray-500">{result.unit}</div>
              
              <div className="mt-6 inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
                ε spent: {result.epsilonSpent}
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                Accuracy estimate: ±{result.accuracy}
              </div>
            </div>

            {/* Privacy Certificate */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start space-x-3">
                <Lock className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Privacy Certificate</div>
                  <div className="text-xs text-gray-700 space-y-1">
                    <p>✓ This result satisfies {result.epsilonSpent}-differential privacy</p>
                    <p>✓ Mathematical guarantee: No individual can be identified from this result</p>
                    <p className="text-gray-500 mt-2">
                      Query ID: {result.queryId} | {new Date(result.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Plus className="h-4 w-4" />
                <span className="text-sm">Add to Report</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition shadow-sm">
                <Download className="h-4 w-4" />
                <span className="text-sm">Download Result</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Query Summary */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Query Summary</h4>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <code className="text-sm text-gray-800">{result.queryText}</code>
              </div>
            </div>

            {/* Execution Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-gray-500 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Execution Time</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">{result.executionTime}</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-gray-500 mb-1">
                  <Database className="h-4 w-4" />
                  <span className="text-xs">Rows Analyzed</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">~{result.rowsAnalyzed}</div>
              </div>
            </div>

            {/* Budget Impact */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-900 mb-2">Privacy Budget Impact</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Epsilon spent on this query:</span>
                  <span className="font-medium text-gray-900">{result.epsilonSpent}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining budget:</span>
                  <span className="font-medium text-gray-900">{result.remainingBudget} ε</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Query History */}
      {queryHistory && queryHistory.length > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <details className="group">
            <summary className="cursor-pointer text-sm font-semibold text-gray-900 mb-2">
              Query History ({queryHistory.length})
            </summary>
            <div className="space-y-2 mt-2">
              {queryHistory.slice(0, 5).map((query, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 bg-white rounded border border-gray-200">
                  <span className="text-gray-700">{query.label}</span>
                  <span className="text-gray-500">ε {query.epsilon}</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

export default ResultsPanel;
