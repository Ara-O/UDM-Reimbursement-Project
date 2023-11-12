<template>
  <section class="signup-page">
    <section class="left-section">
      <div class="udmercy-logo-wrapper">
        <img src="../assets/detroit-mercy-logo.png" alt="Detroit mercy logo" class="udmercy-logo" />
      </div>
    </section>
    <section class="right-section">
      <div class="udmercy-logo-wrapper-mobile">
        <img src="../assets/detroit-mercy-logo.png" alt="Detroit mercy logo" class="udmercy-logo-mobile" />
      </div>
      <h3 class="signup-title">Detroit Mercy Reimbursement System</h3>

      <h3 class="signup-title-description" v-if="surveyProgress === 1">
        Password Information
      </h3>
      <h3 class="signup-title-description" v-if="surveyProgress === 2">
        Address Information
      </h3>
      <h3 class="signup-title-description" v-if="surveyProgress === 3">
        User Foapa Information (Not Required). Hover Over Question Mark Icon For
        Help
      </h3>

      <section class="signup-form">
        <!-- SECTION 2 -->
        <section v-show="surveyProgress === 1" class="signup-form">
          <PasswordSection :user-signup-data="userSignupData" @continue="surveyProgress++" />
        </section>

        <!-- SECTION 3 -->
        <section v-show="surveyProgress === 2" class="signup-form">
          <AddressSection :user-signup-data="userSignupData" @continue="surveyProgress++" @go-back="surveyProgress--" />
        </section>

        <!-- SECTION 4 -->
        <section v-show="surveyProgress === 3" class="signup-form">
          <FoapaSection :user-signup-data="userSignupData" @finish="registerUser" @go-back="surveyProgress--" />
        </section>
        <br />
        <h5 v-if="creatingAccountFeedback" class="creating-account-feedback">
          Creating Account...
        </h5>

        <router-link to="/" class="already-have-account">Already have an Account</router-link>
        <h5 class="required-field-note" style="font-weight: 300; margin-top: 25px">
          Note: All required fields must be filled
        </h5>
      </section>
      <!-- <ManageFoapaDetails></ManageFoapaDetails> -->
    </section>
  </section>
</template>

<script lang="ts" setup>
import PasswordSection from "../components/signup-flow/PasswordSection.vue";
import AddressSection from "../components/signup-flow/AddressSection.vue";
import FoapaSection from "../components/signup-flow/FoapaSection.vue";
import ManageFoapaDetails from "../components/manage-foapa/ManageFoapaDetails.vue";
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { FoapaStuff, UserData } from "../types/types";
let surveyProgress = ref<number>(1);

const router = useRouter();
const route = useRoute();
let creatingAccountFeedback = ref<boolean>(false);
let userSignupData = reactive<UserData>({
  firstName: "",
  lastName: "",
  workEmail: "",
  employmentNumber: null,
  department: "",
  mailingAddress: "",
  phoneNumber: "",
  password: "",
  postalCode: "",
  city: "",
  state: "",
  country: "",
  foapaDetails: [],
});

function registerUser() {
  creatingAccountFeedback.value = true;
  axios
    .post(
      `${import.meta.env.VITE_API_URL}/api/register`,
      userSignupData
    )
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      router.push("/dashboard");
    })
    .catch((err) => {
      alert(err.response.data.message);
    })
    .finally(() => {
      creatingAccountFeedback.value = false;
    });
}

onMounted(() => {
  if (localStorage.getItem("token")?.length ?? 0 > 0) {
    // console.log("user is already signed in");
    router.push("/dashboard");
  }

  if (route.params.userToken) {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/verifyUserSignupToken`,
        {
          token: route.params.userToken,
        }
      )
      .then((res) => {
        userSignupData = Object.assign(userSignupData, res.data.userSignupData);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
        router.push("/signup");
      });
  }
});
</script>

<style scoped>
@import url("../assets/styles/signup-page.css");
</style>
