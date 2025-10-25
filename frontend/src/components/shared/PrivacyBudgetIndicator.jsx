import { AlertTriangle } from 'lucide-react';

function PrivacyBudgetIndicator({ spent, total, size = 'md' }) {
  const remaining = total - spent;
  const percentage = (remaining / total) * 100;

  const getColor = () => {
    if (percentage > 60) return 'text-green-600 bg-green-100';
    if (percentage > 30) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };

  return (
    <div className="flex flex-col items-center">
      {/* Circular Progress */}
      <div className={`relative ${sizeClasses[size]}`}>
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${percentage * 2.83} 283`}
            className={percentage > 60 ? 'text-green-500' : percentage > 30 ? 'text-yellow-500' : 'text-red-500'}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">
            {remaining.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500">/ {total} ε</span>
        </div>
      </div>

      {/* Warning */}
      {percentage < 30 && (
        <div className="mt-2 flex items-center space-x-1 text-red-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-medium">Budget Low</span>
        </div>
      )}
    </div>
  );
}

export default PrivacyBudgetIndicator;