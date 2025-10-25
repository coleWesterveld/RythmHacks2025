import { useState, useRef } from 'react';
import DatasetCard from '../components/admin/DatasetCard';
import { mockDatasets } from '../data/mockData';
import { Plus, Database, Users, Activity, Upload, X, FileText, CheckCircle } from 'lucide-react';
import axios from 'axios';

function AdminDashboard() {
  const [datasets, setDatasets] = useState(mockDatasets);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const totalQueries = datasets.reduce((sum, d) => sum + d.queries, 0);
  const totalResearchers = datasets.reduce((sum, d) => sum + d.researchers, 0);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setUploadError('Please select a CSV file');
        return;
      }
      setUploadFile(file);
      setUploadError('');
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadSuccess(true);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadSuccess(false);
        // Refresh datasets list
        // In a real app, you'd fetch the updated list from the backend
      }, 2000);
    } catch (error) {
      setUploadError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetUploadModal = () => {
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadError('');
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      {/* Role Indicator Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-3 rounded-lg mb-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium opacity-90">Current View</div>
            <div className="text-lg font-bold">Admin Dashboard</div>
          </div>
        </div>
        <div className="text-sm opacity-90">
          Manage datasets, researchers, and privacy budgets
        </div>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dataset Management</h1>
          <p className="text-gray-600 mt-1">Manage your secure datasets and privacy budgets</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-800 transition shadow-md"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Dataset</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Datasets</p>
              <p className="text-2xl font-bold text-gray-900">{datasets.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Researchers</p>
              <p className="text-2xl font-bold text-gray-900">{totalResearchers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Queries This Month</p>
              <p className="text-2xl font-bold text-gray-900">{totalQueries}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {datasets.map(dataset => (
          <DatasetCard key={dataset.id} dataset={dataset} />
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Upload Dataset</h2>
                <p className="text-gray-600 mt-1">Upload a CSV file to create a new dataset</p>
              </div>
              <button 
                onClick={resetUploadModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {uploadSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Successful!</h3>
                  <p className="text-gray-600">Your dataset has been uploaded and is being processed.</p>
                </div>
              ) : (
                <>
                  {/* File Upload Area */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CSV File *
                    </label>
                    
                    {!uploadFile ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                      >
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          CSV files only (max 100MB)
                        </p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{uploadFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setUploadFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="text-red-600 hover:text-red-700 transition"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  {/* Error Message */}
                  {uploadError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{uploadError}</p>
                    </div>
                  )}

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">Upload Guidelines</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• CSV file with headers in the first row</li>
                      <li>• Maximum file size: 100MB</li>
                      <li>• Data will be encrypted and stored securely</li>
                      <li>• You can configure privacy budgets after upload</li>
                    </ul>
                  </div>
                </>
              )}
            </div>

            {!uploadSuccess && (
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={resetUploadModal}
                  disabled={uploading}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadFile || uploading}
                  className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload Dataset</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;