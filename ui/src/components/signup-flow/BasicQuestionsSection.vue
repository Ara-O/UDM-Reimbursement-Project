<template>
  <h3 class="signup-title-description">Basic Questions</h3>
  <Form @submit="progress">
    <div class="input-field-wrapper">
      <div class="input-field">
        <label for="first-name">First Name:*</label>
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
        <label for="first-name">Last Name:*</label>
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
        <label for="phone-number" class="mt-0">Phone Number:*</label>
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
        <label for="employment-number" class="mt-0">Employment Number: *</label>
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
            :rules="isValidString"
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
  <h5 class="validating-signup-field" v-if="validatingSignupFields">
    Validating Employment Number...
  </h5>
  <h5 class="error-signup-message" v-if="signupError">
    {{ signupErrorMessage }}
  </h5>
</template>

<script lang="ts" setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import axios from "axios";
import { ref } from "vue";
import {
  isValidEmploymentNumber,
  isValidString,
  isValidPhoneNumber,
} from "../../utils/validators";
import { UserData } from "../../types/types";

const { userSignupData } = defineProps<{
  userSignupData: UserData;
}>();

let validatingSignupFields = ref<boolean>(false);
let signupError = ref<boolean>(false);
let signupErrorMessage = ref<string>("");
const departments = [
  "Architectural Engineering",
  "Biochemistry",
  "Civil Engineering",
  "Computer Science",
  "Electrical Engineering",
  "Environmental Engineering",
  "Mathematics",
  "Mechanical Engineering",
  "Office of the Dean",
  "Physics",
  "Chemistry",
  "Robotics and Mechatronic Systems Engineering",
];
const emits = defineEmits(["continue"]);

function progress() {
  validatingSignupFields.value = true;
  signupError.value = false;
  signupErrorMessage.value = "";
  axios
    .post("http://localhost:8080/api/verifySignupBasicInformation", {
      employmentNumber: userSignupData.employmentNumber,
      workEmail: userSignupData.workEmail,
    })
    .then((res) => {
      emits("continue");
      validatingSignupFields.value = false;
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    })
    .catch((err) => {
      signupError.value = true;
      signupErrorMessage.value = err.response.data.message;
      validatingSignupFields.value = false;
    });
}
</script>

<style scoped>
@import url("../../assets/styles/signup-page.css");
.input-field,
.work-email-section {
  height: 70px;
}
</style>
