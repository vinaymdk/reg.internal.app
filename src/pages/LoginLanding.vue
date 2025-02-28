<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px; max-width: 90%;">
      <q-card-section>
        <div class="text-h6">Login</div>
        <!-- <div class="text-subtitle1">Welcome back! Please login to your account.</div> -->
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onLogin">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            :rules="[val => !!val || 'Email is required']"
            clearable
            outlined
          />
          <q-input
            v-model="password"
            label="Password"
            type="password"
            :rules="[val => !!val || 'Password is required']"
            clearable
            outlined
            class="q-mt-md"
          />
          <q-btn
            label="Login"
            type="submit"
            color="primary"
            class="q-mt-md full-width"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="center">
        <!-- <q-btn flat label="Forgot Password?" @click="onForgotPassword" /> -->
        <q-btn flat label="Sign Up" @click="onSignUp" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    onLogin() {
      if (this.email && this.password) {
        // Replace with your login logic
        console.log("Logging in with", this.email, this.password);
      } else {
        this.$q.notify({
          type: "negative",
          message: "Please fill in all fields.",
        });
      }
    },
    onForgotPassword() {
      this.$q.notify({
        type: "info",
        message: "Forgot Password clicked.",
      });
    },
    onSignUp() {
      this.$q.notify({
        type: "info",
        message: "Sign Up clicked.",
      });
    },
  },
};
</script>

<style scoped>
.q-card {
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
}
</style>
