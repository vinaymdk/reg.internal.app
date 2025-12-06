<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Client Management</div>
        <div class="text-subtitle2">Manage clients and their documents</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-gutter-md" style="flex-wrap: nowrap;">
          <!-- Left: Clients List -->
          <div class="col-12 col-md-6">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle1 q-mb-md">Clients</div>
              </q-card-section>

              <!-- Clients Table -->
              <q-card-section class="q-pa-none">
                <q-table
                  class="clients-table"
                  :rows="clients"
                  :columns="clientColumns"
                  row-key="id"
                  flat
                  bordered
                  :dense="false"
                >
                  <template v-slot:no-data>
                    <div class="text-center q-pa-md">No clients found.</div>
                  </template>

                  <template v-slot:body-cell-name="props">
                    <q-td :props="props">
                      <div class="row items-center no-wrap">
                        <q-avatar size="40" class="bg-primary text-white q-mr-sm">
                          {{ initials(props.row.name) }}
                        </q-avatar>
                        <div>
                          <div class="text-weight-bold">{{ props.row.name }}</div>
                          <div class="text-caption text-grey">{{ props.row.phone }}</div>
                        </div>
                      </div>
                    </q-td>
                  </template>

                  <template v-slot:body-cell-action="props">
                    <q-td :props="props" class="text-center">
                      <q-btn
                        flat
                        round
                        dense
                        icon="person"
                        size="md"
                        color="primary"
                        class="action-btn"
                        @click.stop="selectClient(props.row)"
                        aria-label="View client"
                      />
                    </q-td>
                  </template>
                </q-table>
              </q-card-section>

              <!-- Add Client Button -->
              <q-card-section class="q-pt-md">
                <q-btn
                  label="Add Client"
                  color="primary"
                  icon="add"
                  @click="showAddClientDialog = true"
                />
              </q-card-section>
            </q-card>
          </div>

          <!-- Right: Client Profile & Documents -->
          <div class="col-12 col-md-6">
            <q-card flat bordered v-if="selectedClient">
              <!-- Client Profile -->
              <q-card-section class="bg-light-blue q-pa-md">
                <div class="client-header row items-start q-gutter-md no-wrap">
                  <q-avatar size="80" class="bg-primary text-white">
                    {{ initials(selectedClient.name) }}
                  </q-avatar>

                  <div class="col">
                    <div class="client-meta row items-center justify-between">
                      <div class="client-name">
                        {{ selectedClient.name }}
                      </div>
                      <div class="text-subtitle2 client-phone-">
                        <q-icon name="phone" size="18" class="q-mr-xs" />
                        <span>{{ selectedClient.phone || '-' }}</span>
                      </div>
                    </div>

                    <div class="text-subtitle2 q-mt-sm">
                      <q-icon name="location_on" /> {{ selectedClient.address }}
                    </div>
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <!-- Documents Section -->
              <q-card-section>
                <div class="text-subtitle1 q-mb-md">Documents</div>

                <!-- Documents Table -->
                <q-table
                  class="documents-table"
                  :rows="selectedClientDocuments"
                  :columns="documentColumns"
                  row-key="id"
                  flat
                  bordered
                  :dense="false"
                >
                  <template v-slot:no-data>
                    <div class="text-center q-pa-md">No documents found.</div>
                  </template>

                  <template v-slot:body-cell-docNo="props">
                    <q-td :props="props">
                      <q-btn
                        flat
                        dense
                        color="primary"
                        :label="props.row.docNo"
                        icon="download"
                        @click="downloadDocument(props.row)"
                      />
                    </q-td>
                  </template>

                  <template v-slot:body-cell-regDate="props">
                    <q-td :props="props">
                      {{ formatDate(props.row.regDate) }}
                    </q-td>
                  </template>
                </q-table>

                <!-- Add Document Button -->
                <q-card-section class="q-pt-md q-px-none">
                  <q-btn
                    label="Add Document"
                    color="primary"
                    icon="add"
                    @click="showAddDocumentDialog = true"
                  />
                </q-card-section>
              </q-card-section>
            </q-card>

            <!-- No client selected -->
            <q-card flat bordered v-else>
              <q-card-section class="text-center q-pa-lg">
                <q-icon name="person" size="xl" color="grey-5" />
                <div class="text-subtitle2 text-grey q-mt-md">Select a client to view details</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Add Client Dialog -->
    <q-dialog v-model="showAddClientDialog" position="standard">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add New Client</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="createClient" ref="addClientForm">
            <q-input
              v-model="newClient.name"
              label="Client Name"
              dense
              outlined
              required
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Name is required']"
              class="q-mb-md"
            />
            <q-input
              v-model="newClient.phone"
              label="Phone Number"
              dense
              outlined
              required
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Phone is required']"
              class="q-mb-md"
            />
            <q-input
              v-model="newClient.address"
              label="Address"
              dense
              outlined
              type="textarea"
              required
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Address is required']"
              class="q-mb-md"
            />
            <div class="row q-gutter-sm">
              <q-btn label="Save" color="primary" type="submit" :loading="loadingClient" />
              <q-btn flat label="Cancel" v-close-popup />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Document Dialog -->
    <q-dialog v-model="showAddDocumentDialog" position="standard">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add New Document</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="createDocument" ref="addDocumentForm">
            <!-- { changed code } - Document Type select with proper binding -->
            <q-select
              v-model="newDocument.docType"
              :options="docTypeOptions"
              label="Document Type"
              dense
              outlined
              required
              clearable
              lazy-rules
              :rules="[
                val => val !== null && val !== undefined && val !== '' || 'Document type is required'
              ]"
              class="q-mb-md"
              @update:model-value="val => newDocument.docType = val"
            />
            <q-input
              v-model="newDocument.claimantName"
              label="Claimant Name"
              dense
              outlined
              required
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Claimant name is required']"
              class="q-mb-md"
            />
            <q-input
              v-model="newDocument.executantName"
              label="Executant Name"
              dense
              outlined
              required
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Executant name is required']"
              class="q-mb-md"
            />
            <q-input
              v-model="newDocument.propertyAddress"
              label="Property Address"
              dense
              outlined
              type="textarea"
              required
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Property address is required']"
              class="q-mb-md"
            />
            <!-- { changed code } - Date field validation fix -->
            <q-input
              v-model="newDocument.regDate"
              label="Date of Registration"
              dense
              outlined
              type="date"
              required
              lazy-rules
              :rules="[val => val && val !== '' || 'Registration date is required']"
              class="q-mb-md"
            />
            <!-- { changed code } - File field validation fix -->
            <q-file
              v-model="newDocument.file"
              label="Upload Document"
              dense
              outlined
              required
              accept=".pdf,.doc,.docx,.xlsx,.xls"
              lazy-rules
              :rules="[val => val !== null || 'File is required']"
              class="q-mb-md"
              @rejected="onFileRejected"
            />
            <div class="row q-gutter-sm">
              <q-btn label="Save" color="primary" type="submit" :loading="loadingDocument" />
              <q-btn flat label="Cancel" v-close-popup @click="resetDocumentForm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  getFirestore,
  collection,
  getDocs,
  query,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Loading, Notify } from 'quasar'
