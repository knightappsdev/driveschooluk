import React, { useState, useRef } from 'react';
import { Upload, File, Trash2, Download, AlertCircle, CheckCircle } from 'lucide-react';

interface UploadedFile {
  id?: number;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt?: string;
  courseId?: number;
  category?: string;
}

interface FileUploadProps {
  courseId?: number;
  onUploadComplete?: (file: UploadedFile) => void;
  allowedTypes?: string[];
  maxSize?: number; // in MB
}

export const FileUpload: React.FC<FileUploadProps> = ({
  courseId,
  onUploadComplete,
  allowedTypes = ['.pdf', '.doc', '.docx', '.mp4', '.mp3', '.jpg', '.jpeg', '.png'],
  maxSize = 50
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general'
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset messages
    setError(null);
    setSuccess(null);

    // Validate file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File too large. Maximum size: ${maxSize}MB`);
      return;
    }

    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);

    const data = new FormData();
    data.append('file', file);
    data.append('title', formData.title || file.name);
    data.append('description', formData.description);
    data.append('category', formData.category);
    if (courseId) {
      data.append('courseId', courseId.toString());
    }

    try {
      const response = await fetch('/api/upload/learning-materials', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setSuccess('File uploaded successfully!');
      
      const uploadedFile: UploadedFile = result.material;
      setUploadedFiles(prev => [...prev, uploadedFile]);
      
      if (onUploadComplete) {
        onUploadComplete(uploadedFile);
      }

      // Reset form
      setFormData({ title: '', description: '', category: 'general' });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
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

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5" />
        Upload Learning Materials
      </h3>

      {/* Upload Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter material title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter material description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">General</option>
            <option value="theory">Theory</option>
            <option value="practical">Practical</option>
            <option value="highway-code">Highway Code</option>
            <option value="test-preparation">Test Preparation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select File
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept={allowedTypes.join(',')}
            disabled={uploading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Allowed types: {allowedTypes.join(', ')} | Max size: {maxSize}MB
          </p>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      {uploading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center gap-2 text-blue-700">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
            Uploading file...
          </div>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-3">Recently Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-3">
                  <File className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">{file.title}</p>
                    <p className="text-xs text-gray-500">
                      {file.fileName} • {formatFileSize(file.fileSize)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.id && (
                    <button
                      onClick={() => downloadFile(file.id!, file.fileName)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};