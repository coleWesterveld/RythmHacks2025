import { useState } from 'react';
import { Play, Plus, X } from 'lucide-react';
import EpsilonSlider from '../shared/EpsilonSlider';

function QueryBuilder({ dataset, schema, remainingBudget, totalBudget, onExecuteQuery }) {
  const [queryType, setQueryType] = useState('average');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [filters, setFilters] = useState([]);
  const [epsilon, setEpsilon] = useState(0.5);

  // Helper: Get column type from schema
  const getColumnType = (columnName) => {
    if (!schema?.columns) return null;
    const col = schema.columns.find(c => c.name === columnName);
    return col?.type || null;
  };

  // Helper: Check if a column name suggests it's binary (0/1)
  const isBinaryColumn = (columnName) => {
    if (!columnName) return false;
    const lower = columnName.toLowerCase();
    // Check for common boolean/binary naming patterns
    return lower.includes('has') || 
           lower.includes('is') || 
           lower.includes('flag') || 
           lower.includes('binary') ||
           lower.endsWith('_bool') ||
           lower.endsWith('_bin');
  };

  // Helper: Get allowed operators based on column type (no data hints needed)
  const getAllowedOperators = (columnName) => {
    const colType = getColumnType(columnName);
    if (colType === 'Categorical' || isBinaryColumn(columnName)) return ['=', '!='];
    if (colType === 'Numeric') return ['=', '!=', '>', '>=', '<', '<='];
    return ['='];
  };

  if (!dataset || !schema) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg h-full flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-500">Select a dataset to start building queries</p>
        </div>
      </div>
    );
  }

  const queryableColumns = schema.columns.filter(col => col.queryable);

  const getColumnsForQueryType = () => {
    if (queryType === 'count') return queryableColumns;
    if (queryType === 'average' || queryType === 'sum') {
      return queryableColumns.filter(col => col.type === 'Numeric' || col.type === 'Integer');
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
    if (!selectedColumn) return;
    
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
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900">Build Your Query</h3>
        <p className="text-xs text-gray-500 mt-1">
          Dataset: {dataset.name}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="count">Count rows</option>
            <option value="average">Calculate average</option>
            <option value="sum">Calculate sum</option>
          </select>
        </div>

        {/* Column Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Of the column...
          </label>
          <select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select a column</option>
            {getColumnsForQueryType().map((col, idx) => (
              <option key={idx} value={col.name}>
                {col.icon} {col.name} ({col.type})
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
              className="text-sm text-purple-700 hover:text-purple-800 flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Filter</span>
            </button>
          </div>

          {filters.length > 0 ? (
            <div className="space-y-3">
              {filters.map((filter, idx) => {
                const colType = getColumnType(filter.column);
                const operators = getAllowedOperators(filter.column);
                const isBinary = isBinaryColumn(filter.column);

                return (
                  <div key={idx} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                    {/* Column selector */}
                    <select
                      value={filter.column || ''}
                      onChange={(e) => {
                        updateFilter(idx, 'column', e.target.value);
                        updateFilter(idx, 'value', ''); // Reset value when column changes
                      }}
                      className="w-28 flex-shrink-0 px-2 py-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Select column</option>
                      {queryableColumns.map((col, colIdx) => (
                        <option key={colIdx} value={col.name}>
                          {col.name} ({col.type})
                        </option>
                      ))}
                    </select>

                    {/* Operator selector */}
                    <select
                      value={operators.includes(filter.operator) ? filter.operator : operators[0]}
                      onChange={(e) => updateFilter(idx, 'operator', e.target.value)}
                      className="w-14 flex-shrink-0 px-1 py-2 border border-gray-300 rounded text-sm"
                      disabled={!filter.column}
                    >
                      {operators.map(op => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>

                    {/* Value input - type-based only (no data hints) */}
                    {!filter.column ? (
                      <input
                        type="text"
                        disabled
                        value=""
                        placeholder="Select column first"
                        className="flex-1 min-w-0 px-2 py-2 border border-gray-300 rounded text-sm bg-gray-100"
                      />
                    ) : isBinary ? (
                      // Binary columns (0/1): dropdown
                      <select
                        value={filter.value || ''}
                        onChange={(e) => updateFilter(idx, 'value', e.target.value)}
                        className="flex-1 min-w-0 px-2 py-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Select value</option>
                        <option value="0">No (0)</option>
                        <option value="1">Yes (1)</option>
                      </select>
                    ) : colType === 'Numeric' ? (
                      // Numeric: number input (no range hints for privacy)
                      <input
                        type="number"
                        value={filter.value || ''}
                        onChange={(e) => updateFilter(idx, 'value', e.target.value)}
                        placeholder="Enter number"
                        step="any"
                        className="flex-1 min-w-0 px-2 py-2 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      // Categorical: text input (no suggestions for privacy)
                      <input
                        type="text"
                        value={filter.value || ''}
                        onChange={(e) => updateFilter(idx, 'value', e.target.value)}
                        placeholder="Enter value"
                        className="flex-1 min-w-0 px-2 py-2 border border-gray-300 rounded text-sm"
                      />
                    )}

                    {/* Remove button */}
                    <button
                      onClick={() => removeFilter(idx)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition flex-shrink-0"
                      title="Remove filter"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
              No filters. Query will run on all rows.
            </div>
          )}
        </div>

        {/* Privacy Control */}
        <EpsilonSlider
          value={epsilon}
          onChange={setEpsilon}
          remainingBudget={remainingBudget}
          totalBudget={totalBudget}
          maxPerQuery={Math.min(1.0, remainingBudget || 1.0)}
        />
      </div>

      {/* Action Button */}
      <div className="border-t border-gray-200 p-6">
        <button
          onClick={handleExecute}
          disabled={!canExecute}
          className={`w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-semibold transition shadow-md ${
            canExecute
              ? 'bg-purple-700 text-white hover:bg-purple-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Play className="h-5 w-5" />
          <span>Run Private Query</span>
        </button>
        
        {!canExecute && selectedColumn && (
          <p className="text-xs text-red-600 mt-2 text-center">
            {epsilon > remainingBudget ? 'Insufficient privacy budget' : 'Please select a column'}
          </p>
        )}
      </div>
    </div>
  );
}

export default QueryBuilder;