import { getAuth } from 'firebase/auth'

const db = getFirestore()
const storage = getStorage()

// State
const clients = ref([])
const documents = ref([])
const selectedClient = ref(null)
const showAddClientDialog = ref(false)
const showAddDocumentDialog = ref(false)
const loadingClient = ref(false)
const loadingDocument = ref(false)
const addClientForm = ref(null)
const addDocumentForm = ref(null)

// Document types dropdown list
const docTypeOptions = [
  'Conveyance',
  'Gift',
  'Gift-Other',
  'Mortgage',
  'Partition',
  'Release',
  'Sale',
  'GPA'
]

// New client form
const newClient = ref({
  name: '',
  phone: '',
  address: ''
})

// New document form
const newDocument = ref({
  docType: '',
  claimantName: '',
  executantName: '',
  propertyAddress: '',
  regDate: '',
  file: null
})

// Table columns
const clientColumns = [
  { name: 'name', label: 'Name', field: 'name', sortable: true, align: 'left' },
  { name: 'phone', label: 'Phone', field: 'phone', sortable: true, align: 'left' },
  { name: 'address', label: 'Address', field: 'address', align: 'left' },
  { name: 'action', label: 'View', align: 'center' }
]

const documentColumns = [
  { name: 'docType', label: 'Doc. Type', field: 'docType', sortable: true, align: 'left' },
  { name: 'claimantName', label: 'Cli. Name', field: 'claimantName', align: 'left' },
  { name: 'executantName', label: 'Exe. Name', field: 'executantName', align: 'left' },
  { name: 'propertyAddress', label: 'Property Address', field: 'propertyAddress', align: 'left' },
  { name: 'regDate', label: 'Date of Reg.', field: 'regDate', align: 'center' },
  { name: 'docNo', label: 'Doc. No.', field: 'docNo', align: 'center' }
]

// Computed
const selectedClientDocuments = computed(() => {
  if (!selectedClient.value) return []
  const selId = selectedClient.value.id
  return documents.value.filter(d => {
    if (!d.clientId) return false
    // handle string id or DocumentReference-like objects
    if (typeof d.clientId === 'string') return d.clientId === selId
    if (d.clientId.id) return d.clientId.id === selId
    if (d.clientId.path) return d.clientId.path.endsWith(`/${selId}`)
    return false
  })
})

// Helpers
const initials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString()
}

// Fetch clients
const fetchClients = async () => {
  Loading.show()
  try {
    const q = query(collection(db, 'clients'))
    const snap = await getDocs(q)
    clients.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error('Failed to fetch clients:', err)
    Notify.create({ type: 'negative', message: 'Failed to load clients' })
  } finally {
    Loading.hide()
  }
}

