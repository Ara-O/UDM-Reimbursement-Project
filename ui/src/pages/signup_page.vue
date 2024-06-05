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
      <section class="signup-form mb-5">
        <span v-if="!basicQuestionsSectionIsFinished">
          <BasicQuestionsSection :user-signup-data="userSignupData" @continue="sendConfirmationEmail" />
          <h3 v-if="verifyingInformation">Verifying user information...</h3>
        </span>
        <article v-else>
          <h3 class="thanks-for-signing-up-msg">Thank you for signing up!</h3>
          <h4 class="email-confirmation-text">
            A 6-character code has being sent to
            {{ userSignupData.workEmail.trim() }}@udmercy.edu. You should
            receive an email in 3-5 minutes. Please check your spam/junk folder
            if it does not arrive.
          </h4>
          <div class="verify-code-section">
            <form @submit.prevent="verifySixCharacterCode">
              <h4 class="font-medium">Enter 6-character code here:</h4>
              <input type="text" v-model="userCode"
                class="border border-[#BABABA] border-solid h-12 rounded-md box-border w-56 pl-9" placeholder="XXXXXX"
                required>
              <br>
              <button class="mt-5 verify-button" type="submit">Enter</button>
              <h5 class="font-normal" v-if="verificationCodeError">Incorrect code, please try again</h5>
            </form>
          </div>
        </article>
      </section>
      <span v-if="!basicQuestionsSectionIsFinished" class="account-feedback-message">
        <router-link to="/" class="already-have-account">Already have an Account</router-link>
        <h5 class="required-field-note mb-0">
          Note: All required fields must be filled
        </h5>
      </span>
    </section>
  </section>
</template>

<script lang="ts" setup>
import BasicQuestionsSection from "../components/signup-flow/BasicQuestionsSection.vue";
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { UserData } from "../types/types";
import { useUserInfoStore } from "../store/index"

const router = useRouter();
const userDataStore = useUserInfoStore();

let verifyingInformation = ref<boolean>(false);
let verificationCodeError = ref<boolean>(false);
let basicQuestionsSectionIsFinished = ref<boolean>(false);
let userCode = ref<string>("")
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

function sendConfirmationEmail() {
  axios
    .post(
      `${import.meta.env.VITE_API_URL}/api/sendConfirmationEmail`,
      {
        userSignupData,
      }
    )
    .then((res) => {
      verifyingInformation.value = true;
      basicQuestionsSectionIsFinished.value = true;
    })
    .catch((err) => {
      verifyingInformation.value = false;
      alert(err?.data?.message || "There was an error, please try again");
    });
}

onMounted(() => {
  if (localStorage.getItem("token")?.length ?? 0 > 0) {
    // console.log("user is already signed in");
    router.push("/dashboard");
  }
});

async function verifySixCharacterCode() {
  if (userCode.value.length !== 6) {
    alert("Please enter 6 characters")
  }

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/verifyCode`,
      {
        userCode: userCode.value,
        workEmail: userSignupData.workEmail,
        employmentNumber: userSignupData.employmentNumber
      })


    userDataStore.updateUserData(userSignupData)
    router.push(`/complete-verification`)
  } catch (err) {
    verificationCodeError.value = true
    console.log(err)
  }
}
</script>

<style scoped>
@import url("../assets/styles/signup-page.css");
</style>
