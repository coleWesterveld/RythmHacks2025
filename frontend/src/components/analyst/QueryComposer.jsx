import { useState } from 'react';
import { Play, Save, X, Plus, Code } from 'lucide-react';
import EpsilonSlider from '../shared/EpsilonSlider';

function QueryComposer({ schema, remainingBudget, onExecuteQuery }) {
  const [mode, setMode] = useState('builder'); // 'builder' or 'sql'
  const [queryType, setQueryType] = useState('count');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [filters, setFilters] = useState([]);
  const [epsilon, setEpsilon] = useState(0.5);

  const queryableColumns = schema.columns.filter(col => col.queryable);

  const getColumnsForQueryType = () => {
    if (queryType === 'count') return queryableColumns;
    if (queryType === 'average' || queryType === 'sum') {
      return queryableColumns.filter(col => col.type === 'Numeric' || col.type === 'Integer');
    }
    if (queryType === 'histogram') {
      return queryableColumns.filter(col => col.type === 'Categorical');
    }
    return queryableColumns;
  };

  const addFilter = () => {
    setFilters([...filters, { column: '', operator: '=', value: '' }]);
  };

  const updateFilter = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    setFilters(newFilters);
  };

  const removeFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleExecute = () => {
    const query = {
      type: queryType,
      column: selectedColumn,
      filters,
      epsilon
    };
    onExecuteQuery(query);
  };

  const canExecute = selectedColumn && epsilon <= remainingBudget;

  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full flex flex-col">
      {/* Header with Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-4 px-6 pt-4">
          <button
            onClick={() => setMode('builder')}
            className={`pb-3 px-2 font-medium text-sm border-b-2 transition ${
              mode === 'builder'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Build Query
          </button>
          <button
            onClick={() => setMode('sql')}
            className={`pb-3 px-2 font-medium text-sm border-b-2 transition ${
              mode === 'sql'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>SQL Mode</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {mode === 'builder' ? (
          <div className="space-y-6">
            {/* Query Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to...
              </label>
              <select
                value={queryType}
                onChange={(e) => {
                  setQueryType(e.target.value);
                  setSelectedColumn('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="count">Count rows</option>
                <option value="average">Calculate average</option>
                <option value="sum">Calculate sum</option>
                <option value="histogram">See distribution (histogram)</option>
              </select>
            </div>

            {/* Column Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Of the...
              </label>
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a column</option>
                {getColumnsForQueryType().map((col, idx) => (
                  <option key={idx} value={col.name}>
                    {col.name} ({col.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Filters */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Where... (optional)
                </label>
                <button
                  onClick={addFilter}
                  className="text-sm text-primary hover:text-blue-700 flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Filter</span>
                </button>
              </div>

              {filters.length > 0 ? (
                <div className="space-y-2">
                  {filters.map((filter, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <select
                        value={filter.column}
                        onChange={(e) => updateFilter(idx, 'column', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Select column</option>
                        {queryableColumns.map((col, colIdx) => (
                          <option key={colIdx} value={col.name}>
                            {col.name}
                          </option>
                        ))}
                      </select>
                      <select
                        value={filter.operator}
                        onChange={(e) => updateFilter(idx, 'operator', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="=">=</option>
                        <option value=">">{'>'}</option>
                        <option value="<">{'<'}</option>
                        <option value=">=">≥</option>
                        <option value="<=">≤</option>
                        <option value="!=">≠</option>
                      </select>
                      <input
                        type="text"
                        value={filter.value}
                        onChange={(e) => updateFilter(idx, 'value', e.target.value)}
                        placeholder="Value"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <button
                        onClick={() => removeFilter(idx)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setFilters([])}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg text-center">
                  No filters added. Query will run on all rows.
                </div>
              )}
            </div>

            {/* Privacy Control */}
            <EpsilonSlider
              value={epsilon}
              onChange={setEpsilon}
              remainingBudget={remainingBudget}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* SQL Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SQL Query
              </label>
              <textarea
                className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="SELECT AVG(age) FROM patient_records WHERE condition = 'Diabetes'"
              />
            </div>

            {/* Schema Reference */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-700 mb-2">Available Columns:</div>
              <div className="flex flex-wrap gap-2">
                {queryableColumns.map((col, idx) => (
                  <span key={idx} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs">
                    {col.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Privacy Control */}
            <EpsilonSlider
              value={epsilon}
              onChange={setEpsilon}
              remainingBudget={remainingBudget}
            />

            <button className="text-sm text-primary hover:text-blue-700">
              Convert to visual builder →
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex space-x-3">
          <button
            onClick={handleExecute}
            disabled={!canExecute}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition shadow-md ${
              canExecute
                ? 'bg-blue-700 text-white hover:bg-blue-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Play className="h-5 w-5" />
            <span>Run Private Query</span>
          </button>
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
            <Save className="h-5 w-5" />
          </button>
          <button className="px-6 py-3 text-gray-500 hover:text-gray-700 transition">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default QueryComposer;
