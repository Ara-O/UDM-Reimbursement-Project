<template>
  <section class="login-page" v-if="section === 'login'">
    <div class="udmercy-logo-wrapper">
      <img src="../assets/detroit-mercy-logo.png" alt="Detroit mercy logo" class="udmercy-logo" />
    </div>
    <h3 class="login-title mt-10">Detroit Mercy Reimbursement System</h3>
    <Form @submit="loginUser" class="login-form mt-6">
      <div class="login-field">
        <label for="work-email">Work Email: </label>
        <span>
          <div class="work-email-input-field">
            <Field v-model="userInfo.workEmail" type="text" name="work-email" id="work-email" :rules="isValidString" />

            <h6 class="work-email-descriptor">@udmercy.edu</h6>
          </div>
          <ErrorMessage name="work-email" class="error-field" />
        </span>
      </div>
      <div class="login-field">
        <label for="password">Password:</label>
        <span>
          <Field v-model="userInfo.password" type="password" class="login-password-input" name="password"
            :rules="isNotEmpty" required id="password" />
          <ErrorMessage name="password" class="error-field" />
        </span>
      </div>
      <span style="display: flex; align-items: center; gap: 10px">
        <router-link to="/signup" class="btn-link !text-black">Create an Account</router-link>
        <h3 style="font-weight: 300">|</h3>
        <a class="btn-link !text-black" @click="section = 'forgot-password'">
          Forgot Password
        </a>
      </span>
      <button class="login-button" type="submit">Login</button>
    </Form>
    <h5 v-if="loggingIn" style="font-weight: 400">
      Logging you in...Please wait...
    </h5>
    <h5 v-if="error && !loggingIn" style="font-weight: 400">
      {{ errorMessage }}
    </h5>
  </section>
  <section class="login-page" v-if="section === 'forgot-password'">
    <div class="udmercy-logo-wrapper">
      <img src="../assets/detroit-mercy-logo.png" alt="Detroit mercy logo" class="udmercy-logo" />
    </div>
    <br />
    <h3 class="login-title">Detroit Mercy Reimbursement System</h3>
    <br />
    <Form @submit="sendEmail" class="login-form">
      <h6 class="email-help">
        We will send a link to your email to reset your account password
      </h6>
      <div class="login-field">
        <label for="work-email">Work Email: </label>
        <span>
          <div class="work-email-input-field">
            <Field v-model="forgotPasswordWorkEmail" type="text" name="forgot-work-email" id="forgot-work-email"
              :rules="isValidString" />

            <h6 class="work-email-descriptor">@udmercy.edu</h6>
          </div>
          <ErrorMessage name="forgot-work-email" class="error-field" />
        </span>
      </div>
      <span style="display: flex; align-items: center; gap: 10px; margin-top: -10px">
        <router-link to="/signup" class="btn-link">Create an Account</router-link>
        <h3 style="font-weight: 300">|</h3>
        <a class="btn-link" @click="section = 'login'"> Back to login </a>
      </span>
      <button class="login-button" type="submit">Receive link</button>
    </Form>
    <h5 v-if="emailSent" style="
        font-weight: 400;
        max-width: 400px;
        width: auto;
        line-height: 25px;
        text-align: center;
      ">
      We will send a password reset e-mail to
      {{ forgotPasswordWorkEmail }}@udmercy.edu. Remember to check your
      spam/junk folder if it doesn't arrive in a few minutes.
    </h5>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { isNotEmpty, isValidString } from "../utils/validators";
let section = ref<"login" | "forgot-password">("login");
let emailSent = ref<boolean>(false);
let loggingIn = ref<boolean>(false);
let errorMessage = ref<string>("");
let error = ref<boolean>(false);
let userInfo = ref<any>({ workEmail: "", password: "" });
let forgotPasswordWorkEmail = ref<string>("");
const router = useRouter();
function loginUser() {
  loggingIn.value = true;
  axios
    .post(
      `${import.meta.env.VITE_API_URL}/api/login`,
      userInfo.value
    )
    .then((res) => {
      // console.log(res);
      loggingIn.value = false;
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      router.push("/dashboard");
    })
    .catch((err) => {
      loggingIn.value = false;
      error.value = true;
      errorMessage.value = err.response.data.message;
    });
}

onMounted(() => {
  if (localStorage.getItem("token")?.length ?? 0 > 0) {
    console.log("user is already signed in");
    router.push("/dashboard");
  }
});

function sendEmail() {
  axios
    .post(`${import.meta.env.VITE_API_URL}/api/forgotPassword`, {
      workEmail: forgotPasswordWorkEmail.value,
    })
    .then((res) => {
      emailSent.value = true;
      // console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>

<style scoped>
@import url("../assets/styles/login-page.css");
</style>
