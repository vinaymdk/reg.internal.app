// import { auth } from './index.js'
// import { signInWithEmailAndPassword } from 'firebase/auth'
// import { Loading, Notify } from 'quasar'
// const login = (data) => {
//  return new Promise((resolve, reject) => {
//   Loading.show()
//   signInWithEmailAndPassword(auth, data.email, data.password).then(userCredential => {
//    Loading.hide()
//    Notify.create({
//     type: 'positive',
//     message: 'Hi '+userCredential.user.email+' Welcome to Chirala SRO Internal applications...'
//    })
//    resolve(userCredential.user)
//   }).catch(err => {
//    Loading.hide()
//    Notify.create({
//     type: 'negative',
//     message: err.message
//    })
//    reject(err.message)
//   })
//  })
// }
// export default login
import { auth } from './index.js'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Loading, Notify } from 'quasar'

const mapAuthError = (err) => {
  switch (err?.code) {
    case 'auth/user-not-found':
      return 'No account found for this email.'
    case 'auth/wrong-password':
      return 'Incorrect password.'
    case 'auth/invalid-email':
      return 'Invalid email address.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.'
    case 'auth/user-disabled':
      return 'This user account has been disabled.'
    default:
      return err?.message || 'An unknown error occurred.'
  }
}

const login = async (data) => {
  Loading.show()
  try {
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password)
    Notify.create({
      type: 'positive',
      message: `Welcome ${userCredential.user.displayName || userCredential.user.email}!`
    })
    return userCredential.user
  } catch (err) {
    const message = mapAuthError(err)
    Notify.create({
      type: 'negative',
      message
    })
    throw err
  } finally {
    Loading.hide()
  }
}

export default login