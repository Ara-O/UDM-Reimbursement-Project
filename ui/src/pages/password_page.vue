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
              <label for="password">Password: </label>
              <input
                type="password"
                name="Password"
                id="password"
                v-model="userSignupData.password"
              />
            </div>
            <div class="input-field">
              <label for="reenter-password">Re-enter password: </label>
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
              @click="finishedPasswordSection"
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
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

type UserData = {
  password: string;
};

let reEnteredPassword = ref<string>("");
let surveyProgress = ref<number>(0);

const router = useRouter();

let userSignupData = reactive<UserData>({
  password: "",
});

function finishedPasswordSection() {
  let dataShown = ["password"];

  for (let i = 0; i < dataShown.length; i++) {
    if (userSignupData[dataShown[i]] === "") {
      console.log("password field empty");
      alert(
        `The ${dataShown[i]
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} field is empty`
      );
      break;
    }

    if (i === dataShown.length - 1) {
      if (reEnteredPassword.value !== userSignupData.password) {
        alert("Passwords do not match, please try again");
      } else {
        alert(`Password updated!`);
      }
    }
  }
}
</script>

<style scoped>
@import url("../assets/styles/signup-page.css");
</style>
