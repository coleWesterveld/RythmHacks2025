import { useNavigate } from 'react-router-dom';
import { Shield, TrendingUp, Upload, Play } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-12 mb-8 text-white shadow-xl">
        <div className="max-w-4xl">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-8 w-8" />
            <span className="text-sm font-semibold uppercase tracking-wide">Privacy-Preserving Analytics</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Analyze Sensitive Data with Mathematical Privacy Guarantees
          </h1>
          <p className="text-xl text-purple-100 mb-8">
            Unlock insights from patient records, student data, and HR information without violating HIPAA, FERPA, or GDPR.
            Our differential privacy engine ensures no individual can be identified from your analysis.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/workspace')}
              className="bg-white text-purple-700 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition flex items-center space-x-2 shadow-lg"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Your First Dataset</span>
            </button>
            <button
              onClick={() => navigate('/workspace')}
              className="bg-purple-700 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-600 transition flex items-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>Start Querying</span>
            </button>
          </div>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <div className="bg-purple-100 p-4 rounded-xl w-fit mb-4">
            <Shield className="h-8 w-8 text-purple-700" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">HIPAA Compliant</h3>
          <p className="text-gray-600">
            Analyze patient records without violating healthcare privacy regulations. Perfect for hospitals and clinics.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <div className="bg-green-100 p-4 rounded-xl w-fit mb-4">
            <TrendingUp className="h-8 w-8 text-green-700" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Clear Privacy Trade-offs</h3>
          <p className="text-gray-600">
            Choose privacy vs. accuracy with an epsilon slider, guided presets, and guardrails.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <div className="bg-purple-100 p-4 rounded-xl w-fit mb-4">
            <TrendingUp className="h-8 w-8 text-purple-700" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Actionable Insights</h3>
          <p className="text-gray-600">
            Get accurate results you can publish, act on, or use for advertising without privacy concerns.
          </p>
        </div>
      </div>

      {/* Use Case Examples */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">🏥 Healthcare Analytics</h3>
            <p className="text-sm text-gray-600 mb-3">
              "What's the average hospital stay for diabetes patients?"
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded p-3 text-sm">
              <div className="font-mono text-purple-900">Result: 4.8 days (±0.3 days)</div>
              <div className="text-xs text-purple-700 mt-1">✓ 0.5-differential privacy</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">🎓 Education Research</h3>
            <p className="text-sm text-gray-600 mb-3">
              "What's the average GPA by department?"
            </p>
            <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
              <div className="font-mono text-green-900">Result: 3.42 (±0.08)</div>
              <div className="text-xs text-green-700 mt-1">✓ 0.3-differential privacy</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">💼 HR Analytics</h3>
            <p className="text-sm text-gray-600 mb-3">
              "What's the salary range for software engineers?"
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded p-3 text-sm">
              <div className="font-mono text-purple-900">Result: $95,000 (±$5,000)</div>
              <div className="text-xs text-purple-700 mt-1">✓ 0.7-differential privacy</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">📊 Market Research</h3>
            <p className="text-sm text-gray-600 mb-3">
              "How many users in the 25-34 age bracket?"
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
              <div className="font-mono text-yellow-900">Result: 3,245 users (±45)</div>
              <div className="text-xs text-yellow-700 mt-1">✓ 0.4-differential privacy</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-12 text-center bg-purple-700 rounded-xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Unlock Your Stranded Data?</h2>
        <p className="text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
          Stop letting privacy concerns prevent you from analyzing your valuable data.
          Start getting insights today with mathematical privacy guarantees.
        </p>
        <button
          onClick={() => navigate('/workspace')}
          className="bg-white text-purple-700 px-10 py-4 rounded-lg font-bold text-lg hover:bg-purple-50 transition shadow-lg inline-flex items-center space-x-2"
        >
          <Upload className="h-6 w-6" />
          <span>Get Started Now</span>
        </button>
      </div>
    </div>
  );
}

export default Home;

