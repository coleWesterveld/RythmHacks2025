import { useState } from 'react';
import { Upload } from 'lucide-react';
import DatasetExplorer from '../components/analyst/DatasetExplorer';
import QueryBuilder from '../components/analyst/QueryBuilder';
import ResultsDisplay from '../components/analyst/ResultsDisplay';
import { mockSchema } from '../data/mockData';

function QueryWorkspace() {
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [result, setResult] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [datasets] = useState([
    {
      id: 1,
      name: 'Patient Demographics Q3 2024',
      description: 'Hospital patient records',
      schema: mockSchema,
      epsilonRemaining: 4.5,
      epsilonTotal: 5.0,
      recordCount: 10000
    }
  ]);

  const handleExecuteQuery = (query) => {
    // Simulate query execution with DP
    const groundTruth = query.type === 'average' ? 47.9 : 
                       query.type === 'sum' ? 51234 : 
                       query.type === 'count' ? 3421 : 100;
    
    // Add Laplace noise
    const noise = (Math.random() - 0.5) * (2 / query.epsilon);
    const privateResult = groundTruth + noise;

    const mockResult = {
      label: query.type === 'average' ? `Average ${query.column}` : 
             query.type === 'sum' ? `Sum of ${query.column}` : 
             query.type === 'count' ? `Count` : 'Result',
      value: privateResult.toFixed(1),
      groundTruth: groundTruth.toFixed(1),
      unit: query.type === 'average' ? 'years' : query.type === 'count' ? 'records' : '',
      epsilonSpent: query.epsilon,
      accuracy: (2 / query.epsilon).toFixed(1),
      queryId: 'QRY-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      timestamp: new Date().toISOString(),
      queryText: `${query.type.toUpperCase()}(${query.column})${query.filters.length > 0 ? ' WHERE ...' : ''}`,
      executionTime: '0.4s',
      rowsAnalyzed: datasets[0]?.recordCount || 0,
      remainingBudget: (datasets[0]?.epsilonRemaining - query.epsilon).toFixed(1),
      showGroundTruth: true // Demo mode
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
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Query Workspace</h1>
        <p className="text-gray-600 mt-1">Build and execute privacy-preserving queries on your sensitive data</p>
      </div>

      {/* Three Panel Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Dataset Explorer */}
        <div className="col-span-3">
          <DatasetExplorer 
            datasets={datasets}
            selectedDataset={selectedDataset}
            onSelectDataset={setSelectedDataset}
            onUploadClick={() => setShowUploadModal(true)}
          />
        </div>

        {/* Center Panel - Query Builder */}
        <div className="col-span-5">
          <QueryBuilder
            dataset={selectedDataset || datasets[0]}
            schema={selectedDataset?.schema || datasets[0]?.schema}
            remainingBudget={selectedDataset?.epsilonRemaining || datasets[0]?.epsilonRemaining || 5.0}
            onExecuteQuery={handleExecuteQuery}
          />
        </div>

        {/* Right Panel - Results */}
        <div className="col-span-4">
          <ResultsDisplay 
            result={result} 
            queryHistory={queryHistory}
          />
        </div>
      </div>

      {/* Upload Modal - Reuse from AdminDashboard or create new */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Upload Dataset</h2>
            <p className="text-gray-600 mb-4">CSV upload functionality will be connected to backend</p>
            <button
              onClick={() => setShowUploadModal(false)}
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QueryWorkspace;

