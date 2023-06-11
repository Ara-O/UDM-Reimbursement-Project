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
      <section class="signup-form">
        <BasicQuestionsSection
          :user-signup-data="userSignupData"
          @continue="sendConfirmationEmail"
          v-if="!basicQuestionsSectionIsFinished"
        />
        <article v-else>
          <h3 class="thanks-for-signing-up-msg">Thank you for signing up!</h3>
          <h4 class="email-confirmation-text">
            A confirmation email has being sent to
            {{ userSignupData.workEmail.trim() }}@udmercy.edu. You should
            receive an email in a few minutes. Please check your spam/junk
            folder if it does not arrive. You can close out of this page.
          </h4>
        </article>
      </section>
      <span v-if="!basicQuestionsSectionIsFinished">
        <br />
        <router-link to="/" class="already-have-account"
          >Already have an Account</router-link
        >
        <h5 class="required-field-note">
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

const router = useRouter();
let basicQuestionsSectionIsFinished = ref<boolean>(false);
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

function sendConfirmationEmail() {
  basicQuestionsSectionIsFinished.value = true;
  axios
    .post(
      "https://udm-reimbursement-project.onrender.com/api/sendConfirmationEmail",
      {
        userSignupData,
      }
    )
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      alert(err.data.message);
    });
}

onMounted(() => {
  if (localStorage.getItem("token")?.length ?? 0 > 0) {
    console.log("user is already signed in");
    router.push("/dashboard");
  }
});
</script>

<style scoped>
@import url("../assets/styles/signup-page.css");
</style>
