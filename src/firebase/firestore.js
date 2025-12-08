import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase.js'

export { db }

// Generic helpers
export const addDocument = (path, data) => addDoc(collection(db, path), data)

export const setDocument = (path, id, data, options) => setDoc(doc(db, path, id), data, options)

export const updateDocument = (path, id, data) => updateDoc(doc(db, path, id), data)

export const deleteDocument = (path, id) => deleteDoc(doc(db, path, id))

export const getDocument = (path, id) => getDoc(doc(db, path, id))

export const getCollection = (path, constraints = []) =>
  getDocs(constraints.length ? query(collection(db, path), ...constraints) : collection(db, path))

// App-specific helpers
export const createUserProfile = (user, payload = {}) =>
  setDoc(
    doc(db, 'users', user.uid),
    {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      emailVerified: user.emailVerified || false,
    },
    { merge: true },
  )

export const getUserRole = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid))
  const data = snap.exists() ? snap.data() : null
  return data?.role || null
}

