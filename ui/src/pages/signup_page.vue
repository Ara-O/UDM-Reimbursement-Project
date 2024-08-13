<template>
  <main class="signup-page">
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
      <h3 class="signup-title-description">Basic Questions</h3>
      <Form @submit="verifyInformation" class="mb-5 signup_form">
        <div class="input-field-wrapper">
          <div class="input-field">
            <label for="first-name">First Name: *</label>
            <span>
              <Field
                type="text"
                name="first-name"
                :rules="isValidString"
                id="first-name"
                v-model="userSignupData.firstName"
              />
              <ErrorMessage name="first-name" class="error-field" />
            </span>
          </div>
          <div class="input-field">
            <label for="first-name">Last Name: *</label>
            <span>
              <Field
                type="text"
                name="last-name"
                :rules="isValidString"
                id="last-name"
                v-model="userSignupData.lastName"
              />
              <ErrorMessage name="last-name" class="error-field" />
            </span>
          </div>
        </div>
        <div class="input-field-wrapper">
          <div class="input-field">
            <label for="phone-number" class="mt-0">Phone Number: *</label>
            <span>
              <Field
                type="text"
                name="phone-number"
                id="phone-number"
                :rules="isValidPhoneNumber"
                v-model="userSignupData.phoneNumber"
              />
              <ErrorMessage name="phone-number" class="error-field" />
            </span>
          </div>
          <div class="work-email-section">
            <label for="work-email">Work Email: *</label>
            <span>
              <span class="work-email-input-field">
                <Field
                  type="text"
                  :rules="isValidString"
                  name="work-email"
                  id="work-email"
                  v-model="userSignupData.workEmail"
                />
                <h6 class="work-email-descriptor">@udmercy.edu</h6>
              </span>
              <ErrorMessage name="work-email" class="error-field" />
            </span>
          </div>
        </div>
        <div class="input-field-wrapper">
          <div class="input-field">
            <label for="employment-number" class="mt-0"
              >Employment Number: *</label
            >
            <span>
              <span class="relative">
                <span class="employment-number-section">
                  <h3>T</h3>
                </span>
                <Field
                  type="text"
                  :rules="isValidEmploymentNumber"
                  name="employment-number"
                  id="employment-number"
                  v-model="userSignupData.employmentNumber"
                />
              </span>
              <ErrorMessage name="employment-number" class="error-field" />
            </span>
          </div>
          <div class="input-field">
            <label for="department">Department: *</label>
            <span>
              <Field
                name="department"
                id="department"
                as="select"
                v-model="userSignupData.department"
              >
                <option :value="department" v-for="department in departments">
                  {{ department }}
                </option>
              </Field>
              <ErrorMessage name="department" class="error-field" />
            </span>
          </div>
        </div>
        <button class="signup-button" type="submit">Continue</button>
      </Form>

      <div class="account-feedback-message">
        <router-link
          to="/"
          class="already-have-account no-underline hover:underline text-black"
          >Already have an Account?</router-link
        >
        <h5 class="required-field-note mb-0">
          Note: All required fields are marked with an asterisk and must be
          completed.
        </h5>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { UserData } from "../types/types";
import { useUserInfoStore } from "../store/index";
import { TYPE, useToast } from "vue-toastification";
import { Form, Field, ErrorMessage } from "vee-validate";
import {
  isValidEmploymentNumber,
  isValidString,
  isValidPhoneNumber,
} from "../utils/validators";

const departments = [
  "Dean's Office",
  "Architectural & Environmental Engineering",
  "Biochemistry",
  "Chemistry",
  "Civil",
  "Computer Science",
  "E&S Computing Services",
  "Electrical & Computer Engineering",
  "Mechanical Engineering",
  "Mathematics",
  "Physics",
  "Professional Engineering",
];

const emits = defineEmits(["continue"]);
const toast = useToast();
const router = useRouter();
const userStore = useUserInfoStore();

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

async function verifyInformation() {
  try {
    toast("Verifying your information...", {
      type: TYPE.INFO,
    });

    //Verify the user's information
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/verify-signup-basic-information`,
      {
        employmentNumber: userSignupData.employmentNumber,
        workEmail: userSignupData.workEmail,
      }
    );

    //Send user the confirmation email
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/send-confirmation-email`,
      {
        workEmail: userSignupData.workEmail,
        employmentNumber: userSignupData.employmentNumber,
      }
    );

    userStore.updateUserData(userSignupData);

    toast("Successfully verified your information!", {
      type: TYPE.SUCCESS,
    });

    router.push("/verify-account");
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  } catch (err: any) {
    toast(
      err?.response?.data?.message ||
        "There was an error verifying your information. Please try again later",
      {
        type: TYPE.ERROR,
      }
    );
  }
}

onMounted(() => {
  if (localStorage.getItem("token")?.length ?? 0 > 0) {
    router.push("/dashboard");
  }
});
</script>

<style scoped>
@import url("../assets/styles/signup-page.css");

.input-field,
.work-email-section {
  height: 70px;
}
</style>
