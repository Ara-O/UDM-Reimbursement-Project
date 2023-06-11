<template>
  <section class="login-page" v-if="section === 'login'">
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
    <form @submit.prevent="loginUser" class="login-form">
      <div class="login-field">
        <label for="work-email">Work Email: </label>
        <div class="work-email-input-field">
          <input
            v-model="userInfo.workEmail"
            type="text"
            name="Work Email"
            id="work-email"
            required
          />
          <h6 class="work-email-descriptor">@udmercy.edu</h6>
        </div>
      </div>
      <div class="login-field">
        <label for="password">Password:</label>
        <input
          v-model="userInfo.password"
          type="password"
          class="login-password-input"
          name="Password"
          required
          id="password"
        />
      </div>
      <span style="display: flex; align-items: center; gap: 10px">
        <router-link
          to="/signup"
          style="
            font-size: 14px;
            text-decoration: underline;
            color: purple;
            cursor: pointer;
          "
          >Create an Account</router-link
        >
        <h3 style="font-weight: 300">|</h3>
        <a
          style="
            font-size: 14px;
            text-decoration: underline;
            color: purple;
            cursor: pointer;
          "
          @click="section = 'forgot-password'"
        >
          Forgot Password
        </a>
      </span>
      <button class="login-button" type="submit">Login</button>
    </form>
    <h5 v-if="loggingIn" style="font-weight: 400">
      Logging you in...Please wait...
    </h5>
  </section>
  <section class="login-page" v-if="section === 'forgot-password'">
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
    <form @submit.prevent="sendEmail" class="login-form">
      <h6 class="email-help">
        We will send a link to your email to reset your account password
      </h6>
      <div class="login-field">
        <label for="work-email">Work Email: </label>
        <div class="work-email-input-field">
          <input
            v-model="forgotPasswordWorkEmail"
            type="text"
            name="Work Email"
            id="work-email"
            required
          />
          <h6 class="work-email-descriptor">@udmercy.edu</h6>
        </div>
      </div>
      <span
        style="display: flex; align-items: center; gap: 10px; margin-top: -20px"
      >
        <router-link to="/signup" class="btn-link"
          >Create an Account</router-link
        >
        <h3 style="font-weight: 300">|</h3>
        <a class="btn-link" @click="section = 'login'"> Back to login </a>
      </span>
      <button class="login-button" type="submit">Receive link</button>
    </form>
    <h5
      v-if="emailSent"
      style="
        font-weight: 400;
        max-width: 400px;
        width: auto;
        line-height: 25px;
        text-align: center;
      "
    >
      We will send a password reset e-mail to
      {{ forgotPasswordWorkEmail }}@udmercy.edu. Remember to check your
      spam/junk folder if it doesn't arrive in a few minutes.
    </h5>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
let section = ref<"login" | "forgot-password">("login");
let emailSent = ref<boolean>(false);
let loggingIn = ref<boolean>(false);
let userInfo = ref<any>({ workEmail: "", password: "" });
let forgotPasswordWorkEmail = ref<string>("");
const router = useRouter();
function loginUser() {
  let pattern = /^[a-zA-Z0-9\s-]+$/;

  if (userInfo.value.workEmail.trim() === "") {
    loggingIn.value = false;
    alert("Work Email cannot be empty");
  } else if (!pattern.test(userInfo.value.workEmail)) {
    loggingIn.value = false;
    alert("Work Email contains invalid characters");
  } else {
    loggingIn.value = true;
    axios
      .post(
        "https://udm-reimbursement-project.onrender.com/api/login",
        userInfo.value
      )
      .then((res) => {
        console.log(res);
        alert(res.data.message);
        loggingIn.value = false;
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common["authorization"] =
          localStorage.getItem("token");
        router.push("/dashboard");
      })
      .catch((err) => {
        loggingIn.value = false;
        console.log(err);
        alert(err.response.data.message);
      });
  }
}

onMounted(() => {
  if (localStorage.getItem("token")?.length ?? 0 > 0) {
    console.log("user is already signed in");
    router.push("/dashboard");
  }
});

function sendEmail() {
  axios
    .post("https://udm-reimbursement-project.onrender.com/api/forgotPassword", {
      workEmail: forgotPasswordWorkEmail.value,
    })
    .then((res) => {
      emailSent.value = true;
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>

<style scoped>
@import url("../assets/styles/login-page.css");
</style>
