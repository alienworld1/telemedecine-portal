import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Appointment, getUserAppointments } from '../lib/appointments';
import { useAuth } from '../context/AuthContext';
import { FaCalendarAlt, FaClock, FaUser, FaVideo } from 'react-icons/fa';

interface AppointmentCalendarProps {
  userType: 'patient' | 'doctor';
}

export default function AppointmentCalendar({
  userType,
}: AppointmentCalendarProps) {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    loadAppointments();
  }, [currentUser, userType]);

  const loadAppointments = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const fetchedAppointments = await getUserAppointments(
        currentUser.uid,
        userType,
      );
      setAppointments(fetchedAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
    setLoading(false);
  };

  // Convert appointments to FullCalendar events
  const calendarEvents = appointments.map(appointment => ({
    id: appointment.id,
    title:
      userType === 'patient'
        ? `Dr. ${appointment.doctorName}`
        : appointment.patientName,
    start: appointment.start,
    end: appointment.end,
    backgroundColor: getEventColor(appointment.status),
    borderColor: getEventColor(appointment.status),
    extendedProps: appointment,
  }));

  function getEventColor(status: Appointment['status']) {
    switch (status) {
      case 'scheduled':
        return '#3B82F6'; // Blue
      case 'completed':
        return '#10B981'; // Green
      case 'cancelled':
        return '#EF4444'; // Red
      default:
        return '#6B7280'; // Gray
    }
  }

  const handleEventClick = (info: any) => {
    setSelectedAppointment(info.event.extendedProps);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="text-blue-600 text-xl" />
          <h3 className="text-xl font-semibold text-gray-900">
            Appointments Calendar
          </h3>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Scheduled</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Cancelled</span>
          </div>
        </div>
      </div>

      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          height="auto"
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',
          }}
          dayMaxEvents={3}
          moreLinkClick="popover"
        />
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Appointment Details
              </h4>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-500" />
                <span className="font-medium">
                  {userType === 'patient' ? 'Doctor:' : 'Patient:'}
                </span>
                <span>
                  {userType === 'patient'
                    ? `Dr. ${selectedAppointment.doctorName}`
                    : selectedAppointment.patientName}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <FaClock className="text-gray-500" />
                <span className="font-medium">Time:</span>
                <span>
                  {selectedAppointment.start.toLocaleDateString()} at{' '}
                  {selectedAppointment.start.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <FaVideo className="text-gray-500" />
                <span className="font-medium">Type:</span>
                <span className="capitalize">{selectedAppointment.type}</span>
              </div>

              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    selectedAppointment.status === 'scheduled'
                      ? 'bg-blue-500'
                      : selectedAppointment.status === 'completed'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                  }`}
                ></div>
                <span className="font-medium">Status:</span>
                <span className="capitalize">{selectedAppointment.status}</span>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <span className="font-medium">Notes:</span>
                  <p className="text-gray-600 mt-1">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              {selectedAppointment.status === 'scheduled' && (
                <>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Join Call
                  </button>
                  <button className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                    Reschedule
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
