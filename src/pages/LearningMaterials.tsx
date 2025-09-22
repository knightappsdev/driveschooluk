import React, { useState, useEffect } from 'react';
import { FileUpload } from '../components/common/FileUpload';
import { Book, Download, Trash2, Search, Filter, Eye } from 'lucide-react';

interface LearningMaterial {
  id: number;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  category: string;
  createdAt: string;
  course?: {
    title: string;
  };
}

export const LearningMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/upload/learning-materials');
      if (!response.ok) throw new Error('Failed to fetch materials');
      
      const data = await response.json();
      setMaterials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (newFile: any) => {
    fetchMaterials(); // Refresh the list
  };

  const downloadFile = async (fileId: number, fileName: string) => {
    try {
      const response = await fetch(`/api/upload/learning-materials/${fileId}/download`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Download failed');
    }
  };

  const deleteFile = async (fileId: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/upload/learning-materials/${fileId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Delete failed');
      
      setMaterials(prev => prev.filter(m => m.id !== fileId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      'theory': 'bg-blue-100 text-blue-800',
      'practical': 'bg-green-100 text-green-800',
      'highway-code': 'bg-purple-100 text-purple-800',
      'test-preparation': 'bg-yellow-100 text-yellow-800',
      'general': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesCategory = categoryFilter === 'all' || material.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Book className="w-6 h-6" />
          Learning Materials
        </h1>
        <p className="text-gray-600 mt-1">Upload and manage learning materials for courses</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <FileUpload onUploadComplete={handleUploadComplete} />
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Search & Filter</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Materials
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, filename, or description..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Category
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="general">General</option>
                  <option value="theory">Theory</option>
                  <option value="practical">Practical</option>
                  <option value="highway-code">Highway Code</option>
                  <option value="test-preparation">Test Preparation</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredMaterials.length} of {materials.length} materials
            </div>
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">All Learning Materials</h3>
        </div>

        {filteredMaterials.length === 0 ? (
          <div className="p-12 text-center">
            <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-600">
              {materials.length === 0 
                ? "Upload your first learning material to get started" 
                : "Try adjusting your search or filter criteria"
              }
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredMaterials.map((material) => (
              <div key={material.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{material.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{material.fileName}</p>
                        {material.description && (
                          <p className="text-sm text-gray-600 mt-2">{material.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 mt-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadgeColor(material.category)}`}>
                            {material.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatFileSize(material.fileSize)}
                          </span>
                          {material.course && (
                            <span className="text-xs text-gray-500">
                              Course: {material.course.title}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatDate(material.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => downloadFile(material.id, material.fileName)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteFile(material.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};