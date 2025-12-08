import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage'
import { storage } from './firebase.js'

export { storage }

export const uploadFile = (path, file, metadata) => uploadBytes(ref(storage, path), file, metadata)

export const getFileUrl = (path) => getDownloadURL(ref(storage, path))

export const deleteFile = (path) => deleteObject(ref(storage, path))

