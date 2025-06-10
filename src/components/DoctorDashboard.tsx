import { useAuth } from '../context/AuthContext';
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
} from 'react-icons/fa';

export default function DoctorDashboard() {
  const { userProfile, logout } = useAuth();

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
                  Your doctor application is being reviewed by our admin team.
                  You'll receive an email once approved.
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
                  <p className="text-sm text-gray-600">Today's Appointments</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <FaCalendarAlt className="text-blue-600 text-2xl" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900">142</p>
                </div>
                <FaUsers className="text-green-600 text-2xl" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unread Messages</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
                <FaComments className="text-purple-600 text-2xl" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Video Calls</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <FaVideo className="text-orange-600 text-2xl" />
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left ${
              userProfile?.status !== 'active'
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            disabled={userProfile?.status !== 'active'}
          >
            <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
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
            <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaCalendarAlt className="text-white text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Manage Schedule
            </h3>
            <p className="text-gray-600 text-sm">
              View and update your availability
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
            className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left ${
              userProfile?.status !== 'active'
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            disabled={userProfile?.status !== 'active'}
          >
            <div className="bg-orange-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaUsers className="text-white text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Patient Portal
            </h3>
            <p className="text-gray-600 text-sm">
              Access patient records and notes
            </p>
          </button>
        </div>

        {/* Today's Schedule */}
        {userProfile?.status === 'active' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Today's Schedule
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                    <FaVideo className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">John Doe</p>
                    <p className="text-sm text-gray-500">
                      10:00 AM - Video Consultation
                    </p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Join Call
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-600 w-10 h-10 rounded-full flex items-center justify-center">
                    <FaStethoscope className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Jane Smith</p>
                    <p className="text-sm text-gray-500">
                      2:00 PM - Follow-up Consultation
                    </p>
                  </div>
                </div>
                <button className="text-green-600 hover:text-green-700 font-medium">
                  View Details
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-600 w-10 h-10 rounded-full flex items-center justify-center">
                    <FaVideo className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Mike Johnson</p>
                    <p className="text-sm text-gray-500">
                      4:30 PM - Initial Consultation
                    </p>
                  </div>
                </div>
                <button className="text-purple-600 hover:text-purple-700 font-medium">
                  Prepare
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
