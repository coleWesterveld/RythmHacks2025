import { Lock, Target, Shield, Gauge } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

function EpsilonSlider({ value, onChange, remainingBudget, totalBudget, maxPerQuery = 1.0 }) {
  const [epsilon, setEpsilon] = useState(value ?? 0.5);

  const sliderMax = useMemo(() => {
    const caps = [Number.isFinite(remainingBudget) ? remainingBudget : 2.0, maxPerQuery, 2.0];
    return Math.max(0.1, Math.min(...caps));
  }, [remainingBudget, maxPerQuery]);

  useEffect(() => {
    // Clamp incoming value if remaining budget changed
    if (epsilon > sliderMax) {
      setEpsilon(sliderMax);
      onChange(sliderMax);
    }
  }, [sliderMax]);

  const handleChange = (e) => {
    const raw = parseFloat(e.target.value);
    const newValue = Math.min(sliderMax, Math.max(0.1, raw));
    setEpsilon(newValue);
    onChange(newValue);
  };

  const handleNumberChange = (e) => {
    const raw = parseFloat(e.target.value || '');
    if (Number.isNaN(raw)) return;
    const newValue = Math.min(sliderMax, Math.max(0.1, raw));
    setEpsilon(newValue);
    onChange(newValue);
  };

  const insufficient = epsilon > (remainingBudget ?? 0);
  const spent = (totalBudget ?? remainingBudget ?? 0) - (remainingBudget ?? 0);
  const remainingAfter = Math.max(0, (remainingBudget ?? 0) - epsilon);

  const total = totalBudget ?? (spent + (remainingBudget ?? 0));
  const spentPct = total > 0 ? (spent / total) * 100 : 0;
  const proposedPct = total > 0 ? (epsilon / total) * 100 : 0;
  const remainingAfterPct = total > 0 ? (remainingAfter / total) * 100 : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Privacy vs. Accuracy</h3>
        <div className="text-xs text-gray-500 flex items-center space-x-2">
          <Shield className="h-4 w-4 text-purple-700" />
          <span>Max per query: {maxPerQuery.toFixed(1)} ε</span>
        </div>
      </div>

      {/* Overall Budget Bar */}
      {Number.isFinite(total) && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Overall budget</span>
            <span>{(total - spent).toFixed(1)} / {total.toFixed(1)} ε</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
            {spentPct > 0 && (
              <div 
                className="h-full bg-gray-400" 
                style={{ width: `${spentPct}%` }}
                title={`Spent: ${spent.toFixed(1)} ε`}
              />
            )}
            {proposedPct > 0 && (
              <div 
                className="h-full bg-amber-400" 
                style={{ width: `${proposedPct}%` }}
                title={`This query: ${epsilon.toFixed(1)} ε`}
              />
            )}
            {remainingAfterPct > 0 && (
              <div 
                className="h-full bg-green-500" 
                style={{ width: `${remainingAfterPct}%` }}
                title={`Remaining: ${remainingAfter.toFixed(1)} ε`}
              />
            )}
          </div>
          <div className="flex justify-between text-[11px] text-gray-500 mt-1">
            <span>Spent: {spent.toFixed(1)} ε</span>
            <span className="text-amber-600 font-medium">This query: {epsilon.toFixed(1)} ε</span>
            <span>After: {remainingAfter.toFixed(1)} ε</span>
          </div>
        </div>
      )}

      {/* Slider Row */}
      <div className="space-y-3">
        {/* Recommendations bar */}
        <div className="flex items-center justify-between text-xs">
          <span className="px-2 py-1 rounded bg-green-100 text-green-700">0.1–0.4 ε (High privacy)</span>
          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">0.5–0.7 ε (Balanced)</span>
          <span className="px-2 py-1 rounded bg-red-100 text-red-700">0.8–1.0 ε (Lower privacy)</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Lock className="h-4 w-4 text-purple-700" />
            <span>Stronger Privacy</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Target className="h-4 w-4 text-teal-600" />
            <span>Higher Accuracy</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="range"
            min={0.1}
            max={sliderMax}
            step={0.1}
            value={epsilon}
            onChange={handleChange}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-700"
          />
          <input
            type="number"
            min={0.1}
            max={sliderMax}
            step={0.1}
            value={Number.isFinite(epsilon) ? epsilon : ''}
            onChange={handleNumberChange}
            className="w-20 px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>

        {/* Current Value */}
        <div className="text-center">
          <span className="text-3xl font-bold text-gray-900">ε = {epsilon.toFixed(1)}</span>
        </div>

        {/* Info Box */}
        <div className={`p-4 rounded-lg ${insufficient ? 'bg-red-50 border border-red-200' : 'bg-purple-50 border border-purple-200'}`}>
          {insufficient ? (
            <p className="text-sm text-red-700">
              ⚠️ Insufficient budget. You have {(remainingBudget ?? 0).toFixed(1)} ε remaining.
            </p>
          ) : (
            <p className="text-sm text-purple-700">
              This query will use <strong>{epsilon.toFixed(1)} ε</strong>. Remaining after: <strong>{remainingAfter.toFixed(1)} ε</strong>
            </p>
          )}
        </div>

        {/* Soft warning when close to per-query cap */}
        {epsilon > (sliderMax * 0.9) && !insufficient && (
          <div className="p-3 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            Approaching per-query limit ({sliderMax.toFixed(1)} ε). Consider using 0.5–0.7 ε for balanced results.
          </div>
        )}

        {/* Explanation */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p className="mb-1"><strong>Lower epsilon (ε)</strong> adds more noise but protects privacy better.</p>
          <p><strong>Higher epsilon (ε)</strong> increases accuracy but weakens privacy.</p>
        </div>
      </div>
    </div>
  );
}

export default EpsilonSlider;