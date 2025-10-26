import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import DatasetExplorer from '../components/analyst/DatasetExplorer';
import QueryBuilder from '../components/analyst/QueryBuilder';
import ResultsDisplay from '../components/analyst/ResultsDisplay';
import { uploadDataset, listDatabases, listTables, listColumns, executeDPQuery } from '../services/api';

function QueryWorkspace() {
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [result, setResult] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [datasets, setDatasets] = useState([]); // built from backend databases + columns
  const [selectedTable, setSelectedTable] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Load databases and build dataset objects
  useEffect(() => {
    const load = async () => {
      try {
        const dbRes = await listDatabases(); // { databases: [{ id, name }] }
        const dbs = dbRes.databases || [];
        if (dbs.length === 0) {
          setDatasets([]);
          setSelectedDataset(null);
          return;
        }

        // Pick first database
        const dbName = dbs[0].name; // e.g., db_XXXXXXXX.db
        const tablesRes = await listTables(dbName);
        const tables = tablesRes.tables || [];
        const tableName = tables[0];
        setSelectedTable(tableName || null);

        let schemaObj = { tableName: tableName || 'data', columns: [] };
        if (tableName) {
          const colsRes = await listColumns(dbName, tableName); // { columns: [{name,type}] }
          const cols = colsRes.columns || [];
          schemaObj.columns = cols.map(c => ({
            name: c.name,
            type: c.type === 'numeric' ? 'Numeric' : 'Categorical',
            queryable: true,
            icon: c.type === 'numeric' ? '' : ''
          }));
        }

        const dataset = {
          id: dbs[0].id,
          name: dbName,
          description: 'Uploaded dataset',
          schema: schemaObj,
          databaseName: dbName,
          table: tableName,
          epsilonRemaining: 5.0,
          epsilonTotal: 5.0,
          recordCount: 0,
        };
        setDatasets([dataset]);
        setSelectedDataset(dataset);
      } catch (e) {
        // If backend not available, keep empty state
        setDatasets([]);
      }
    };
    load();
  }, []);

  const handleExecuteQuery = async (query) => {
    if (!selectedDataset) return;
    const operation = query.type === 'average' ? 'AVERAGE' : query.type === 'sum' ? 'SUM' : 'COUNT';
    // Backend expects filters as an object (dict), not an array.
    // Convert [{column, operator, value}] -> { column: value } (operator currently ignored by backend)
    const filtersPayload = Array.isArray(query.filters) && query.filters.length
      ? query.filters.reduce((acc, f) => {
          if (f && f.column && typeof f.value !== 'undefined') {
            acc[f.column] = f.value;
          }
          return acc;
        }, {})
      : null;
    try {
      const resp = await executeDPQuery({
        operation,
        column: query.column,
        table: selectedDataset.table || selectedTable || selectedDataset?.schema?.tableName || 'patients',
        epsilon: query.epsilon,
        filters: filtersPayload,
        database_name: selectedDataset.databaseName,
        epsilon_budget: selectedDataset.epsilonRemaining,
      });

      // Approximate accuracy bound for Laplace with sensitivity=1
      const scale = 1.0 / query.epsilon;
      const accuracy = (Math.log(2 / (1 - 0.95)) * scale).toFixed(1);

      const resObj = {
        label: operation === 'AVERAGE' ? `Average ${query.column}` : operation === 'SUM' ? `Sum of ${query.column}` : 'Count',
        value: Number(resp.result).toFixed(1),
        groundTruth: undefined, // backend not returning ground truth; leave undefined
        unit: operation === 'COUNT' ? 'records' : '',
        epsilonSpent: query.epsilon,
        accuracy,
        queryId: 'QRY-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: new Date().toISOString(),
        queryText: `${operation}(${query.column})${query.filters.length > 0 ? ' WHERE ...' : ''}`,
        executionTime: '—',
        rowsAnalyzed: 0,
        remainingBudget: (Math.max(0, (selectedDataset.epsilonRemaining || 0) - query.epsilon)).toFixed(1),
        showGroundTruth: false,
      };

      // Update budget in dataset state
      setDatasets(prev => {
        if (!prev.length) return prev;
        const d = { ...prev[0], epsilonRemaining: Math.max(0, (prev[0].epsilonRemaining || 0) - query.epsilon) };
        setSelectedDataset(d);
        return [d];
      });

      setResult(resObj);
      setQueryHistory(h => ([...h, { label: resObj.label, epsilon: query.epsilon, timestamp: new Date().toISOString() }]));
    } catch (e) {
      // Fallback: keep previous behavior or show error
      console.error('Query failed', e);
    }
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
            totalBudget={selectedDataset?.epsilonTotal || datasets[0]?.epsilonTotal || 5.0}
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Upload Dataset</h2>
            <div className="space-y-4">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="w-full"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!uploadFile) return;
                    try {
                      setUploading(true);
                      // Upload and capture the new database name
                      const up = await uploadDataset(uploadFile);
                      const dbName = up?.database_name;
                      setShowUploadModal(false);
                      setUploadFile(null);

                      // Build dataset object for the newly uploaded DB
                      if (dbName) {
                        const tablesRes = await listTables(dbName);
                        const tableName = (tablesRes.tables || [])[0];
                        let schemaObj = { tableName: tableName || 'data', columns: [] };
                        if (tableName) {
                          const colsRes = await listColumns(dbName, tableName);
                          const cols = colsRes.columns || [];
                          schemaObj.columns = cols.map(c => ({
                            name: c.name,
                            type: c.type === 'numeric' ? 'Numeric' : 'Categorical',
                            queryable: true,
                            icon: c.type === 'numeric' ? '' : ''
                          }));
                        }
                        const newDataset = {
                          id: dbName.replace('db_', '').replace('.db', ''),
                          name: dbName,
                          description: 'Uploaded dataset',
                          schema: schemaObj,
                          databaseName: dbName,
                          table: tableName,
                          epsilonRemaining: 5.0,
                          epsilonTotal: 5.0,
                          recordCount: 0,
                        };
                        // Prepend new dataset and keep others (de-duplicate by databaseName)
                        setDatasets(prev => [newDataset, ...prev.filter(d => d.databaseName !== dbName)]);
                        setSelectedDataset(newDataset);
                        setSelectedTable(tableName || null);
                      } else {
                        // Fallback: reload list and pick last
                        const dbRes = await listDatabases();
                        const all = dbRes.databases || [];
                        if (all.length) {
                          const last = all[all.length - 1].name;
                          const tablesRes = await listTables(last);
                          const tableName = (tablesRes.tables || [])[0];
                          let schemaObj = { tableName: tableName || 'data', columns: [] };
                          if (tableName) {
                            const colsRes = await listColumns(last, tableName);
                            const cols = colsRes.columns || [];
                            schemaObj.columns = cols.map(c => ({ name: c.name, type: c.type === 'numeric' ? 'Numeric' : 'Categorical', queryable: true, icon: c.type === 'numeric' ? '' : '' }));
                          }
                          const dataset = {
                            id: all[all.length - 1].id,
                            name: last,
                            description: 'Uploaded dataset',
                            schema: schemaObj,
                            databaseName: last,
                            table: tableName,
                            epsilonRemaining: 5.0,
                            epsilonTotal: 5.0,
                            recordCount: 0,
                          };
                          setDatasets(prev => [dataset, ...prev.filter(d => d.databaseName !== last)]);
                          setSelectedDataset(dataset);
                          setSelectedTable(tableName || null);
                        }
                      }
                    } catch (e) {
                      console.error('Upload failed', e);
                    } finally {
                      setUploading(false);
                    }
                  }}
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
                  disabled={!uploadFile || uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QueryWorkspace;

