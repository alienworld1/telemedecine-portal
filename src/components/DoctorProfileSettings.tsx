import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  updateDoctorProfile,
  getDoctorProfile,
  DoctorProfile,
} from '../lib/doctors';
import { FaUser, FaEdit, FaSave, FaTimes, FaCalendarAlt } from 'react-icons/fa';

export default function DoctorProfileSettings() {
  const { currentUser, userProfile } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(
    null,
  );
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    specialty: '',
    experience: '',
    education: '',
    bio: '',
    calendlyUrl: '',
    availability: '',
    licenseNumber: '',
  });

  useEffect(() => {
    if (currentUser && userProfile?.role === 'doctor') {
      loadDoctorProfile();
    }
  }, [currentUser, userProfile]);

  const loadDoctorProfile = async () => {
    if (!currentUser) return;

    try {
      const profile = await getDoctorProfile(currentUser.uid);
      if (profile) {
        setDoctorProfile(profile);
        setFormData({
          specialty: profile.specialty || '',
          experience: profile.experience || '',
          education: profile.education || '',
          bio: profile.bio || '',
          calendlyUrl: profile.calendlyUrl || '',
          availability: profile.availability || '',
          licenseNumber: profile.licenseNumber || '',
        });
      }
    } catch (error) {
      console.error('Error loading doctor profile:', error);
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      await updateDoctorProfile(currentUser.uid, formData);
      await loadDoctorProfile(); // Reload the profile
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (doctorProfile) {
      setFormData({
        specialty: doctorProfile.specialty || '',
        experience: doctorProfile.experience || '',
        education: doctorProfile.education || '',
        bio: doctorProfile.bio || '',
        calendlyUrl: doctorProfile.calendlyUrl || '',
        availability: doctorProfile.availability || '',
        licenseNumber: doctorProfile.licenseNumber || '',
      });
    }
    setEditing(false);
  };

  if (userProfile?.role !== 'doctor') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">
          This section is only available for doctors.
        </p>
      </div>
    );
  }

  if (!doctorProfile) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FaUser className="text-blue-600 text-xl" />
          <h3 className="text-xl font-semibold text-gray-900">
            Doctor Profile Settings
          </h3>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FaEdit />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FaSave />
              <span>{loading ? 'Saving...' : 'Save'}</span>
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex items-center space-x-2 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FaTimes />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 border-b pb-2">
            Basic Information
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialty *
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.specialty}
                onChange={e =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Cardiology, General Medicine, Dermatology"
              />
            ) : (
              <p className="text-gray-600">
                {doctorProfile.specialty || 'Not specified'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.experience}
                onChange={e =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 10 years of experience"
              />
            ) : (
              <p className="text-gray-600">
                {doctorProfile.experience || 'Not specified'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Number
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={e =>
                  setFormData({ ...formData, licenseNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Medical license number"
              />
            ) : (
              <p className="text-gray-600">
                {doctorProfile.licenseNumber || 'Not specified'}
              </p>
            )}
          </div>
        </div>

        {/* Scheduling Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 border-b pb-2">
            Scheduling & Availability
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-1" />
              Calendly URL *
            </label>
            {editing ? (
              <div>
                <input
                  type="url"
                  value={formData.calendlyUrl}
                  onChange={e =>
                    setFormData({ ...formData, calendlyUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://calendly.com/your-username/consultation"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This allows patients to book appointments directly with you
                </p>
              </div>
            ) : (
              <div>
                {doctorProfile.calendlyUrl ? (
                  <a
                    href={doctorProfile.calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {doctorProfile.calendlyUrl}
                  </a>
                ) : (
                  <p className="text-red-600">
                    Not configured - Patients cannot book with you
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              General Availability
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.availability}
                onChange={e =>
                  setFormData({ ...formData, availability: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Mon-Fri 9AM-5PM"
              />
            ) : (
              <p className="text-gray-600">
                {doctorProfile.availability || 'Not specified'}
              </p>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="font-semibold text-gray-800 border-b pb-2">
            Additional Information
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education
            </label>
            {editing ? (
              <textarea
                value={formData.education}
                onChange={e =>
                  setFormData({ ...formData, education: e.target.value })
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., MD from Harvard Medical School, Residency at Johns Hopkins"
              />
            ) : (
              <p className="text-gray-600">
                {doctorProfile.education || 'Not specified'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            {editing ? (
              <textarea
                value={formData.bio}
                onChange={e =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell patients about yourself, your approach to medicine, etc."
              />
            ) : (
              <p className="text-gray-600">
                {doctorProfile.bio || 'Not specified'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-semibold text-blue-800 mb-2">
          Setting up Calendly
        </h5>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>
            1. Create a free account at{' '}
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              calendly.com
            </a>
          </li>
          <li>2. Set up your availability and meeting types</li>
          <li>
            3. Copy your Calendly URL (usually
            https://calendly.com/your-username/event-name)
          </li>
          <li>4. Paste it in the Calendly URL field above</li>
          <li>
            5. Save your profile - patients can now book appointments with you!
          </li>
        </ol>
      </div>
    </div>
  );
}
