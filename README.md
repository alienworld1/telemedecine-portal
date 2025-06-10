# Cureify - Telemedicine Portal

A modern telemedicine platform built with React, Firebase, and TypeScript. This MVP demonstrates core telemedicine features including video consultations, appointment booking, secure chat, and AI-powered health assistance.

## 🚀 Features

- **🔐 Authentication System**: Email/password and Google sign-in with role-based access
- **👨‍⚕️ Role Management**: Patient and Doctor roles with different dashboards
- **📞 Video Consultations**: Real-time video calls (integration ready for Daily.co)
- **📅 Appointment Booking**: Scheduling system (Calendly integration ready)
- **💬 Secure Chat**: Real-time messaging between patients and doctors
- **🤖 AI Health Assistant**: Symptom checker powered by AI (Gemini API ready)
- **📱 Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Icons**: React Icons
- **Routing**: React Router v7
- **State Management**: React Context API

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account

### 1. Clone & Install

```bash
git clone <repository-url>
cd telemedecine-portal
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication** and **Firestore Database**
4. In Authentication, enable:
   - Email/Password provider
   - Google provider (optional)
5. Go to Project Settings > General > Your apps
6. Add a Web app and copy the config

### 3. Environment Configuration

```bash
cp .env.example .env
```

Fill in your Firebase configuration in `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Firestore Security Rules

In Firebase Console > Firestore Database > Rules, update to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Admin users can read all users (for role management)
    match /users/{userId} {
      allow read: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 👥 User Roles & Flow

### Patient Journey

1. **Sign Up**: Create account (default role: Patient)
2. **Dashboard**: Access patient features
3. **Apply for Doctor**: Option to request doctor role
4. **Features**: Book appointments, video calls, chat, AI assistant

### Doctor Journey

1. **Apply**: Request doctor role from patient dashboard
2. **Approval**: Admin approves/rejects application
3. **Doctor Dashboard**: Access when role is active
4. **Features**: Manage schedule, patient consultations, secure chat

### Role States

- **Patient**: `role: 'patient'`, `status: 'active'`
- **Doctor (Pending)**: `role: 'doctor'`, `status: 'pending'`
- **Doctor (Active)**: `role: 'doctor'`, `status: 'active'`
- **Doctor (Rejected)**: `role: 'doctor'`, `status: 'rejected'`

## 🔒 Security Features

- **Route Protection**: Role-based access control
- **Firebase Rules**: Secure data access
- **Input Validation**: Form validation and sanitization
- **Authentication**: Secure login/signup flows

## 🚨 Important Disclaimers

⚠️ **Don't use this for production healthcare. This is a demo.**

## 📄 License

This project is a demo. Not licensed for commercial healthcare use.

---

Built with ❤️ for modern healthcare accessibility
