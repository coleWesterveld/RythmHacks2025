import { CheckCircle, Clock, Database, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useState } from 'react';

function ResultsDisplay({ result, queryHistory }) {
  const [showGroundTruth, setShowGroundTruth] = useState(true);

  if (!result) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <Database className="h-16 w-16 text-gray-300 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Yet</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Build a query and click "Run Private Query" to see your results here
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <div className="text-sm font-medium text-blue-900 mb-2">What you'll see:</div>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Privacy-preserving result value</li>
              <li>• Ground truth comparison (demo)</li>
              <li>• Accuracy estimate</li>
              <li>• Privacy certificate</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900">Query Results</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Success Message */}
        <div className="flex items-center space-x-2 text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">Query executed with privacy guarantee</span>
        </div>

        {/* Result Display */}
        <div className="text-center py-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="text-xs text-blue-700 font-semibold uppercase tracking-wide mb-2">
            {result.label}
          </div>
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {result.value}
          </div>
          {result.unit && (
            <div className="text-sm text-gray-600">{result.unit}</div>
          )}
          
          <div className="mt-4 inline-block px-4 py-2 bg-blue-700 text-white rounded-full text-sm font-medium">
            ε {result.epsilonSpent} spent
          </div>
          
          <div className="mt-2 text-sm text-blue-700">
            Accuracy: ±{result.accuracy}
          </div>
        </div>

        {/* Ground Truth Comparison (Demo Mode) */}
        {result.showGroundTruth && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowGroundTruth(!showGroundTruth)}
              className="w-full p-3 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between"
            >
              <span className="text-sm font-medium text-gray-900">Ground Truth Comparison</span>
              {showGroundTruth ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
            
            {showGroundTruth && (
              <div className="p-4 bg-yellow-50 border-t border-yellow-200">
                <div className="text-xs text-yellow-800 font-medium mb-3 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>Demo Mode Only - Never shown in production</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Private Result</div>
                    <div className="text-2xl font-bold text-blue-700">{result.value}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Ground Truth</div>
                    <div className="text-2xl font-bold text-green-700">{result.groundTruth}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-3">
                  Difference: {Math.abs(parseFloat(result.value) - parseFloat(result.groundTruth)).toFixed(2)} 
                  ({((Math.abs(parseFloat(result.value) - parseFloat(result.groundTruth)) / parseFloat(result.groundTruth)) * 100).toFixed(1)}%)
                </div>
              </div>
            )}
          </div>
        )}

        {/* Query Details */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Query Details</h4>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <code className="text-xs text-gray-800">{result.queryText}</code>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                <Clock className="h-3 w-3" />
                <span className="text-xs">Execution Time</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">{result.executionTime}</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                <Database className="h-3 w-3" />
                <span className="text-xs">Rows Analyzed</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">~{result.rowsAnalyzed.toLocaleString()}</div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-3 bg-purple-50 border-purple-200">
            <div className="text-xs font-semibold text-purple-900 mb-2">Budget Impact</div>
            <div className="flex justify-between text-xs">
              <span className="text-purple-700">Remaining budget:</span>
              <span className="font-medium text-purple-900">{result.remainingBudget} ε</span>
            </div>
          </div>
        </div>

        {/* No certificate/download actions per requirements */}
      </div>

      {/* Query History Footer */}
      {queryHistory && queryHistory.length > 0 && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <details className="group">
            <summary className="cursor-pointer text-xs font-semibold text-gray-900 mb-2 flex items-center justify-between">
              <span>Recent Queries ({queryHistory.length})</span>
              <ChevronDown className="h-3 w-3 group-open:rotate-180 transition" />
            </summary>
            <div className="space-y-1 mt-2">
              {queryHistory.slice(-5).reverse().map((query, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 bg-white rounded border border-gray-200">
                  <span className="text-gray-700 truncate flex-1">{query.label}</span>
                  <span className="text-gray-500 ml-2">ε {query.epsilon}</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

export default ResultsDisplay;

