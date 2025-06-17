import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserAppointments, Appointment } from '../lib/appointments';
import AppointmentCalendar from './AppointmentCalendar';
import DoctorProfileSettings from './DoctorProfileSettings';
import DoctorAppointments from './DoctorAppointments';
import {
  FaVideo,
  FaCalendarAlt,
  FaComments,
  FaUsers,
  FaSignOutAlt,
  FaUser,
  FaStethoscope,
  FaHeart,
  FaClock,
  FaCheckCircle,
  FaSpinner,
} from 'react-icons/fa';

export default function DoctorDashboard() {
  const { userProfile, logout, currentUser } = useAuth();
  const [activeSection, setActiveSection] = useState<
    'dashboard' | 'appointments' | 'profile'
  >('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  // Fetch doctor's appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentUser || userProfile?.role !== 'doctor') return;

      setLoadingAppointments(true);
      try {
        const doctorAppointments = await getUserAppointments(
          currentUser.uid,
          'doctor',
        );
        setAppointments(doctorAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
      setLoadingAppointments(false);
    };

    fetchAppointments();
  }, [currentUser, userProfile]);

  // Get today's appointments
  const getTodaysAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return appointments.filter(apt => {
      const aptDate = new Date(apt.start);
      return aptDate >= today && aptDate < tomorrow;
    });
  };

  const getStatusBadge = () => {
    switch (userProfile?.status) {
      case 'active':
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <FaCheckCircle />
            <span>Active Doctor</span>
          </span>
        );
      case 'pending':
        return (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <FaClock />
            <span>Pending Approval</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
            Application Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <FaHeart className="text-green-600 text-2xl" />
              <h1 className="text-2xl font-bold text-gray-800">Cureify</h1>
              <span className="text-sm text-gray-500">| Doctor Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-1">
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveSection('appointments')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'appointments'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Appointments
                </button>
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'profile'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Profile Settings
                </button>
              </nav>
              <div className="flex items-center space-x-2">
                <FaStethoscope className="text-blue-500" />
                <span className="text-gray-700">
                  Dr. {userProfile?.firstName} {userProfile?.lastName}
                </span>
                {getStatusBadge()}
              </div>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-red-600 flex items-center space-x-1"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <>
            {/* Status Message */}
            {userProfile?.status === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                <div className="flex items-center space-x-3">
                  <FaClock className="text-yellow-600 text-xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800">
                      Application Under Review
                    </h3>
                    <p className="text-yellow-700">
                      Your doctor application is being reviewed by our admin
                      team. You'll receive an email once approved.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {userProfile?.status === 'rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <div className="flex items-center space-x-3">
                  <FaUser className="text-red-600 text-xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">
                      Application Not Approved
                    </h3>
                    <p className="text-red-700">
                      Your doctor application was not approved. Please contact
                      support for more information.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, Dr. {userProfile?.firstName}! 👨‍⚕️
              </h2>
              <p className="text-gray-600">
                {userProfile?.status === 'active'
                  ? 'Ready to help your patients today?'
                  : 'Your doctor dashboard will be fully activated once approved.'}
              </p>
            </div>

            {/* Stats Overview */}
            {userProfile?.status === 'active' && (
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Today's Appointments
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {getTodaysAppointments().length}
                      </p>
                    </div>
                    <FaCalendarAlt className="text-blue-600 text-2xl" />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Total Appointments
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {appointments.length}
                      </p>
                    </div>
                    <FaUsers className="text-green-600 text-2xl" />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Scheduled</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {
                          appointments.filter(apt => apt.status === 'scheduled')
                            .length
                        }
                      </p>
                    </div>
                    <FaComments className="text-purple-600 text-2xl" />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {
                          appointments.filter(apt => apt.status === 'completed')
                            .length
                        }
                      </p>
                    </div>
                    <FaVideo className="text-orange-600 text-2xl" />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <button
                onClick={() => setActiveSection('appointments')}
                className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left ${
                  userProfile?.status !== 'active'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={userProfile?.status !== 'active'}
              >
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <FaCalendarAlt className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  View Appointments
                </h3>
                <p className="text-gray-600 text-sm">
                  See all your scheduled appointments
                </p>
              </button>

              <button
                className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left ${
                  userProfile?.status !== 'active'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={userProfile?.status !== 'active'}
              >
                <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <FaVideo className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Start Video Call
                </h3>
                <p className="text-gray-600 text-sm">
                  Begin a consultation with a patient
                </p>
              </button>

              <button
                className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left ${
                  userProfile?.status !== 'active'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={userProfile?.status !== 'active'}
              >
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <FaComments className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Patient Messages
                </h3>
                <p className="text-gray-600 text-sm">
                  Respond to patient inquiries
                </p>
              </button>

              <button
                onClick={() => setActiveSection('profile')}
                className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left ${
                  userProfile?.status !== 'active'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={userProfile?.status !== 'active'}
              >
                <div className="bg-orange-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <FaUser className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Update Profile
                </h3>
                <p className="text-gray-600 text-sm">
                  Manage your professional information
                </p>
              </button>
            </div>

            {/* Today's Schedule */}
            {userProfile?.status === 'active' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Today's Schedule
                  </h3>
                  <button
                    onClick={() => {
                      if (currentUser) {
                        const fetchAppointments = async () => {
                          setLoadingAppointments(true);
                          try {
                            const doctorAppointments =
                              await getUserAppointments(
                                currentUser.uid,
                                'doctor',
                              );
                            setAppointments(doctorAppointments);
                          } catch (error) {
                            console.error(
                              'Error refreshing appointments:',
                              error,
                            );
                          }
                          setLoadingAppointments(false);
                        };
                        fetchAppointments();
                      }
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <FaSpinner
                      className={loadingAppointments ? 'animate-spin' : ''}
                    />
                    <span>Refresh</span>
                  </button>
                </div>
                {loadingAppointments ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="flex items-center space-x-2">
                      <FaSpinner className="animate-spin text-blue-600" />
                      <span className="text-gray-600">
                        Loading appointments...
                      </span>
                    </div>
                  </div>
                ) : getTodaysAppointments().length === 0 ? (
                  <div className="text-center py-8">
                    <FaCalendarAlt className="text-gray-300 text-4xl mx-auto mb-4" />
                    <p className="text-gray-500">
                      No appointments scheduled for today
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getTodaysAppointments().map(appointment => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 bg-blue-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                            <FaVideo className="text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {appointment.patientName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(appointment.start).toLocaleTimeString(
                                [],
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                },
                              )}{' '}
                              - {appointment.title}
                            </p>
                            {appointment.notes && (
                              <p className="text-xs text-gray-400 mt-1">
                                {appointment.notes.substring(0, 50)}...
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              appointment.status === 'scheduled'
                                ? 'bg-green-100 text-green-800'
                                : appointment.status === 'completed'
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {appointment.status}
                          </span>
                          <button className="text-blue-600 hover:text-blue-700 font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Appointment Section */}
        {activeSection === 'appointments' && (
          <div className="space-y-6">
            {/* Appointments List */}
            <DoctorAppointments />

            {/* Calendar View */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Calendar View
              </h3>
              <AppointmentCalendar userType="doctor" />
            </div>
          </div>
        )}

        {/* Profile Settings Section */}
        {activeSection === 'profile' && <DoctorProfileSettings />}
      </div>
    </div>
  );
}
