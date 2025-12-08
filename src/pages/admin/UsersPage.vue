<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col">
            <div class="text-h6">User Management</div>
            <div class="text-subtitle2">Create new user (left) · Existing users (right)</div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-gutter-md" style="flex-wrap: nowrap">
          <!-- Left: New user registration -->
          <div class="col-12 col-md-4">
            <q-card flat bordered class="q-pa-sm">
              <div class="text-subtitle1 q-mb-md">Register New User</div>

              <q-form @submit.prevent="onCreateUser" ref="formRef">
                <q-input
                  v-model="newUser.first_name"
                  label="First name"
                  dense
                  outlined
                  required
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'First name is required']"
                />
                <q-input
                  v-model="newUser.last_name"
                  label="Last name"
                  dense
                  outlined
                  class="q-mt-sm"
                  required
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Last name is required']"
                />
                <q-input
                  v-model="newUser.email"
                  label="Email"
                  dense
                  outlined
                  class="q-mt-sm"
                  required
                  type="email"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Email is required',
                    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Invalid email format',
                  ]"
                />
                <!-- { changed code } Password field with hide/show toggle -->
                <q-input
                  v-model="newUser.password"
                  label="Password"
                  dense
                  outlined
                  class="q-mt-sm"
                  required
                  :type="showPassword ? 'text' : 'password'"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Password is required',
                    (val) => (val && val.length >= 6) || 'Password must be at least 6 characters',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="showPassword ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>

                <div class="row q-mt-md">
                  <div class="col">
                    <q-btn label="Create" color="primary" type="submit" :loading="loading" />
                    <q-btn flat label="Reset" class="q-ml-sm" @click="resetForm" />
                  </div>
                </div>
              </q-form>
            </q-card>
          </div>

          <!-- Right: Users table -->
          <div class="col-12 col-md-8">
            <q-card flat bordered class="q-pa-sm">
              <q-table
                class="users-table"
                :rows="users"
                :columns="columns"
                row-key="uid"
                flat
                bordered
                :dense="false"
                virtual-scroll
              >
                <template v-slot:no-data>
                  <div class="text-center q-pa-md">No users found.</div>
                </template>

                <template v-slot:body-cell-displayName="props">
                  <q-td :props="props">
                    <div class="row items-center no-wrap">
                      <q-avatar size="40" class="bg-primary text-white q-mr-sm">
                        {{ initials(props.row) }}
                      </q-avatar>
                      <div class="user-name">
                        <div class="name-main">
                          {{
                            props.row.displayName ||
                            [props.row.firstName, props.row.lastName].filter(Boolean).join(' ') ||
                            '-'
                          }}
                        </div>
                        <div class="text-subtitle2 text-ellipsis email-sm">
                          {{ props.row.email || '-' }}
                        </div>
                      </div>
                    </div>
                  </q-td>
                </template>

                <template v-slot:body-cell-createdAt="props">
                  <q-td :props="props">
                    {{ formatDate(props.row.createdAt) }}
                  </q-td>
                </template>

                <template v-slot:body-cell-role="props">
                  <q-td :props="props" class="text-center">
                    <q-chip
                      dense
                      :color="props.row.role === 'admin' ? 'accent' : 'grey-6'"
                      text-color="white"
                      outline
                      class="role-chip"
                    >
                      {{ props.row.role || 'user' }}
                    </q-chip>
                  </q-td>
                </template>

                <template v-slot:body-cell-actions="props">
                  <q-td :props="props" class="text-center">
                    <q-btn
                      flat
                      dense
                      round
                      icon="edit"
                      color="primary"
                      @click.stop="openEditUser(props.row)"
                      aria-label="Edit user"
                    />
                    <q-btn
                      flat
                      dense
                      round
                      icon="delete"
                      color="negative"
                      class="q-ml-xs"
                      @click.stop="deleteUser(props.row)"
                      aria-label="Delete user"
                    />
                  </q-td>
                </template>
              </q-table>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>

  <q-dialog v-model="showEditDialog" position="standard">
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Edit User</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="saveEditUser">
          <q-input
            v-model="editingUser.firstName"
            label="First name"
            dense
            outlined
            class="q-mb-sm"
          />
          <q-input
            v-model="editingUser.lastName"
            label="Last name"
            dense
            outlined
            class="q-mb-sm"
          />
          <q-select
            v-model="editingUser.role"
            :options="['user', 'admin']"
            label="Role"
            dense
            outlined
            class="q-mb-md"
          />
          <div class="row q-gutter-sm">
            <q-btn label="Save" color="primary" type="submit" :loading="loading" />
            <q-btn flat label="Cancel" v-close-popup />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { Loading, Notify } from 'quasar'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const db = getFirestore()
