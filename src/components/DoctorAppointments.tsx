import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserAppointments, Appointment } from '../lib/appointments';
import {
  FaCalendarAlt,
  FaVideo,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaExclamationCircle,
} from 'react-icons/fa';

export default function DoctorAppointments() {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    'all' | 'today' | 'upcoming' | 'completed'
  >('all');

  useEffect(() => {
    loadAppointments();
  }, [currentUser]);

  const loadAppointments = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const fetchedAppointments = await getUserAppointments(
        currentUser.uid,
        'doctor',
      );
      // Sort appointments by start time (newest first)
      const sortedAppointments = fetchedAppointments.sort(
        (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime(),
      );
      setAppointments(sortedAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
    setLoading(false);
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (filter) {
      case 'today':
        return appointments.filter(apt => {
          const aptDate = new Date(apt.start);
          return aptDate >= today && aptDate < tomorrow;
        });
      case 'upcoming':
        return appointments.filter(
          apt => new Date(apt.start) > now && apt.status === 'scheduled',
        );
      case 'completed':
        return appointments.filter(apt => apt.status === 'completed');
      default:
        return appointments;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <FaClock className="h-3 w-3" />;
      case 'completed':
        return <FaCheckCircle className="h-3 w-3" />;
      case 'cancelled':
        return <FaExclamationCircle className="h-3 w-3" />;
      default:
        return <FaClock className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
            <p className="text-gray-600">Loading your appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-blue-600 text-xl" />
            <h2 className="text-xl font-semibold text-gray-900">
              My Appointments
            </h2>
          </div>
          <div className="flex space-x-2">
            {(['all', 'today', 'upcoming', 'completed'] as const).map(
              filterOption => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === filterOption
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="p-6">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <FaCalendarAlt className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-500">
              {filter === 'all'
                ? "You don't have any appointments yet."
                : `No ${filter} appointments to display.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map(appointment => (
              <div
                key={appointment.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaUser className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {appointment.patientName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {appointment.title}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <FaCalendarAlt className="h-3 w-3" />
                          <span>{formatDate(appointment.start)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <FaClock className="h-3 w-3" />
                          <span>
                            {formatTime(appointment.start)} -{' '}
                            {formatTime(appointment.end)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <FaVideo className="h-3 w-3" />
                          <span>{appointment.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                    >
                      {getStatusIcon(appointment.status)}
                      <span>{appointment.status}</span>
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      View Details
                    </button>
                  </div>
                </div>
                {appointment.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <strong>Notes:</strong> {appointment.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
