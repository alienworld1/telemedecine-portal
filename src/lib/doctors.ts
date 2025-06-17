import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface DoctorProfile {
  uid: string;
  email: string;
  role: 'doctor';
  status: 'active' | 'pending' | 'rejected';
  firstName: string;
  lastName: string;
  specialty?: string;
  licenseNumber?: string;
  experience?: string;
  education?: string;
  bio?: string;
  calendlyUrl?: string;
  availability?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Get all active doctors
export const getActiveDoctors = async (): Promise<DoctorProfile[]> => {
  try {
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'doctor'),
      where('status', '==', 'active'),
    );

    const querySnapshot = await getDocs(q);
    const doctors: DoctorProfile[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      doctors.push({
        uid: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
      } as DoctorProfile);
    });

    return doctors;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

// Get a specific doctor's profile
export const getDoctorProfile = async (
  doctorId: string,
): Promise<DoctorProfile | null> => {
  try {
    const docRef = doc(db, 'users', doctorId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
      } as DoctorProfile;
    }

    return null;
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    throw error;
  }
};

// Update doctor profile (for doctors to add their Calendly URL, specialty, etc.)
export const updateDoctorProfile = async (
  doctorId: string,
  updates: Partial<DoctorProfile>,
): Promise<void> => {
  try {
    const docRef = doc(db, 'users', doctorId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    throw error;
  }
};

// Check if a user is an active doctor
export const isActiveDoctor = async (userId: string): Promise<boolean> => {
  try {
    const profile = await getDoctorProfile(userId);
    return profile?.role === 'doctor' && profile?.status === 'active';
  } catch (error) {
    console.error('Error checking doctor status:', error);
    return false;
  }
};

// Get doctors by specialty
export const getDoctorsBySpecialty = async (
  specialty: string,
): Promise<DoctorProfile[]> => {
  try {
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'doctor'),
      where('status', '==', 'active'),
      where('specialty', '==', specialty),
    );

    const querySnapshot = await getDocs(q);
    const doctors: DoctorProfile[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      doctors.push({
        uid: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
      } as DoctorProfile);
    });

    return doctors;
  } catch (error) {
    console.error('Error fetching doctors by specialty:', error);
    throw error;
  }
};