const auth = getAuth()

const users = ref([])
const isAdmin = ref(false)
const loading = ref(false)
const formRef = ref(null)
const adminUser = ref(null)
const showPassword = ref(false) // { changed code } - Show/hide password state
const showEditDialog = ref(false)
const editingUser = ref({
  uid: '',
  firstName: '',
  lastName: '',
  role: 'user',
})

const newUser = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
})

const columns = [
  { name: 'displayName', label: 'Name', field: 'displayName', sortable: true, align: 'left' },
  {
    name: 'role',
    label: 'Role',
    field: 'role',
    sortable: true,
    align: 'center',
    style: 'width: 120px',
  },
  { name: 'uid', label: 'UID', field: 'uid', align: 'center', style: 'width: 200px' },
  {
    name: 'createdAt',
    label: 'Created At',
    field: 'createdAt',
    align: 'center',
    style: 'width: 180px',
  },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center', style: 'width: 140px' },
]

const formatDate = (ts) => {
  if (!ts) return ''
  if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleString()
  if (ts.toDate) return ts.toDate().toLocaleString()
  return new Date(ts).toLocaleString()
}

const fetchUsers = async () => {
  Loading.show()
  try {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    users.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error('Failed to fetch users:', err)
    Notify.create({ type: 'negative', message: err?.message || 'Failed to load users' })
  } finally {
    Loading.hide()
  }
}

const checkAndLoad = async (firebaseUser) => {
  if (!firebaseUser) {
    Notify.create({ type: 'warning', message: 'Not authenticated' })
    return
  }

  Loading.show()
  try {
    const userDocRef = doc(db, 'users', firebaseUser.uid)
    const userSnap = await getDoc(userDocRef)

    if (!userSnap.exists()) {
      Notify.create({
        type: 'negative',
        message: 'User document not found. Contact admin or re-register.',
      })
      return
    }

    const data = userSnap.data()
    isAdmin.value = data?.role === 'admin'

    if (!isAdmin.value) {
      Notify.create({ type: 'negative', message: 'Access denied. Admins only.' })
      return
    }

    adminUser.value = firebaseUser
    await fetchUsers()
  } catch (err) {
    console.error('Error checking role or fetching users:', err)
    const msg =
      err?.message ||
      'Failed to verify role / load users. Check Firestore rules and ensure your user doc has role: "admin".'
    Notify.create({ type: 'negative', message: msg })
  } finally {
    Loading.hide()
  }
}

onMounted(() => {
  const unsubscribe = onAuthStateChanged(auth, (u) => {
    unsubscribe()
    checkAndLoad(u)
  })
})

