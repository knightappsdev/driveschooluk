import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Instructor {
  id: string;
  userId: string;
  user: User;
  instructorLicense: string;
  vehicleType: string;
  experience: number;
  hourlyRate: number;
  isActive: boolean;
  activeStudents: number;
  rating?: number;
}

const InstructorManagement: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/instructors');
      
      if (response.success) {
        setInstructors((response.data as Instructor[]) || []);
      } else {
        setError(response.message || 'Failed to load instructors');
      }
    } catch (err) {
      setError('Failed to load instructors');
      console.error('Load instructors error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = 
      instructor.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && instructor.isActive) ||
      (statusFilter === 'inactive' && !instructor.isActive);

    return matchesSearch && matchesStatus;
  });

  const handleViewInstructor = (instructor: Instructor) => {
    console.log('Viewing instructor:', instructor);
    // Add navigation or modal logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instructor Management</h1>
          <p className="text-gray-600">Manage instructors and student assignments</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Add Instructor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Instructors Grid */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInstructors.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              <p>No instructors found matching your criteria.</p>
            </div>
          ) : (
            filteredInstructors.map((instructor) => (
              <div key={instructor.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {instructor.user.firstName} {instructor.user.lastName}
                    </h3>
                    <p className="text-gray-600 text-sm">{instructor.user.email}</p>
                    <p className="text-gray-500 text-sm">{instructor.instructorLicense}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    instructor.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {instructor.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{instructor.experience || 0} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vehicle Type:</span>
                    <span className="font-medium">{instructor.vehicleType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Hourly Rate:</span>
                    <span className="font-medium">£{instructor.hourlyRate || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Students:</span>
                    <span className="font-medium">{instructor.activeStudents}</span>
                  </div>
                  {instructor.rating && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-medium flex items-center">
                        ⭐ {instructor.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewInstructor(instructor)}
                    className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-100 transition-colors"
                  >
                    View Details
                  </button>
                  <button className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded text-sm hover:bg-green-100 transition-colors">
                    Assign Student
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Assignment Success Demo */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-green-800 font-medium mb-2">🎉 Real-Time Assignment System Active</h3>
        <p className="text-green-700 text-sm">
          When you assign students to instructors, both parties will receive instant notifications 
          through the real-time Socket.IO system. Check the notification bell in the top-right corner!
        </p>
      </div>
    </div>
  );
};

export default InstructorManagement;