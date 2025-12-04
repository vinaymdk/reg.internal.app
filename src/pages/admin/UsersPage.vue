<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col">
            <div class="text-h6">Registered Users</div>
            <div class="text-subtitle2">List of users in the system</div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="users"
          :columns="columns"
          row-key="uid"
          flat
          bordered
          :dense="true"
        >
          <template v-slot:no-data>
            <div class="text-center q-pa-md">No users found.</div>
          </template>
          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">
              {{ formatDate(props.row.createdAt) }}
            </q-td>
          </template>
          <template v-slot:body-cell-displayName="props">
            <q-td :props="props">
              {{ props.row.displayName || [props.row.firstName, props.row.lastName].filter(Boolean).join(' ') || '-' }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore'
import { Loading, Notify } from 'quasar'

const db = getFirestore()
const users = ref([])

const columns = [
  { name: 'displayName', label: 'Name', field: 'displayName', sortable: true },
  { name: 'email', label: 'Email', field: 'email', sortable: true },
  { name: 'role', label: 'Role', field: 'role', sortable: true },
  { name: 'uid', label: 'UID', field: 'uid' },
  { name: 'createdAt', label: 'Created At', field: 'createdAt' }
]

const formatDate = (ts) => {
  if (!ts) return ''
  // Firestore serverTimestamp() is returned as { seconds, nanoseconds } or native Date
  if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleString()
  if (ts.toDate) return ts.toDate().toLocaleString()
  return new Date(ts).toLocaleString()
}

const fetchUsers = async () => {
  Loading.show()
  try {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    users.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error('Failed to fetch users:', err)
    Notify.create({ type: 'negative', message: err?.message || 'Failed to load users' })
  } finally {
    Loading.hide()
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
/* small styling adjustments if needed */
</style>