const initials = (row) => {
  const name = row?.displayName || [row?.firstName, row?.lastName].filter(Boolean).join(' ')
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const onCreateUser = async () => {
  if (!formRef.value) return

  const isValid = await formRef.value.validate()
  if (!isValid) {
    Notify.create({ type: 'negative', message: 'Please fill in all required fields correctly.' })
    return
  }

  loading.value = true
  Loading.show()
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      newUser.value.email,
      newUser.value.password,
    )
    const newFirebaseUser = userCredential.user

    await setDoc(doc(db, 'users', newFirebaseUser.uid), {
      uid: newFirebaseUser.uid,
      firstName: newUser.value.first_name || null,
      lastName: newUser.value.last_name || null,
      email: newFirebaseUser.email,
      displayName: `${newUser.value.first_name} ${newUser.value.last_name}`.trim(),
      role: 'user',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      emailVerified: newFirebaseUser.emailVerified || false,
    })

    if (adminUser.value) {
      await auth.updateCurrentUser(adminUser.value)
    }

    Notify.create({
      type: 'positive',
      message: `User ${newUser.value.email} created successfully.`,
    })

    resetForm()
    await fetchUsers()
  } catch (err) {
    console.error('Failed to create user:', err)
    Notify.create({ type: 'negative', message: err?.message || 'Failed to create user' })

    if (adminUser.value) {
      await auth.updateCurrentUser(adminUser.value)
    }
  } finally {
    loading.value = false
    Loading.hide()
  }
}

const resetForm = () => {
  newUser.value = { first_name: '', last_name: '', email: '', password: '' }
  showPassword.value = false // { changed code } - Reset password visibility
  formRef.value?.resetValidation?.()
}

const openEditUser = (row) => {
  editingUser.value = {
    uid: row.uid,
    firstName: row.firstName || '',
    lastName: row.lastName || '',
    role: row.role || 'user',
  }
  showEditDialog.value = true
}

const saveEditUser = async () => {
  if (!editingUser.value.uid) return
  loading.value = true
  Loading.show()
  try {
    await updateDoc(doc(db, 'users', editingUser.value.uid), {
      firstName: editingUser.value.firstName || null,
      lastName: editingUser.value.lastName || null,
      displayName: `${editingUser.value.firstName} ${editingUser.value.lastName}`.trim(),
      role: editingUser.value.role || 'user',
      updatedAt: serverTimestamp(),
    })
    Notify.create({ type: 'positive', message: 'User updated' })
    showEditDialog.value = false
    await fetchUsers()
  } catch (err) {
    console.error('Failed to update user:', err)
    Notify.create({ type: 'negative', message: err?.message || 'Failed to update user' })
  } finally {
    loading.value = false
    Loading.hide()
  }
}

const deleteUser = async (row) => {
  if (!row?.uid) return
  loading.value = true
  Loading.show()
  try {
    await deleteDoc(doc(db, 'users', row.uid))
    Notify.create({ type: 'positive', message: 'User deleted' })
    await fetchUsers()
  } catch (err) {
    console.error('Failed to delete user:', err)
    Notify.create({ type: 'negative', message: err?.message || 'Failed to delete user' })
  } finally {
    loading.value = false
    Loading.hide()
  }
}
</script>

<style scoped>
/* Table container tweaks */
.users-table {
  --q-table-row-padding: 10px;
  --q-table-header-bg: #f5f7fb;
}

/* header styles with center alignment */
.users-table .q-table__top,
.users-table .q-table__middle thead th {
  background: var(--q-table-header-bg);
  color: #222;
  font-weight: 700;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  text-align: center;
}

/* zebra rows */
.users-table .q-tr:nth-child(odd) {
  background: #ffffff;
}
.users-table .q-tr:nth-child(even) {
  background: #fbfcfe;
}

/* hover highlight */
.users-table .q-tr:hover {
  background: #eef6ff !important;
  transform: translateZ(0);
}

/* cell padding and ellipsis */
.users-table .q-td {
  padding: 12px 12px;
  vertical-align: middle;
  white-space: nowrap;
}

/* name column layout */
.user-name {
  display: flex;
  flex-direction: column;
  min-width: 160px;
}
.user-name .name-main {
  font-weight: 600;
  color: #223;
}
.email-sm {
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 420px;
}

/* avatar style */
.users-table .q-avatar {
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.06);
  font-weight: 700;
}

/* role chip with centered text */
.role-chip {
  text-transform: capitalize;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

/* responsive: allow table scroll on small widths */
@media (max-width: 900px) {
  .users-table {
    overflow-x: auto;
  }
  .users-table .q-td {
    white-space: normal;
  }
  .email-sm {
    display: none;
  }
}
</style>