// Fetch documents
const fetchDocuments = async () => {
  Loading.show()
  try {
    const q = query(collection(db, 'documents'))
    const snap = await getDocs(q)
    documents.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error('Failed to fetch documents:', err)
    Notify.create({ type: 'negative', message: 'Failed to load documents' })
  } finally {
    Loading.hide()
  }
}

// Create client
const createClient = async () => {
  if (!addClientForm.value) return
  const isValid = await addClientForm.value.validate()
  if (!isValid) return

  loadingClient.value = true
  const auth = getAuth()
  if (!auth.currentUser) {
    Notify.create({ type: 'negative', message: 'You must be signed in to create clients' })
    loadingClient.value = false
    return
  }
  try {
    await addDoc(collection(db, 'clients'), {
      name: newClient.value.name,
      phone: newClient.value.phone,
      address: newClient.value.address,
      createdAt: serverTimestamp()
    })

    Notify.create({ type: 'positive', message: 'Client created successfully' })
    newClient.value = { name: '', phone: '', address: '' }
    showAddClientDialog.value = false
    await fetchClients()
  } catch (err) {
    console.error('Failed to create client:', err)
    Notify.create({ type: 'negative', message: 'Failed to create client' })
  } finally {
    loadingClient.value = false
  }
}

// { changed code } - Handle file rejection (remove unused parameter)
const onFileRejected = () => {
  Notify.create({
    type: 'negative',
    message: `File rejected. Allowed types: PDF, DOC, DOCX, XLSX, XLS`
  })
}

// { changed code } - Reset form function to clear all fields
const resetDocumentForm = () => {
  newDocument.value = {
    docType: '',
    claimantName: '',
    executantName: '',
    propertyAddress: '',
    regDate: '',
    file: null
  }
  if (addDocumentForm.value) {
    addDocumentForm.value.resetValidation()
  }
}

// Create document
const createDocument = async () => {
  if (!addDocumentForm.value || !selectedClient.value) return
  const isValid = await addDocumentForm.value.validate()
  if (!isValid) {
    Notify.create({ type: 'negative', message: 'Please fill all required fields' })
    return
  }

  // Guard: require client id and document type
  if (!selectedClient.value.id) {
    Notify.create({ type: 'negative', message: 'Selected client is invalid. Please re-select client.' })
    return
  }

  // { changed code } - Enhanced docType validation
  if (!newDocument.value.docType || newDocument.value.docType === '' || newDocument.value.docType === null) {
    Notify.create({ type: 'negative', message: 'Please select a document type' })
    return
  }

  loadingDocument.value = true
  Loading.show()
  const auth = getAuth()
  if (!auth.currentUser) {
    Notify.create({ type: 'negative', message: 'You must be signed in to add documents' })
    loadingDocument.value = false
    Loading.hide()
    return
  }
  try {
    let downloadURL = ''

    // Upload file to storage
    if (newDocument.value.file) {
      const fileRef = storageRef(
        storage,
        `documents/${selectedClient.value.id}/${Date.now()}_${newDocument.value.file.name}`
      )
      await uploadBytes(fileRef, newDocument.value.file)
      downloadURL = await getDownloadURL(fileRef)
    }

    // Create document record
    await addDoc(collection(db, 'documents'), {
      clientId: selectedClient.value.id,
      docType: newDocument.value.docType,
      claimantName: newDocument.value.claimantName,
      executantName: newDocument.value.executantName,
      propertyAddress: newDocument.value.propertyAddress,
      regDate: newDocument.value.regDate,
      docNo: `DOC-${Date.now()}`,
      fileUrl: downloadURL,
      fileName: newDocument.value.file?.name || '',
      createdAt: serverTimestamp()
    })

    Notify.create({ type: 'positive', message: 'Document added successfully' })
    resetDocumentForm()
    showAddDocumentDialog.value = false
    await fetchDocuments()
  } catch (err) {
    console.error('Failed to create document:', err)
    Notify.create({ type: 'negative', message: 'Failed to add document: ' + err.message })
  } finally {
    loadingDocument.value = false
    Loading.hide()
  }
}

// Select client
const selectClient = (client) => {
  selectedClient.value = client
}

// Download document
const downloadDocument = (doc) => {
  if (doc.fileUrl) {
    const link = document.createElement('a')
    link.href = doc.fileUrl
    link.download = doc.fileName || doc.docNo
    link.click()
  } else {
    Notify.create({ type: 'warning', message: 'No file available for download' })
  }
}

// Lifecycle
onMounted(() => {
  fetchClients()
  fetchDocuments()
})
</script>

<style scoped>
/* existing styles... */

.bg-light-blue {
  background: #f0f8ff;
}

/* New: client header layout and styles */
.client-header { gap: 12px; }
.client-meta { align-items: center; }
.client-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #102a43;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.client-phone {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  color: #0b69ff;
}

/* ensure avatar and meta align on narrow screens */
@media (max-width: 600px) {
  .client-header { flex-direction: column; align-items: flex-start; }
  .client-meta { width: 100%; justify-content: flex-start; gap: 8px; }
}
</style>
<!-- Seperate the script which is related to firebase only. Use ... related with firebase of client side and documents side -->