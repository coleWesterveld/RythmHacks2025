import { useState } from 'react';
import { ChevronDown, ChevronRight, Lock, Info } from 'lucide-react';

function SchemaExplorer({ schema }) {
  const [expanded, setExpanded] = useState(true);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Integer':
      case 'Numeric':
        return '🔢';
      case 'Categorical':
        return '📝';
      default:
        return '📊';
    }
  };

  const getTypeDescription = (type) => {
    switch (type) {
      case 'Integer':
        return 'Whole numbers - suitable for COUNT, SUM';
      case 'Numeric':
        return 'Numbers with decimals - suitable for AVG, SUM, COUNT';
      case 'Categorical':
        return 'Text categories - suitable for COUNT, GROUP BY';
      default:
        return 'Data field';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900">Available Datasets</h3>
      </div>

      {/* Schema Tree */}
      <div className="p-4">
        <div className="space-y-2">
          {/* Dataset Node */}
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center space-x-2 w-full hover:bg-gray-50 p-2 rounded transition"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
              <span className="text-sm">📊</span>
              <span className="text-sm font-medium text-gray-900">{schema.tableName}</span>
            </button>

            {/* Columns */}
            {expanded && (
              <div className="ml-6 mt-2 space-y-1">
                <div className="text-xs text-gray-500 mb-2 ml-2">Columns:</div>
                {schema.columns.map((column, idx) => (
                  <div
                    key={idx}
                    className={`group relative p-2 rounded hover:bg-gray-50 transition ${
                      !column.queryable ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{getTypeIcon(column.type)}</span>
                      <span className={`text-sm ${column.queryable ? 'text-gray-900' : 'text-gray-500'}`}>
                        {column.name}
                      </span>
                      <span className="text-xs text-gray-400">({column.type})</span>
                      {column.queryable ? (
                        <span className="text-green-600 text-xs">✓</span>
                      ) : (
                        <Lock className="h-3 w-3 text-gray-400" />
                      )}
                    </div>

                    {/* Tooltip */}
                    <div className="absolute left-full ml-2 top-0 hidden group-hover:block z-10 w-64">
                      <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                        <div className="font-semibold mb-1">{column.name}</div>
                        <div className="text-gray-300">{getTypeDescription(column.type)}</div>
                        {!column.queryable && (
                          <div className="text-red-300 mt-1">⚠️ Not queryable - sensitive identifier</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer - Privacy Policy */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <a
          href="#"
          className="flex items-center space-x-2 text-xs text-blue-600 hover:text-blue-700"
        >
          <Info className="h-3 w-3" />
          <span>How we protect data →</span>
        </a>
      </div>
    </div>
  );
}

export default SchemaExplorer;
