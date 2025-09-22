import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Users, MapPin, Edit, Trash2 } from 'lucide-react';

interface CalendarEvent {
  id: string;
  type: 'booking' | 'availability';
  title: string;
  start: string;
  end: string;
  status?: string;
  lessonType?: string;
  location?: string;
  notes?: string;
  student?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  editable: boolean;
  available?: boolean;
  dayOfWeek?: number;
  recurring?: boolean;
}

interface CalendarSummary {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  totalAvailableSlots: number;
  totalUnavailableSlots: number;
}

interface InstructorCalendarProps {
  instructorId: string;
  startDate: string;
  endDate: string;
}

export const InstructorCalendar: React.FC<InstructorCalendarProps> = ({
  instructorId,
  startDate,
  endDate
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [summary, setSummary] = useState<CalendarSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showAddAvailability, setShowAddAvailability] = useState(false);
  const [availabilityForm, setAvailabilityForm] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
    isRecurring: true
  });

  useEffect(() => {
    fetchCalendarData();
  }, [instructorId, startDate, endDate]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/calendar/instructor/${instructorId}?startDate=${startDate}&endDate=${endDate}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch calendar data');
      }
      
      const data = await response.json();
      setEvents(data.events);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load calendar');
    } finally {
      setLoading(false);
    }
  };

  const addAvailability = async () => {
    try {
      const response = await fetch(`/api/calendar/instructor/${instructorId}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(availabilityForm)
      });

      if (!response.ok) {
        throw new Error('Failed to add availability');
      }

      setShowAddAvailability(false);
      fetchCalendarData(); // Refresh the calendar
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add availability');
    }
  };

  const getEventsByDate = (date: string) => {
    return events.filter(event => {
      const eventDate = new Date(event.start).toDateString();
      const targetDate = new Date(date).toDateString();
      return eventDate === targetDate;
    });
  };

  const generateCalendarDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = [];

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date).toISOString().split('T')[0]);
    }

    return days;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'CONFIRMED': 'bg-green-100 text-green-800 border-green-200',
      'COMPLETED': 'bg-blue-100 text-blue-800 border-blue-200',
      'CANCELLED': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
          <Calendar className="w-6 h-6" />
          Instructor Calendar
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your availability and view scheduled lessons
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">{summary.confirmedBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{summary.pendingBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Available Slots</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalAvailableSlots}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <button
              onClick={() => setShowAddAvailability(true)}
              className="w-full flex items-center justify-center gap-2 p-2 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50"
            >
              <Plus className="w-4 h-4" />
              Add Availability
            </button>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Weekly Schedule</h3>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* Day Headers */}
          {dayNames.map(day => (
            <div key={day} className="bg-gray-50 p-3 text-center font-medium text-gray-900">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {generateCalendarDays().slice(0, 14).map(date => { // Show 2 weeks
            const dayEvents = getEventsByDate(date);
            const dayOfWeek = new Date(date).getDay();
            
            return (
              <div key={date} className="bg-white min-h-32 p-2">
                <div className="text-sm font-medium text-gray-900 mb-2">
                  {new Date(date).getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded border ${
                        event.type === 'booking'
                          ? getStatusColor(event.status || 'PENDING')
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-xs opacity-75">
                        {formatTime(event.start)} - {formatTime(event.end)}
                      </div>
                      
                      {event.type === 'booking' && event.student && (
                        <div className="text-xs opacity-75 truncate">
                          {event.student.name}
                        </div>
                      )}
                      
                      {event.location && (
                        <div className="flex items-center gap-1 text-xs opacity-75">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Availability Modal */}
      {showAddAvailability && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Availability</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day of Week
                </label>
                <select
                  value={availabilityForm.dayOfWeek}
                  onChange={(e) => setAvailabilityForm(prev => ({
                    ...prev,
                    dayOfWeek: parseInt(e.target.value)
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>Monday</option>
                  <option value={2}>Tuesday</option>
                  <option value={3}>Wednesday</option>
                  <option value={4}>Thursday</option>
                  <option value={5}>Friday</option>
                  <option value={6}>Saturday</option>
                  <option value={0}>Sunday</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={availabilityForm.startTime}
                    onChange={(e) => setAvailabilityForm(prev => ({
                      ...prev,
                      startTime: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={availabilityForm.endTime}
                    onChange={(e) => setAvailabilityForm(prev => ({
                      ...prev,
                      endTime: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={availabilityForm.isRecurring}
                  onChange={(e) => setAvailabilityForm(prev => ({
                    ...prev,
                    isRecurring: e.target.checked
                  }))}
                  className="mr-2"
                />
                <label htmlFor="recurring" className="text-sm text-gray-700">
                  Recurring weekly
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddAvailability(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addAvailability}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Availability
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Panel (could be expanded) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Lessons</h3>
          <div className="space-y-3">
            {events
              .filter(event => event.type === 'booking' && new Date(event.start) > new Date())
              .slice(0, 5)
              .map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <div className="font-medium">{event.student?.name}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(event.start).toLocaleDateString()} at {formatTime(event.start)}
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(event.status || 'PENDING')}`}>
                    {event.status}
                  </div>
                </div>
              ))}
            
            {events.filter(event => event.type === 'booking' && new Date(event.start) > new Date()).length === 0 && (
              <p className="text-gray-500 text-center py-4">No upcoming lessons scheduled</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Availability Pattern</h3>
          <div className="space-y-2">
            {dayNames.map((day, index) => {
              const dayAvailability = events.filter(
                event => event.type === 'availability' && event.dayOfWeek === index
              );
              
              return (
                <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="font-medium">{day}</span>
                  <div className="text-sm text-gray-600">
                    {dayAvailability.length > 0 ? (
                      dayAvailability.map(slot => (
                        <span key={slot.id} className="mr-2">
                          {formatTime(slot.start)} - {formatTime(slot.end)}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">Not available</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};