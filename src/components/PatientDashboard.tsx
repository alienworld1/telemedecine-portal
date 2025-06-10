import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  FaVideo,
  FaCalendarAlt,
  FaComments,
  FaRobot,
  FaSignOutAlt,
  FaUser,
  FaStar,
  FaUserMd,
  FaHeart,
} from 'react-icons/fa';

export default function PatientDashboard() {
  const { userProfile, logout, applyForDoctor } = useAuth();
  const [showDoctorApplication, setShowDoctorApplication] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDoctorApplication = async () => {
    setLoading(true);
    try {
      await applyForDoctor();
      setShowDoctorApplication(false);
      alert(
        'Your doctor application has been submitted! Please wait for admin approval.',
      );
    } catch (error: any) {
      alert('Error applying for doctor role: ' + error.message);
    }
    setLoading(false);
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
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-500" />
                <span className="text-gray-700">
                  {userProfile?.firstName} {userProfile?.lastName}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Patient
                </span>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userProfile?.firstName}! 👋
          </h2>
          <p className="text-gray-600">
            Ready to take care of your health today?
          </p>
        </div>

        {/* Health Badge */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Health Star Badge</h3>
              <p className="opacity-90">You're on your way to better health!</p>
            </div>
            <FaStar className="text-4xl opacity-80" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left">
            <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaVideo className="text-white text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Video Call
            </h3>
            <p className="text-gray-600 text-sm">
              Start or join a consultation with your doctor
            </p>
          </button>

          <button className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left">
            <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaCalendarAlt className="text-white text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Book Appointment
            </h3>
            <p className="text-gray-600 text-sm">
              Schedule your next consultation
            </p>
          </button>

          <button className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left">
            <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaComments className="text-white text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Secure Chat
            </h3>
            <p className="text-gray-600 text-sm">
              Message your healthcare team
            </p>
          </button>

          <button className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left">
            <div className="bg-orange-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaRobot className="text-white text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Health Assistant
            </h3>
            <p className="text-gray-600 text-sm">
              Get instant symptom analysis
            </p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Appointment Scheduled
                </p>
                <p className="text-sm text-gray-500">
                  Dr. Smith - Tomorrow at 2:00 PM
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                <FaComments className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">New Message</p>
                <p className="text-sm text-gray-500">
                  Dr. Johnson replied to your question
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Application */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Healthcare Provider Portal
          </h3>
          <p className="text-gray-600 mb-4">
            Are you a licensed healthcare professional? Apply to become a doctor
            on our platform.
          </p>

          {!showDoctorApplication ? (
            <button
              onClick={() => setShowDoctorApplication(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <FaUserMd />
              <span>Apply to be a Doctor</span>
            </button>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                Doctor Application
              </h4>
              <p className="text-blue-800 text-sm mb-4">
                By clicking confirm, you're applying to become a doctor on our
                platform. Your application will be reviewed by our admin team.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDoctorApplication}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Submitting...' : 'Confirm Application'}
                </button>
                <button
                  onClick={() => setShowDoctorApplication(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
