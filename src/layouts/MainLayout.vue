<!-- <script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from 'src/firebase/index.js'
import { getIdTokenResult } from 'firebase/auth'
import signOut from 'src/firebase/firebase-signout.js'

const loading = ref(false)
const router = useRouter()
const currentUser = ref(null)
const userRole = ref(null)

// Get authorized user information when component mounts
onMounted(async () => {
  try {
    const user = auth.currentUser
    
    if (user) {
      // Store user information
      currentUser.value = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      }
      
      console.log('Authenticated User:', currentUser.value)
      
      // Get user role/claims from ID token
      const idTokenResult = await getIdTokenResult(user)

      userRole.value = {
        admin: !!idTokenResult?.claims?.admin,
        role: idTokenResult?.claims?.role || 'user',
        customClaims: idTokenResult?.claims
      }
      
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
</script> -->

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

            <q-item v-if="userRole?.admin" clickable v-close-popup @click="navigateTo('/admin/reports')">
              <q-item-section avatar>
                <q-icon name="assessment" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Reports</q-item-label>
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

            <a href="#"><q-tab name="contact" label="Contact: 96427 84240" /></a>
          </q-tabs>
      </q-toolbar>
    </q-footer>

    <q-separator inset />

  </q-layout>
</template>

<style scoped>
.q-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
<style type="text/css">
  .logo-styl {
    width: 180px;
    padding: 8px
  }
  .foot-about-content {
    font-weight: 200;
    padding: 15px
  }
  .line-height {
    line-height: 1.4
  }
  a {
    color: white;
    text-decoration: none
  }
  a:hover {
    color: blue;
  }
  @media only screen and (min-width: 960px) {
      /* styles for browsers larger than 960px; */
  }
  @media only screen and (min-width: 1440px) {
      /* styles for browsers larger than 1440px; */
  }
  @media only screen and (min-width: 2000px) {
      /* for sumo sized (mac) screens */
  }
  @media only screen and (max-device-width: 480px) {
     /* styles for mobile browsers smaller than 480px; (iPhone) */
  }
  @media only screen and (device-width: 768px) {
     /* default iPad screens */
  }
  /* different techniques for iPad screening */
  @media only screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait) {
    /* For portrait layouts only */
  }

  @media only screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:landscape) {
    /* For landscape layouts only */
  }
</style>