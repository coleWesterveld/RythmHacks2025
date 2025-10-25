import { Lock, Target } from 'lucide-react';
import { useState } from 'react';

function EpsilonSlider({ value, onChange, remainingBudget }) {
  const [epsilon, setEpsilon] = useState(value || 0.5);

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setEpsilon(newValue);
    onChange(newValue);
  };

  const insufficient = epsilon > remainingBudget;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Privacy vs. Accuracy Trade-off</h3>
      
      {/* Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <Lock className="h-4 w-4 text-primary" />
            <span className="text-gray-600">Stronger Privacy</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Target className="h-4 w-4 text-secondary" />
            <span className="text-gray-600">Higher Accuracy</span>
          </div>
        </div>

        <div className="relative">
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.1"
            value={epsilon}
            onChange={handleChange}
            className="w-full h-2 bg-gradient-to-r from-primary to-secondary rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Current Value */}
        <div className="text-center">
          <span className="text-3xl font-bold text-gray-900">ε = {epsilon.toFixed(1)}</span>
        </div>

        {/* Info Box */}
        <div className={`p-4 rounded-lg ${insufficient ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
          {insufficient ? (
            <p className="text-sm text-red-700">
              ⚠️ Insufficient budget. You have {remainingBudget.toFixed(1)} ε remaining.
            </p>
          ) : (
            <p className="text-sm text-blue-700">
              This query will use <strong>{epsilon.toFixed(1)} ε</strong> from your budget. 
              Remaining after: <strong>{(remainingBudget - epsilon).toFixed(1)} ε</strong>
            </p>
          )}
        </div>

        {/* Explanation */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p className="mb-1"><strong>Lower epsilon (ε):</strong> Stronger privacy guarantees, more noise added to results</p>
          <p><strong>Higher epsilon (ε):</strong> More accurate results, weaker privacy protection</p>
        </div>
      </div>
    </div>
  );
}

export default EpsilonSlider;