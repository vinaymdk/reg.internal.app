<template>
  <div class="flex flex-center">
    <q-card class="q-ma-md col-12 col-sm-10 col-md-8 col-lg-6">
      <div class="row">
        <div class="col-0 col-sm-5 bg-primary rounded-left-borders xs-hide">
          <div
            class="row full-width q-px-xl q-pb-xl full-height flex flex-center"
          >
            <div class="">
              <div
                class="text-h4 text-uppercase text-white fredoka"
                style="min-width: 220px"
              >
                Welcome!
              </div>
              <div class="text-white q-my-sm text-subtitle1">
                Please sign in to your account to get started!
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-7">
          <div class="row q-pa-sm-sm q-pa-md">
            <div class="col-12">
              <q-card-section>
                <div class="q-mb-xl">
                  <div class="flex justify-center">
                    <div
                      class="text-h4 text-uppercase q-my-none text-weight-bold text-primary fredoka"
                    >
                      Login
                    </div>
                  </div>
                </div>

                <q-form ref="form" class="q-gutter-md" @submit="submit">
                  <q-input
                    v-model="user.email"
                    label="Email"
                    name="Email"
                    :rules="[(val) => !!val || 'Email is required']"
                    clearable
                  />

                  <q-input
                    v-model="user.password"
                    label="Password"
                    name="password"
                    type="password"
                    :rules="[(val) => !!val || 'Password is required']"
                    clearable
                  />

                  <div>
                    <q-btn
                      class="full-width fredoka"
                      color="primary"
                      label="Login"
                      rounded
                      type="submit"
                    ></q-btn>

                    <div class="q-mt-lg">
                      <div class="q-mt-sm">
                        Don't have an account yet?
                        <router-link class="text-primary" to="/register"
                          >Register</router-link
                        >
                      </div>
                    </div>
                  </div>
                </q-form>
              </q-card-section>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { loginWithEmail, auth } from 'src/firebase'
import { useRouter } from 'vue-router'
import { Loading, Notify } from 'quasar'

const router = useRouter()

const user = reactive({
  email: null,
  password: null,
})

const form = ref(null)

// Check if user is already authenticated on component mount
onMounted(() => {
  const unsubscribe = auth.onAuthStateChanged((authUser) => {
    if (authUser) {
      // User is already logged in, redirect to home
      router.push('/home')
    }
    // Unsubscribe from listener after initial check
    unsubscribe()
  })
})

const submit = async () => {
  if (form.value.validate()) {
    try {
      Loading.show()
      const result = await loginWithEmail(user.email, user.password)
      Loading.hide()
      console.log('User logged in successfully:', result.email)

      // Reset form and navigate
      form.value.reset()
      router.push('/home')
    } catch (err) {
      Loading.hide()
      console.error('An error occurred:', err)
      Notify.create({
        type: 'negative',
        message: err?.message || String(err),
      })
    }
  }
}
</script>

<style scoped>
.q-card {
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
}
</style>
