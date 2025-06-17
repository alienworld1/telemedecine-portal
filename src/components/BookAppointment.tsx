import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createAppointment } from '../lib/appointments';
import { getActiveDoctors, DoctorProfile } from '../lib/doctors';
import { calendlyAPI, createFallbackAppointment } from '../lib/calendly';
import {
  FaUserMd,
  FaCalendarAlt,
  FaVideo,
  FaComments,
  FaExclamationTriangle,
} from 'react-icons/fa';

// Simple inline Calendly component for registered doctors
interface CalendlyEmbedProps {
  url: string;
  height?: string;
  onEventScheduled?: (event: any) => void;
}

function CalendlyEmbed({
  url,
  height = '600px',
  onEventScheduled,
}: CalendlyEmbedProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    const handleCalendlyEvent = (event: MessageEvent) => {
      if (event.origin !== 'https://calendly.com') return;

      console.log('Received Calendly event:', event.data);

      if (event.data.event && event.data.event === 'calendly.event_scheduled') {
        console.log('Event scheduled payload:', event.data.payload);
        onEventScheduled?.(event.data.payload);
      }
    };

    window.addEventListener('message', handleCalendlyEvent);
    return () => {
      window.removeEventListener('message', handleCalendlyEvent);
      const existingScript = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]',
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [onEventScheduled]);

  if (
    !url ||
    url.includes('demo-doctor') ||
    url.includes('your-doctor') ||
    url.includes('calendly.com/demo')
  ) {
    return (
      <div className="flex items-center justify-center h-96 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
        <div className="text-center p-6">
          <FaExclamationTriangle className="text-yellow-600 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Calendly URL Not Set
          </h3>
          <p className="text-yellow-700 text-sm">
            This doctor hasn't configured their Calendly scheduling link yet.
            Please contact the doctor directly or try another doctor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="calendly-inline-widget"
      data-url={url}
      style={{ minWidth: '320px', height }}
    />
  );
}

