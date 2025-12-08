import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { getDownloadURL, ref as storageRef, uploadBytes, deleteObject } from 'firebase/storage'
import { db, storage } from './firebase.js'

// Collections
const clientsCol = collection(db, 'clients')
const documentsCol = collection(db, 'documents')

// Clients CRUD
export const createClient = async ({ name, phone, address }) => {
  const docRef = await addDoc(clientsCol, {
    name,
    phone,
    address,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  const snap = await getDoc(docRef)
  return { id: docRef.id, ...snap.data() }
}

export const listClients = async () => {
  const q = query(clientsCol, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export const getClientById = async (id) => {
  const snap = await getDoc(doc(clientsCol, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export const updateClient = (id, data) =>
  updateDoc(doc(clientsCol, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })

export const deleteClient = (id, { soft = false } = {}) => {
  if (soft) {
    return updateDoc(doc(clientsCol, id), {
      deleted: true,
      deletedAt: serverTimestamp(),
    })
  }
  return deleteDoc(doc(clientsCol, id))
}

// Client Documents CRUD (attached to clients)
export const listClientDocuments = async (clientId) => {
  const q = query(documentsCol, where('clientId', '==', clientId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export const addClientDocument = async (clientId, payload) => {
  const { file, ...rest } = payload
  let fileUrl = ''
  let fileName = ''

  if (file) {
    fileName = `${Date.now()}_${file.name}`
    const ref = storageRef(storage, `documents/${clientId}/${fileName}`)
    await uploadBytes(ref, file)
    fileUrl = await getDownloadURL(ref)
  }

  const docRef = await addDoc(documentsCol, {
    clientId,
    ...rest,
    fileUrl,
    fileName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  const snap = await getDoc(docRef)
  return { id: docRef.id, ...snap.data() }
}

export const updateClientDocument = (id, data) =>
  updateDoc(doc(documentsCol, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })

export const deleteClientDocument = async (id, { soft = false, deleteFile = false } = {}) => {
  const docRef = doc(documentsCol, id)
  const snap = await getDoc(docRef)
  const existing = snap.exists() ? snap.data() : null

  if (soft) {
    return updateDoc(docRef, {
      deleted: true,
      deletedAt: serverTimestamp(),
    })
  }

  if (deleteFile && existing?.fileUrl && existing?.fileName && existing?.clientId) {
    const ref = storageRef(storage, `documents/${existing.clientId}/${existing.fileName}`)
    await deleteObject(ref).catch(() => {})
  }

  return deleteDoc(docRef)
}

