import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db } from './firebase.js'

// Collection reference
const usersCol = collection(db, 'users')

// Create an auth user and corresponding Firestore profile
export const createUserWithProfile = async ({ email, password, firstName, lastName, role = 'user' }) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  const user = cred.user

  const displayName = `${firstName || ''} ${lastName || ''}`.trim() || null
  if (displayName) {
    await updateProfile(user, { displayName })
  }

  await setDoc(doc(usersCol, user.uid), {
    uid: user.uid,
    firstName: firstName || null,
    lastName: lastName || null,
    displayName,
    email: user.email,
    role,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    emailVerified: user.emailVerified || false,
  })

  return user
}

export const listUsers = async () => {
  const q = query(usersCol, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export const getUserById = async (uid) => {
  const snap = await getDoc(doc(usersCol, uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export const updateUserProfile = (uid, data) =>
  updateDoc(doc(usersCol, uid), {
    ...data,
    updatedAt: serverTimestamp(),
  })

export const deleteUserProfile = (uid, { soft = false } = {}) => {
  if (soft) {
    return updateDoc(doc(usersCol, uid), {
      deleted: true,
      deletedAt: serverTimestamp(),
    })
  }
  return deleteDoc(doc(usersCol, uid))
}

// Convenience helpers for role management
export const setUserRoleByUid = (uid, role) =>
  updateDoc(doc(usersCol, uid), {
    role,
    updatedAt: serverTimestamp(),
  })

export const setUserRoleByEmail = async (email, role) => {
  const q = query(usersCol, where('email', '==', email))
  const snap = await getDocs(q)
  const updates = snap.docs.map((d) =>
    updateDoc(d.ref, {
      role,
      updatedAt: serverTimestamp(),
    }),
  )
  await Promise.all(updates)
  return snap.docs.map((d) => d.id)
}

