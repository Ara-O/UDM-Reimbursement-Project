<template>
  <section class="login-page">
    <!-- Img is a way you can embed images to your site,
      the ../ before the folder means that we are traversing file systems -->
    <div class="udmercy-logo-wrapper">
      <img src="../assets/detroit-mercy-logo.png" alt="Detroit mercy logo" class="udmercy-logo" />
    </div>
    <br />
    <h3 class="login-title">Detroit Mercy Reimbursement System</h3>
    <br />
    <Form @submit="resetPassword" class="login-form">
      <div class="login-field">
        <label for="new-password">New Password: </label>
        <span style="width: auto">
          <Field type="password" class="login-password-input" name="new-password" v-model="password" id="new-password"
            :rules="isNotEmpty" style="width: auto; margin-left: 0px" />
          <ErrorMessage as="h3" name="new-password" class="error-field" />
          <img v-if="passwordFieldType === 'password'" class="hover:!opacity-100" src="../assets/eye.png"
            @click="togglePasswordVisibility"
            style="position: absolute; right: 20px; top: 28%; transform: translateY(-50%); cursor: pointer; width: 20px; opacity: 25%; hover-opacity: 100%" />
          <img v-else class="hover:!opacity-100" src="../assets/eyeslash.png" @click="togglePasswordVisibility"
            style="position: absolute; right: 20px; top: 28%; transform: translateY(-50%); cursor: pointer; width: 20px; opacity: 25%" />
        </span>
      </div>
      <div class="login-field" style="margin-bottom: 20px">
        <label for="confirm-password" style="max-width: 150px; width: auto">Confirm New Password:</label>
        <span style="width: auto">
          <Field v-model="confirmPassword" type="password" class="login-password-input" name="confirm-password"
            style="width: auto; margin-left: 0px" :rules="isNotEmpty" id="confirm-password " />
          <ErrorMessage as="h3" name="confirm-password" class="error-field" />
          <img v-if="passwordFieldType === 'password'" class="hover:!opacity-100" src="../assets/eye.png"
            @click="togglePasswordVisibility"
            style="position: absolute; right: 20px; top: 28%; transform: translateY(-50%); cursor: pointer; width: 20px; opacity: 25%; hover-opacity: 100%" />
          <img v-else class="hover:!opacity-100" src="../assets/eyeslash.png" @click="togglePasswordVisibility"
            style="position: absolute; right: 20px; top: 28%; transform: translateY(-50%); cursor: pointer; width: 20px; opacity: 25%" />
        </span>
      </div>
      <span style="display: flex; align-items: center; margin-top: -20px; gap: 10px">
        <router-link to="/signup" style="font-size: 14px">Create an Account</router-link>
        <h3 style="font-weight: 300">|</h3>
        <router-link to="/" style="font-size: 14px">Log In</router-link>
      </span>
      <button class="login-button" style="width: auto">Change Password</button>
    </Form>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { Form, Field, ErrorMessage } from "vee-validate";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { isNotEmpty } from "../utils/validators";

let password = ref<string>("");
let confirmPassword = ref<string>("");
const route = useRoute();
const router = useRouter();
let userToken = ref<string>("");

const passwordFieldType = ref<string>('password');

function togglePasswordVisibility() {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
}
function resetPassword() {
  if (password.value === confirmPassword.value) {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/resetPassword`,
        {
          token: userToken.value,
          newPassword: password.value,
        }
      )
      .then((res) => {
        // console.log(res);
        alert(res.data.message);
      })
      .catch((err) => {
        if (err) {
          alert("Token has expired");
        }
      })
      .finally(() => {
        router.push("/");
      });
  } else {
    alert("Passwords do not match");
  }
}

onMounted(() => {
  if (route.params.userToken === null) {
    router.push("/");
  } else {
    userToken.value = route.params.userToken as string;
  }
});
</script>

<style scoped>
@import url("../assets/styles/login-page.css");

.error-field {
  font-weight: 400;
  margin-top: 4px;
}
</style>
