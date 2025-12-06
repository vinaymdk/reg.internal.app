<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from 'src/firebase/index.js'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import signOut from 'src/firebase/firebase-signout.js'
const loading = ref(false)
const router = useRouter()
const currentUser = ref(null)
const userRole = ref(null)
const db = getFirestore()
const showDialog = ref(false) // { changed code }


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
        emailVerified: user.emailVerified
      }
      
      console.log('Authenticated User:', currentUser.value)
      
      // Fetch user role from Firestore 'users' collection
      const userDocRef = doc(db, 'users', user.uid)
      const userDocSnapshot = await getDoc(userDocRef)
      
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data()
        userRole.value = {
          admin: userData.role === 'admin',
          role: userData.role || 'user',
          firstName: userData.firstName,
          lastName: userData.lastName,
          createdAt: userData.createdAt
        }
        
        console.log('User Data from Firestore:', userData)
        console.log('User Role:', userRole.value)
      } else {
        console.warn('User document not found in Firestore')
        userRole.value = {
          admin: false,
          role: 'user'
        }
      }
    } else {
      console.log('No authenticated user found')
      router.push('/')
    }
  } catch (err) {
    console.error('Error fetching user information:', err)
    router.push('/')
  }
})

const logout = async () => {
  loading.value = true
  try {
    await signOut()
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

        <div><q-btn round icon="logout" @click="logout" color="secondary" /></div>
      </q-toolbar>
    </q-header> -->

    <q-header elevated>
      <q-toolbar class="bg-secondary text-white shadow-2">
        <q-toolbar-title align="left">
          Chirala SRO Internal Application
        </q-toolbar-title>
        
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
            <q-item v-if="userRole?.admin" clickable v-close-popup @click="navigateTo('/admin/users')">
              <q-item-section avatar>
                <q-icon name="people" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Manage Users</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="userRole?.admin" clickable v-close-popup @click="navigateTo('/admin/clientreports')">
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

        <div><q-btn round icon="logout" @click="logout" color="secondary" /></div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

     <q-footer elevated class="bg-grey-8 text-white footer-distributed content-spacing">
      <q-toolbar>
        <q-tabs
          v-model="tab"
          class="text-teal"
        >
          <a href="http://registration.ap.gov.in/" target="_blank"><q-tab name="igrs_ofc" label="IGRS - Official" /></a>
          <a href="http://meebhoomi.ap.gov.in/" target="_blank"><q-tab name="meebhoomi" label="Meebhoomi" /></a>
          <a href="https://cardprimme.rs.ap.gov.in/PDE" target="_blank"><q-tab name="prime_2" label="Prime 2.0" /></a>
          <a href="https://prdcfms.apcfss.in:44300/sap/bc/ui5_ui5/sap/zfi_rcp_challan/index.html?sap-client=350" target="_blank"><q-tab name="prdcfms" label="CFMS Challan" /></a>
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