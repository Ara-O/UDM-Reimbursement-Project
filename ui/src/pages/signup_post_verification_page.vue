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
        Residence Address
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
          <AddressSection :user-signup-data="userSignupData" @continue="registerUser" @go-back="surveyProgress--" />
        </section>

        <!-- SECTION 4 -->
        <!-- <section v-show="surveyProgress === 3" class="signup-form">
          <FoapaSection
            :user-signup-data="userSignupData"
            @finish="registerUser"
            @go-back="surveyProgress--"
          />
        </section>
        <br /> -->

        <router-link to="/" class="already-have-account mt-5">Already have an Account</router-link>
        <h5 class="required-field-note" style="font-weight: 300; margin-top: 25px">
          Note: All required fields are marked with an asterisk and must be
          completed.
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
import ManageFoapaDetails from "../components/manage-foapa/AddFoapaPopup.vue";
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { FoapaStuff, UserData } from "../types/types";
import { useUserInfoStore } from "../store";
import { TYPE, useToast } from "vue-toastification";
let surveyProgress = ref<number>(1);

const router = useRouter();
const toast = useToast();
const route = useRoute();
const store = useUserInfoStore();

let creatingAccountFeedback = ref<boolean>(false);
let userSignupData = reactive<UserData>({
  firstName: "",
  lastName: "",
  workEmail: "",
  employmentNumber: "",
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

async function registerUser() {
  try {
    toast("Creating account...", {
      type: TYPE.INFO,
    });

    let res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/register`,
      userSignupData
    );

    localStorage.setItem("token", res.data.token);
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    router.push("/dashboard");

    toast("Account successfully created...", {
      type: TYPE.SUCCESS,
    });
  } catch (err: any) {
    toast(
      err?.response?.data?.message ||
      "There was an error creating your account. Please try again later",
      {
        type: TYPE.ERROR,
      }
    );
  }
}

onMounted(() => {
  if (Object.keys(store.userData).length === 0) {
    toast(
      "There was an error fetching your information. Please restart the signup process",
      {
        type: TYPE.ERROR,
      }
    );
    router.push("/signup");
    return;
  }

  Object.assign(userSignupData, store.userData as UserData);

  if (localStorage.getItem("token")?.length ?? 0 > 0) {
    router.push("/dashboard");
  }
});
</script>

<style scoped>
@import url("../assets/styles/signup-page.css");
</style>
