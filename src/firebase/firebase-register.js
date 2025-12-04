import { auth } from './index.js'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore' // { changed code }
import { Loading, Notify } from 'quasar'

const db = getFirestore()

const registerUser = async (data) => {
  Loading.show()
  try {
    // create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
    const user = userCredential.user

    // update displayName
    await updateProfile(user, {
      displayName: `${data.first_name} ${data.last_name}`.trim()
    })

    // create/overwrite a document in the "users" collection using the user's uid as the doc id
    await setDoc(doc(db, 'users', user.uid), { // { changed code }
      uid: user.uid,
      firstName: data.first_name || null,
      lastName: data.last_name || null,
      email: user.email,
      displayName: user.displayName || null,
      role: 'user', // default role
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      emailVerified: user.emailVerified || false
    })

    Notify.create({
      type: 'positive',
      message: `Welcome ${user.displayName || user.email}! Your account has been created.`
    })

    return user
  } catch (err) {
    // Better error message for permission issues
    const msg = (err?.code === 'permission-denied')
      ? 'Registration failed: insufficient Firestore permissions. Update your Firestore rules to allow users to create their own user document (users/{uid} where request.auth.uid == uid).'
      : (err?.message || 'Registration failed')

    Notify.create({
      type: 'negative',
      message: msg
    })
    throw err
  } finally {
    Loading.hide()
  }
}

export default registerUser
