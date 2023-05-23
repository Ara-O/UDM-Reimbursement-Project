<template>
  <section class="login-page">
    <!-- Img is a way you can embed images to your site,
      the ../ before the folder means that we are traversing file systems -->
    <div class="udmercy-logo-wrapper">
      <img
        src="../assets/detroit-mercy-logo.png"
        alt="Detroit mercy logo"
        class="udmercy-logo"
      />
    </div>
    <br />
    <h3 class="login-title">Detroit Mercy Reimbursement System</h3>
    <br />
    <form @submit.prevent="resetPassword" class="login-form">
      <div class="login-field">
        <label for="new-password">New Password: </label>
        <input
          type="password"
          name="new password"
          v-model="password"
          id="new-password"
          style="width: auto; margin-left: 0px"
          required
        />

        <div class="login-field" style="margin-top: 30px; margin-bottom: 0px">
          <label for="confirm-password" style="max-width: 150px; width: auto"
            >Confirm New Password:</label
          >
          <input
            v-model="confirmPassword"
            type="password"
            name="Confirm Password"
            style="width: auto; margin-left: 0px"
            required
            id="confirm-password"
          />
        </div>
      </div>
      <span
        style="display: flex; align-items: center; margin-top: -20px; gap: 10px"
      >
        <router-link to="/signup" style="font-size: 14px"
          >Create an Account</router-link
        >
        <h3 style="font-weight: 300">|</h3>
        <router-link to="/" style="font-size: 14px">Log In</router-link>
      </span>
      <button class="login-button" style="width: auto">Change Password</button>
    </form>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

let password = ref<string>("");
let confirmPassword = ref<string>("");
const route = useRoute();
const router = useRouter();
let userToken = ref<string>("");

function resetPassword() {
  if (password.value === confirmPassword.value) {
    axios
      .post("https://reimbursement-project.onrender.com/api/resetPassword", {
        token: userToken.value,
        newPassword: password.value,
      })
      .then((res) => {
        console.log(res);
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
  console.log(route.params.userToken);
});
</script>

<style scoped>
@import url("../assets/styles/login-page.css");
</style>
