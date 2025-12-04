import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth"
import { LocalStorage } from 'quasar'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4VD7-UiXIKqx7pw3Klp-ObCvPFdX23w0",
  authDomain: "reg-internal-app.firebaseapp.com",
  databaseURL: "https://reg-internal-app-default-rtdb.firebaseio.com",
  projectId: "reg-internal-app",
  storageBucket: "reg-internal-app.firebasestorage.app",
  messagingSenderId: "364888330562",
  appId: "1:364888330562:web:4f89a2130fca50a8ad38db",
  measurementId: "G-RMER3MSFFN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Enable persistent authentication across page refreshes
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Persistence enabled
    console.log('Firebase persistence enabled')
  })
  .catch((error) => {
    console.error('Failed to enable persistence:', error)
  })

// Monitor authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in - store in LocalStorage
    LocalStorage.set('user', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    })
    console.log('User authenticated:', user.email)
  } else {
    // User is logged out - remove from LocalStorage
    LocalStorage.remove('user')
    console.log('User logged out')
  }
})