export default function BookAppointment() {
  const { currentUser, userProfile } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(
    null,
  );
  const [showCalendly, setShowCalendly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);

  // Fetch real doctors from Firebase
  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setFetchingDoctors(true);
    try {
      const activeDoctors = await getActiveDoctors();
      setDoctors(activeDoctors);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
    setFetchingDoctors(false);
  };

  const handleDoctorSelect = (doctor: DoctorProfile) => {
    setSelectedDoctor(doctor);
    setShowCalendly(true);
  };

  const handleCalendlyEventScheduled = async (eventData: any) => {
    if (!currentUser || !userProfile || !selectedDoctor) return;

    setLoading(true);
    try {
      // Log the event data to debug
      console.log('Calendly event data:', eventData);

      const eventUri = eventData.event?.uri || eventData.uri;

      if (!eventUri) {
        throw new Error('No event URI provided by Calendly');
      }

      // Fetch the actual event details from Calendly API
      console.log('Fetching event details from Calendly API...');

      let appointmentData;
      try {
        const [eventDetails, invitees] = await Promise.all([
          calendlyAPI.getScheduledEvent(eventUri),
          eventUri ? calendlyAPI.getEventInvitees(eventUri) : [],
        ]);

        console.log('Event details from Calendly:', eventDetails);
        console.log('Event invitees:', invitees);

        // Create Date objects from the actual Calendly event times
        const startDate = new Date(eventDetails.start_time);
        const endDate = new Date(eventDetails.end_time);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          throw new Error('Invalid date format from Calendly API');
        }

        // Get the invitee information (patient details)
        const patientInvitee =
          invitees.find(
            inv =>
              inv.email === currentUser.email ||
              (userProfile.firstName &&
                inv.name
                  .toLowerCase()
                  .includes(userProfile.firstName.toLowerCase())),
          ) || invitees[0]; // fallback to first invitee

        // Create appointment record in Firestore with real data
        appointmentData = {
          userId: currentUser.uid,
          doctorId: selectedDoctor.uid,
          patientName:
            patientInvitee?.name ||
            `${userProfile.firstName} ${userProfile.lastName}`,
          doctorName: `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
          title:
            eventDetails.name ||
            `Consultation with Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
          start: startDate,
          end: endDate,
          status: 'scheduled' as const,
          type: 'video' as const,
          calendlyEventId: eventUri,
          notes: `Scheduled via Calendly - ${selectedDoctor.specialty || 'General consultation'}. ${eventDetails.location?.join_url ? 'Video call link: ' + eventDetails.location.join_url : ''}`,
        };
      } catch (apiError) {
        console.warn(
          'Failed to fetch from Calendly API, using fallback:',
          apiError,
        );
        // Use fallback when API is not configured or fails
        appointmentData = createFallbackAppointment(
          eventData,
          userProfile,
          selectedDoctor,
          currentUser,
        );
      }

      console.log('Creating appointment with data:', appointmentData);
      await createAppointment(appointmentData);

      alert(
        'Appointment booked successfully! Your appointment details have been saved to your dashboard. You will also receive a confirmation email from Calendly.',
      );
      setShowCalendly(false);
      setSelectedDoctor(null);
    } catch (error) {
      console.error('Error saving appointment:', error);

      // Provide more specific error messages
      let errorMessage = 'There was an error saving your appointment. ';
      if (error instanceof Error) {
        if (error.message.includes('access token not configured')) {
          errorMessage =
            'Calendly API is not configured. The appointment was scheduled in Calendly but could not be saved to our system. Please contact support.';
        } else if (error.message.includes('Invalid')) {
          errorMessage +=
            'Please try booking again or contact support if the issue persists.';
        } else if (error.message.includes('Calendly API error')) {
          errorMessage +=
            'There was an issue connecting to Calendly. Your appointment may still be scheduled - please check your email and contact support.';
        } else {
          errorMessage +=
            'Please contact support with the following error: ' + error.message;
        }
      } else {
        errorMessage += 'Please contact support.';
      }

      alert(errorMessage);
    }
    setLoading(false);
  };

  if (showCalendly && selectedDoctor) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Book with Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
            </h3>
            <p className="text-gray-600">
              {selectedDoctor.specialty || 'General Medicine'}
            </p>
          </div>
          <button
            onClick={() => {
              setShowCalendly(false);
              setSelectedDoctor(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back to Doctors
          </button>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Saving appointment...</p>
            </div>
          </div>
        )}

        <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaVideo className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>What happens next:</strong> After booking, your
                appointment will be automatically saved with the correct time
                and details. You'll also receive a confirmation email from
                Calendly.
              </p>
            </div>
          </div>
        </div>

        <CalendlyEmbed
          url={selectedDoctor.calendlyUrl || ''}
          height="700px"
          onEventScheduled={handleCalendlyEventScheduled}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <FaCalendarAlt className="text-blue-600 text-xl" />
        <h3 className="text-xl font-semibold text-gray-900">
          Book an Appointment
        </h3>
      </div>

      <p className="text-gray-600 mb-6">
        Choose a doctor and schedule your consultation. All appointments include
        video call access.
      </p>

      {fetchingDoctors ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading available doctors...</p>
          </div>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-12">
          <FaUserMd className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Doctors Available
          </h3>
          <p className="text-gray-500 mb-4">
            There are currently no active doctors on the platform.
          </p>
          <button
            onClick={loadDoctors}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map(doctor => (
            <div
              key={doctor.uid}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleDoctorSelect(doctor)}
            >
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={
                    doctor.profileImage ||
                    `https://ui-avatars.com/api/?name=Dr+${doctor.firstName}+${doctor.lastName}&background=3B82F6&color=fff&size=48`
                  }
                  alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {doctor.specialty || 'General Medicine'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaUserMd className="text-blue-500" />
                  <span>{doctor.specialty || 'General Medicine'}</span>
                </div>
                {doctor.experience && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FaCalendarAlt className="text-green-500" />
                    <span>{doctor.experience}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaVideo className="text-purple-500" />
                  <span>Video Consultation</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaComments className="text-orange-500" />
                  <span>Secure Chat</span>
                </div>
                {!doctor.calendlyUrl && (
                  <div className="flex items-center space-x-2 text-sm text-yellow-600">
                    <FaExclamationTriangle className="text-yellow-500" />
                    <span>Calendly not configured</span>
                  </div>
                )}
              </div>

              <button
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  doctor.calendlyUrl
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!doctor.calendlyUrl}
              >
                {doctor.calendlyUrl ? 'Book Appointment' : 'Unavailable'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Disclaimer:</strong> This is a prototype telemedicine platform
          for demonstration purposes only. It is not HIPAA-compliant and should
          not be used for actual medical consultations. Please consult with real
          healthcare professionals for medical advice.
        </p>
      </div>
    </div>
  );
}
