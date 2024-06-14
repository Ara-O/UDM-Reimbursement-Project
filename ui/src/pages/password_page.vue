<template>
  <section class="signup-page">
    <section class="left-section">
      <div class="udmercy-logo-wrapper">
        <img src="../assets/detroit-mercy-logo.png" alt="Detroit mercy logo" class="udmercy-logo"
          @click="$router.push('/dashboard')" />
      </div>
    </section>
    <section class="right-section">
      <div class="udmercy-logo-wrapper-mobile">
        <img src="../assets/detroit-mercy-logo.png" alt="Detroit mercy logo" class="udmercy-logo-mobile" />
      </div>
      <h3 class="signup-title">Detroit Mercy Reimbursement System</h3>
      <h3 class="signup-title-description" v-if="surveyProgress === 0">
        Change Password
      </h3>

      <section class="signup-form">
        <section v-show="surveyProgress === 0" class="signup-form">
          <div class="input-field-wrapper">
            <!-- CURRENT PASSWORD -->
            <div class="input-field">
              <label for="password">Current Password: </label>
              <span style="position: relative">
                <input :type="passwordFieldType" name="Password" id="password" v-model="currentPassword" />
                <img v-if="passwordFieldType === 'password'" class="hover:!opacity-100" src="../assets/eye.png"
                  @click="togglePasswordVisibility"
                  style="position: absolute; right: 20px; top: 28%; transform: translateY(-50%); cursor: pointer; width: 20px; opacity: 25%; hover-opacity: 100%" />
                <img v-else class="hover:!opacity-100" src="../assets/eyeslash.png" @click="togglePasswordVisibility"
                  style="position: absolute; right: 20px; top: 28%; transform: translateY(-50%); cursor: pointer; width: 20px; opacity: 25%" />
              </span>
            </div>
            <!-- NEW PASSWORD -->
            <div class="input-field-wrapper">
              <div class="input-field">
                <label for="new-password">New password: </label>
                <span style="position: relative">
                  <input :type="passwordFieldType2" name="new-password" id="new-password" v-model="newPassword" />
                  <img v-if="passwordFieldType2 === 'password'" class="hover:!opacity-100" src="../assets/eye.png"
                    @click="togglePasswordVisibility2"
                    style="position: absolute; right: 20px; top: 28%; transform: translateY(-50%); cursor: pointer; width: 20px; opacity: 25%; hover-opacity: 100%" />
                  <img v-else class="hover:!opacity-100" src="../assets/eyeslash.png" @click="togglePasswordVisibility2"
                    style="position: absolute; right: 20px; top: 28%; transform: translateY(-50%); cursor: pointer; width: 20px; opacity: 25%" />
                </span>
              </div>
              <!-- RE-ENTER NEW PASSWORD -->
              <div class="input-field">
                <label for="reenter-password">Re-enter new password: </label>
                <span style="position: relative">
                  <input :type="passwordFieldType3" name="reenter-password" id="reenter-password" v-model="reEnteredPassword" />
                  <img v-if="passwordFieldType3 === 'password'" class="hover:!opacity-100" src="../assets/eye.png"
                    @click="togglePasswordVisibility3"
                    style="position: absolute; right: 20px; top: 28%; transform: translateY(-50%); cursor: pointer; width: 20px; opacity: 25%; hover-opacity: 100%" />
                  <img v-else class="hover:!opacity-100" src="../assets/eyeslash.png" @click="togglePasswordVisibility3"
                    style="position: absolute; right: 20px; top: 28%; transform: translateY(-50%); cursor: pointer; width: 20px; opacity: 25%" />
                </span>
              </div>
            </div>
          </div>
          <div class="continue-buttons">
            <router-link to="/dashboard">
              <button class="signup-button" type="button" role="link" style="margin-top: 0px">
                Go To Dashboard
              </button>
            </router-link>
            <button class="signup-button" type="button" style="margin-top: 0px" @click="changePassword">
              Update
            </button>
          </div>
        </section>
        <h3 style="font-weight: 400; font-size: 14px; margin-top: 25px">
          {{ feedback }}
        </h3>
      </section>
    </section>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

let enterDefault = ref<string>("");
let feedback = ref<string>("");
let reEnteredPassword = ref<string>("");
let currentPassword = ref<string>("");
let surveyProgress = ref<number>(0);

const router = useRouter();

let newPassword = ref<string>("");

const passwordFieldType = ref<string>('password');
const passwordFieldType2 = ref<string>('password');
const passwordFieldType3 = ref<string>('password');

function togglePasswordVisibility() {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
}
function togglePasswordVisibility2() {
  passwordFieldType2.value = passwordFieldType2.value === 'password' ? 'text' : 'password';
}
function togglePasswordVisibility3() {
  passwordFieldType3.value = passwordFieldType3.value === 'password' ? 'text' : 'password';
}

function changePassword() {
  if (reEnteredPassword.value !== newPassword.value) {
    feedback.value = "Passwords do not match, please try again";
  } else if (newPassword.value === currentPassword.value) {
    feedback.value =
      "New password can not match current password, please try again";
  } else {
    feedback.value = "Updating password...";
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/changePassword`,
        {
          currentPassword: currentPassword.value,
          newPassword: newPassword.value,
        }
      )
      .then((res) => {
        feedback.value = res.data.message;
        // router.push("/dashboard");
      })
      .catch((err) => {
        feedback.value = err.response.data.message;
        console.log(err);
      });
  }
}
</script>

<style scoped>
@import url("../assets/styles/signup-page.css");

label {
  margin-top: 0px !important;
  width: 130px !important;
}

.input-field-wrapper {
  gap: 32px;
}

.input-field {
  align-items: center;
}

@media (min-width: 800px) {
  .continue-buttons {
    margin-top: 45px;
  }
}
</style>
