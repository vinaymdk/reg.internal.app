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
                Enter your details to get started!
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
                      Registration Form
                    </div>
                  </div>
                </div>

                <q-form ref="form" class="q-gutter-md" @submit="submit">
                  <q-input
                    v-model="user.first_name"
                    label="First Name"
                    name="First Name"
                  />
                  <q-input
                    v-model="user.last_name"
                    label="Last Name"
                    name="Last Name"
                  />
                  <q-input v-model="user.email" label="Email" name="Email" />
                  <q-input
                    v-model="user.password"
                    label="Password"
                    name="password"
                    type="password"
                  />

                  <div>
                    <q-btn
                      class="full-width fredoka"
                      color="primary"
                      label="Create User"
                      rounded
                      type="submit"
                    ></q-btn>
                    <!-- <q-btn class="full-width fredoka" label="Create User" color="primary" @click="signUpUser" /> -->

                    <div class="q-mt-lg">
                      <div class="q-mt-sm">
                        Already have an account?
                        <router-link class="text-primary" to="/login"
                          >Login</router-link
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { registerWithEmail } from 'src/firebase'

const router = useRouter()

const user = reactive({
  last_name: null,
  first_name: null,
  email: null,
  password: null,
})

const form = ref(null)

const submit = async () => {
  if (form.value.validate()) {
    try {
      console.log('Registering user...')
      const result = await registerWithEmail(user)
      console.log('User registered successfully:', result)

      // Reset form after successful registration
      form.value.reset()

      // Redirect to login page
      router.push('/login')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }
}
</script>
