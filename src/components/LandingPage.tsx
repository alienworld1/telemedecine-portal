import { useNavigate } from 'react-router';
import {
  FaVideo,
  FaCalendarAlt,
  FaComments,
  FaRobot,
  FaHeart,
  FaShieldAlt,
} from 'react-icons/fa';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <FaHeart className="text-green-600 text-2xl" />
              <h1 className="text-2xl font-bold text-gray-800">Cureify</h1>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-green-600 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Healthcare at Your
            <span className="text-green-600"> Fingertips</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with licensed healthcare professionals instantly. Book
            appointments, have video consultations, and get AI-powered health
            insights - all from the comfort of your home.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/login')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              I'm a Patient
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              I'm a Doctor
            </button>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-yellow-800">
              <FaShieldAlt className="inline mr-2" />
              <strong>Prototype Notice:</strong> This is a demo. Please do not
              use this for actual healthcare services.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Modern Healthcare
            </h3>
            <p className="text-lg text-gray-600">
              Simple, secure, and designed with your health in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaVideo className="text-white text-xl" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Video Consultations
              </h4>
              <p className="text-gray-600">
                High-quality video calls with healthcare professionals in
                real-time
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-white text-xl" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Scheduling
              </h4>
              <p className="text-gray-600">
                Book appointments instantly with your preferred healthcare
                provider
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaComments className="text-white text-xl" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Chat
              </h4>
              <p className="text-gray-600">
                Private messaging with your healthcare team for ongoing support
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
              <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRobot className="text-white text-xl" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                AI Health Assistant
              </h4>
              <p className="text-gray-600">
                Get instant symptom analysis and health guidance powered by AI
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How Cureify Works
            </h3>
            <p className="text-lg text-gray-600">
              Get healthcare in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Sign Up & Book
              </h4>
              <p className="text-gray-600">
                Create your account and schedule an appointment with a licensed
                healthcare provider
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Connect & Consult
              </h4>
              <p className="text-gray-600">
                Join your video consultation and discuss your health concerns
                with your doctor
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Follow Up
              </h4>
              <p className="text-gray-600">
                Stay connected through secure chat and get ongoing support for
                your health journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Take Control of Your Health?
          </h3>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of patients already using Cureify for their
            healthcare needs
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
          >
            Start Your Health Journey Today
          </button>
        </div>
      </section>
    </div>
  );
}
