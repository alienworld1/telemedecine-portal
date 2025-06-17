import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Appointment {
  id?: string;
  userId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  title: string;
  start: Date;
  end: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'video' | 'chat' | 'in-person';
  notes?: string;
  calendlyEventId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create a new appointment
export const createAppointment = async (
  appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'appointments'), {
      ...appointmentData,
      start: Timestamp.fromDate(appointmentData.start),
      end: Timestamp.fromDate(appointmentData.end),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Get appointments for a specific user (patient or doctor)
export const getUserAppointments = async (
  userId: string,
  userType: 'patient' | 'doctor',
): Promise<Appointment[]> => {
  try {
    const field = userType === 'patient' ? 'userId' : 'doctorId';
    const q = query(
      collection(db, 'appointments'),
      where(field, '==', userId),
      orderBy('start', 'desc'),
    );

    const querySnapshot = await getDocs(q);
    const appointments: Appointment[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      appointments.push({
        id: doc.id,
        ...data,
        start: data.start.toDate(),
        end: data.end.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Appointment);
    });

    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

// Update appointment status
export const updateAppointmentStatus = async (
  appointmentId: string,
  status: Appointment['status'],
): Promise<void> => {
  try {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

// Cancel appointment
export const cancelAppointment = async (
  appointmentId: string,
): Promise<void> => {
  try {
    await updateAppointmentStatus(appointmentId, 'cancelled');
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
};

// Delete appointment
export const deleteAppointment = async (
  appointmentId: string,
): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'appointments', appointmentId));
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

// Get all appointments (for calendar view)
export const getAllAppointments = async (): Promise<Appointment[]> => {
  try {
    const q = query(collection(db, 'appointments'), orderBy('start', 'asc'));

    const querySnapshot = await getDocs(q);
    const appointments: Appointment[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      appointments.push({
        id: doc.id,
        ...data,
        start: data.start.toDate(),
        end: data.end.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Appointment);
    });

    return appointments;
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    throw error;
  }
};
