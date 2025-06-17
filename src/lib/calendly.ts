// Calendly API service for fetching event details
// Documentation: https://developer.calendly.com/api-docs

export interface CalendlyEvent {
  uri: string;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  event_type: string;
  location?: {
    type: string;
    location?: string;
    join_url?: string;
  };
  invitees_counter: {
    total: number;
    active: number;
    limit: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CalendlyInvitee {
  uri: string;
  email: string;
  name: string;
  status: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

class CalendlyAPIService {
  private baseURL = 'https://api.calendly.com';
  private accessToken = import.meta.env.VITE_CALENDLY_ACCESS_TOKEN;

  private async makeRequest(endpoint: string) {
    if (
      !this.accessToken ||
      this.accessToken === 'your_calendly_access_token_here'
    ) {
      throw new Error(
        'Calendly access token not configured. Please set VITE_CALENDLY_ACCESS_TOKEN in your .env.local file.',
      );
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Calendly API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async getScheduledEvent(eventUri: string): Promise<CalendlyEvent> {
    // Extract the path from the full URI
    const path = eventUri.replace(this.baseURL, '');
    const response = await this.makeRequest(path);
    return response.resource;
  }

  async getEventInvitees(eventUri: string): Promise<CalendlyInvitee[]> {
    // Extract the path from the full URI and add /invitees
    const path = eventUri.replace(this.baseURL, '') + '/invitees';
    const response = await this.makeRequest(path);
    return response.collection;
  }

  // Alternative method for when we only have the invitee URI
  async getInvitee(inviteeUri: string): Promise<CalendlyInvitee> {
    const path = inviteeUri.replace(this.baseURL, '');
    const response = await this.makeRequest(path);
    return response.resource;
  }
}

export const calendlyAPI = new CalendlyAPIService();

// Fallback function for when API token is not configured
export const createFallbackAppointment = (
  eventData: any,
  userProfile: any,
  selectedDoctor: any,
  currentUser: any,
) => {
  // Create a basic appointment with placeholder data when API is not available
  const now = new Date();
  const eventUri = eventData.event?.uri || eventData.uri;

  return {
    userId: currentUser.uid,
    doctorId: selectedDoctor.uid,
    patientName:
      `${userProfile.firstName || 'Patient'} ${userProfile.lastName || ''}`.trim(),
    doctorName: `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
    title: `Consultation with Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
    start: now,
    end: new Date(now.getTime() + 30 * 60 * 1000), // 30 minutes later
    status: 'scheduled' as const,
    type: 'video' as const,
    calendlyEventId: eventUri || `calendly_fallback_${Date.now()}`,
    notes: `Scheduled via Calendly - API token not configured, please check Calendly email for exact time. ${selectedDoctor.specialty || 'General consultation'}`,
  };
};
