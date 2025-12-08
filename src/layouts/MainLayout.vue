<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, getUserRole, logout as firebaseLogout, db } from 'src/firebase'
import { doc, getDoc } from 'firebase/firestore'
const loading = ref(false)
const router = useRouter()
const currentUser = ref(null)
const userRole = ref(null)
const showDialog = ref(false) // { changed code }
const tab = ref('')

// Get authorized user information and verify role from Firestore
onMounted(async () => {
  try {
    const user = auth.currentUser

    if (user) {
      // Store user information from Auth
      currentUser.value = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      }

      console.log('Authenticated User:', currentUser.value)

      // Fetch user role from Firestore 'users' collection
      const role = await getUserRole(user.uid)
      const userDocRef = doc(db, 'users', user.uid)
      const userDocSnapshot = await getDoc(userDocRef)
      const userData = userDocSnapshot.exists() ? userDocSnapshot.data() : null

      userRole.value = {
        admin: role === 'admin',
        role: role || 'user',
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        createdAt: userData?.createdAt,
      }

      console.log('User Data from Firestore:', userData)
      console.log('User Role:', userRole.value)
    } else {
      console.log('No authenticated user found')
      router.push('/')
    }
  } catch (err) {
    console.error('Error fetching user information:', err)
    router.push('/')
  }
})

const handleLogout = async () => {
  loading.value = true
  try {
    await firebaseLogout()
    currentUser.value = null
    userRole.value = null
    router.push('/')
  } catch (err) {
    console.error('Logout error:', err)
  } finally {
    loading.value = false
  }
}

const navigateTo = (path) => {
  router.push(path)
}

// { changed code }
const showContactPopup = () => {
  showDialog.value = true
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-header elevated>
      <q-toolbar class="bg-secondary text-white shadow-2">
        <q-toolbar-title align="left">
          Chirala SRO Internal Application
        </q-toolbar-title> -->

    <!-- Display current user email -->
    <!-- <div class="q-mr-md">
          <span v-if="currentUser" class="text-white">{{ currentUser.email }}</span>
        </div>

        <div><q-btn round icon="logout" @click="handleLogout" color="secondary" /></div>
      </q-toolbar>
    </q-header> -->

    <q-header elevated>
      <q-toolbar class="bg-secondary text-white shadow-2">
        <q-toolbar-title align="left"> Chirala SRO Internal Application </q-toolbar-title>

        <!-- Home button (added before Dashboard) -->
        <q-btn
          flat
          class="q-mr-md text-white"
          icon="home"
          label="Home"
          @click="navigateTo('/home')"
          v-if="currentUser"
        />

        <!-- Dashboard Menu -->
        <q-btn-dropdown
          unelevated
          no-icon-animation
          rounded
          color="secondary"
          label="Dashboard"
          class="q-mr-lg"
          v-if="userRole?.admin"
        >
          <q-list style="min-width: 200px">
            <!-- <q-item clickable v-close-popup @click="navigateTo('/home')">
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Home</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="navigateTo('/dashboard/profile')">
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Profile</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="navigateTo('/dashboard/settings')">
              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Settings</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator /> -->

            <!-- Admin only menu items -->
            <q-item
              v-if="userRole?.admin"
              clickable
              v-close-popup
              @click="navigateTo('/admin/users')"
            >
              <q-item-section avatar>
                <q-icon name="people" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Manage Users</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              v-if="userRole?.admin"
              clickable
              v-close-popup
              @click="navigateTo('/admin/clientreports')"
            >
              <q-item-section avatar>
                <q-icon name="assessment" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Clients Reports</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- Display current user email -->
        <div class="q-mr-md">
          <span v-if="currentUser" class="text-white">{{ currentUser.email }}</span>
        </div>

        <div><q-btn round icon="logout" @click="handleLogout" color="secondary" /></div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white footer-distributed content-spacing">
      <q-toolbar>
        <q-tabs v-model="tab" class="text-teal">
          <a href="http://registration.ap.gov.in/" target="_blank"
            ><q-tab name="igrs_ofc" label="IGRS - Official"
          /></a>
          <a href="http://meebhoomi.ap.gov.in/" target="_blank"
            ><q-tab name="meebhoomi" label="Meebhoomi"
          /></a>
          <a href="https://cardprimme.rs.ap.gov.in/PDE" target="_blank"
            ><q-tab name="prime_2" label="Prime 2.0"
          /></a>
          <a
            href="https://prdcfms.apcfss.in:44300/sap/bc/ui5_ui5/sap/zfi_rcp_challan/index.html?sap-client=350"
            target="_blank"
            ><q-tab name="prdcfms" label="CFMS Challan"
          /></a>
          <!-- Contact button with popup -->
          <a href="#"><q-btn flat label="Contact" @click="showContactPopup" /></a>
        </q-tabs>
      </q-toolbar>
    </q-footer>

    <q-separator inset />

    <!-- { changed code } Contact Dialog -->
    <q-dialog v-model="showDialog" position="standard">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Contact Information</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-gutter-md">
            <div class="row">
              <strong class="col-3">Name:</strong>
              <span class="col-9">Vinay Kumar Medikonda</span>
            </div>
            <div class="row">
              <strong class="col-3">Address:</strong>
              <span class="col-9">Chirala</span>
            </div>
            <div class="row">
              <strong class="col-3">Phone:</strong>
              <span class="col-9">+91 9642784240</span>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<style scoped>
.q-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}

a {
  color: white;
  text-decoration: none;
}

a:hover {
  color: blue;
}
</style>

<style type="text/css">
.logo-styl {
  width: 180px;
  padding: 8px;
}
.foot-about-content {
  font-weight: 200;
  padding: 15px;
}
.line-height {
  line-height: 1.4;
}
</style>
