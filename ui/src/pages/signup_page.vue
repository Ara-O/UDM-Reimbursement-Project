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
        Basic Questions
      </h3>
      <h3 class="signup-title-description" v-if="surveyProgress === 1">
        Password Information
      </h3>
      <h3 class="signup-title-description" v-if="surveyProgress === 2">
        Address Information
      </h3>
      <h3 class="signup-title-description" v-if="surveyProgress === 3">
        User Foapa Information (Not Required)
      </h3>

      <section class="signup-form">
        <section v-show="surveyProgress === 0" class="signup-form">
          <BasicQuestionsSection
            :user-signup-data="userSignupData"
            @continue="surveyProgress++"
          />
        </section>
        <!-- SECTION 2 -->
        <section v-show="surveyProgress === 1" class="signup-form">
          <PasswordSection
            :user-signup-data="userSignupData"
            @continue="surveyProgress++"
            @go-back="surveyProgress--"
          />
        </section>

        <!-- SECTION 3 -->
        <section v-show="surveyProgress === 2" class="signup-form">
          <AddressSection
            :user-signup-data="userSignupData"
            @continue="surveyProgress++"
            @go-back="surveyProgress--"
          />
        </section>

        <!-- SECTION 4 -->
        <section v-show="surveyProgress === 3" class="signup-form">
          <FoapaSection
            :foapa-list="foapaList"
            @finish="registerUser"
            @go-back="surveyProgress--"
          />
        </section>

        <router-link to="/" style="font-size: 14px; margin-top: -15px"
          >Already have an Account</router-link
        >
        <h5
          class="required-field-note"
          style="font-weight: 300; margin-top: -25px"
        >
          Note: All required fields must be filled
        </h5>
      </section>
    </section>
  </section>
</template>

<script lang="ts" setup>
import BasicQuestionsSection from "../components/signup-flow/BasicQuestionsSection.vue";
import PasswordSection from "../components/signup-flow/PasswordSection.vue";
import AddressSection from "../components/signup-flow/AddressSection.vue";
import FoapaSection from "../components/signup-flow/FoapaSection.vue";
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { FoapaStuff, UserData } from "../types/types";
let surveyProgress = ref<number>(0);

const router = useRouter();

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
  userFoapas: [],
});

let foapaList = ref<FoapaStuff[]>([]);

function registerUser() {
  userSignupData.userFoapas = foapaList.value;

  axios
    .post(
      "https://reimbursement-project.onrender.com/api/register",
      userSignupData
    )
    .then((res) => {
      alert(res.data.message);
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.message);
    });
}

onMounted(() => {
  if (localStorage.getItem("token")?.length ?? 0 > 0) {
    console.log("user is already signed in");
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    router.push("/dashboard");
  }
});
</script>

<style scoped>
@import url("../assets/styles/signup-page.css");
</style>
