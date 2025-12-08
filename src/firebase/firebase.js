import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase project configuration
// Consider moving these values to environment variables for production builds.
const firebaseConfig = {
  apiKey: 'AIzaSyB4VD7-UiXIKqx7pw3Klp-ObCvPFdX23w0',
  authDomain: 'reg-internal-app.firebaseapp.com',
  databaseURL: 'https://reg-internal-app-default-rtdb.firebaseio.com',
  projectId: 'reg-internal-app',
  storageBucket: 'reg-internal-app.appspot.com',
  messagingSenderId: '364888330562',
  appId: '1:364888330562:web:4f89a2130fca50a8ad38db',
  measurementId: 'G-RMER3MSFFN',
}

// Initialize core Firebase services
// Avoid duplicate app initialization in HMR/SSR
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Keep auth state across refreshes for the SPA
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error('Failed to enable auth persistence', err)
})

export { app, auth, db, storage }
