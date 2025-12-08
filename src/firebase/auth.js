import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from './firebase.js'
import { createUserProfile } from './firestore.js'

/**
 * Sign in using email/password.
 */
export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password).then((res) => res.user)

/**
 * Create a user and persist profile data in Firestore.
 */
export const registerWithEmail = async ({ email, password, firstName, lastName }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user
  const displayName = `${firstName || ''} ${lastName || ''}`.trim() || null

  if (displayName) {
    await updateProfile(user, { displayName })
  }

  await createUserProfile(user, {
    uid: user.uid,
    firstName: firstName || null,
    lastName: lastName || null,
    email: user.email,
    displayName,
    role: 'user',
  })

  return user
}

/**
 * Sign out the current user.
 */
export const logout = () => signOut(auth)

/**
 * Promise wrapper to wait for the initial auth state.
 */
export const waitForAuth = () =>
  new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub()
      resolve(user)
    })
  })

