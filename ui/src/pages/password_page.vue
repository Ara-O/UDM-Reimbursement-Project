<template>
  <section class="signup-page">
    <section class="left-section">
      <div class="udmercy-logo-wrapper">
        <img
          src="../assets/detroit-mercy-logo.png"
          alt="Detroit mercy logo"
          class="udmercy-logo"
        />
      </div>
    </section>
    <section class="right-section">
      <div class="udmercy-logo-wrapper-mobile">
        <img
          src="../assets/detroit-mercy-logo.png"
          alt="Detroit mercy logo"
          class="udmercy-logo-mobile"
        />
      </div>
      <h3 class="signup-title">Detroit Mercy Reimbursement System</h3>
      <h3 class="signup-title-description" v-if="surveyProgress === 0">
        Change Password
      </h3>

      <section class="signup-form">
        <section v-show="surveyProgress === 0" class="signup-form">
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="password">Current Password: </label>
              <input
                type="password"
                name="Password"
                id="password"
                v-model="currentPassword"
              />
            </div>
            <div class="input-field">
              <label for="new-password">New password: </label>
              <input
                type="password"
                name="new-password"
                id="new-password"
                v-model="newPassword"
              />
            </div>
            <div class="input-field">
              <label for="reenter-password">Re-enter new password: </label>
              <input
                type="password"
                name="reenter-password"
                id="reenter-password"
                v-model="reEnteredPassword"
              />
            </div>
          </div>
          <div class="continue-buttons">
            <router-link to="/dashboard" custom v-slot="{ navigate }">
              <button
                class="signup-button"
                type="button"
                @click="navigate"
                role="link"
                style="margin-top: 0px"
              >
                Go To Dashboard
              </button>
            </router-link>
            <button
              class="signup-button"
              type="button"
              style="margin-top: 0px"
              @click="changePassword"
            >
              Update
            </button>
          </div>
        </section>
      </section>
    </section>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

let reEnteredPassword = ref<string>("");
let currentPassword = ref<string>("");
let surveyProgress = ref<number>(0);

const router = useRouter();

let newPassword = ref<string>("");

function changePassword() {
  if (reEnteredPassword.value !== newPassword.value) {
    alert("Passwords do not match, please try again");
  } else if (newPassword.value === currentPassword.value) {
    alert("New password can not match current password, please try again");
  } else {
    axios
      .post("http://localhost:8080/api/changePassword", {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      })
      .then((res) => {
        alert(res.data.message);
        router.push("/dashboard");
      })
      .catch((err) => {
        alert(err.response.data.message);
        console.log(err);
      });
  }
}
</script>

<style scoped>
@import url("../assets/styles/signup-page.css");
</style>
