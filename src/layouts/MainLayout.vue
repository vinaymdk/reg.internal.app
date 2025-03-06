<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-secondary text-white shadow-2">
        <!-- <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        /> -->

        <q-toolbar-title align="center">
          Chirala SRO Internal Application
        </q-toolbar-title>

        <div><q-btn round icon="logout" @click="logout" color="secondary" /></div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-separator inset />

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
  </q-layout>
</template>

<style scoped>
.q-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import signOut from 'src/firebase/firebase-signout.js'
// import getAuth from 'src/firebase/firebase-signout.js'

// const auth = getAuth();
const loading = ref(false);
const router = useRouter()

const logout = async () => {
  loading.value = true;
  // signOut(auth).then(() => {
  signOut().then(() => {
    // debugger
     router.push('/');
  }).catch(err => {
   console.log(err)
  });
}

</script>

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
