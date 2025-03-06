import { initializeApp } from "firebase/app"
// import { getFirestore } from "firebase/firestore";
// import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, connectAuthEmulator } from "firebase/auth"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { LocalStorage } from 'quasar'

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// await signInWithEmailAndPassword(auth, email, password);
// const db = getFirestore(app);
// export const auth = getAnalytics(app);

onAuthStateChanged(auth, (user) => {
 if (user) {
  LocalStorage.set('user', user);
  // await signInWithEmailAndPassword(auth, user.email, user.password)
  // debugger
 } else {
  LocalStorage.remove('user')
 }
});