<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
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

        <div><q-btn round icon="logout" @click="logout" color="primary" /></div>
      </q-toolbar>
    </q-header>

    <!-- <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-separator inset />
    
    <!-- <footer elevated class="bg-grey-8 text-white footer-distributed content-spacing">
      <q-toolbar>
          <div class="row footer-copyright justify-center">&copy; {{ new Date().getFullYear() }} Copyright:&nbsp;
            <a href="/">Chirala SRO</a>
          </div>
      </q-toolbar>
    </footer> -->

       <q-footer elevated class="bg-grey-8 text-white footer-distributed content-spacing">
      <q-toolbar>
          <!-- <div class="row footer-copyright">&copy; {{ new Date().getFullYear() }} Copyright:&nbsp;
            <a href="/">Chirala SRO</a>
          </div> -->
          <!-- <q-list>

            <q-item clickable>
              <div class="row footer-copyright"><a href="http://registration.ap.gov.in/" target="_blank">IGRS - Primary</a></div>
            </q-item>
            <q-item clickable>
              <div class="row footer-copyright"><a href="http://rs.ap.gov.in/" target="_blank">IGRS - Secondary</a></div>
            </q-item>
            <q-item clickable>
              <div class="row footer-copyright"><a href="http://meebhoomi.ap.gov.in/" target="_blank">Meebhoomi</a></div>
            </q-item>
                  
          </q-list> -->
          <q-tabs
            v-model="tab"
            class="text-teal"
          >
            <!-- <q-route-tab target="_blank"  @click="getSource('http://registration.ap.gov.in/')" /> -->
            <a href="http://registration.ap.gov.in/" target="_blank"><q-tab name="igrs_ofc" label="IGRS - Official" /></a>
            <a href="http://rs.ap.gov.in/" target="_blank"><q-tab name="igrs_test" label="IGRS - Testing" /></a>
            <a href="http://meebhoomi.ap.gov.in/" target="_blank"><q-tab name="meebhoomi" label="Meebhoomi" /></a>
          </q-tabs>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
// import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    // EssentialLink
    // VuePdfEmbed
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      // getSource (link) {
      //   alert(link)
      // }
      // logout() {
      //   console.log('logged out')
      // }
    }
  }
})
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
