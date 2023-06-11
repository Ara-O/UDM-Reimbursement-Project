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
    <!-- <button class="signup-button-arrow" type="submit">
      <img
        src="../../assets/next-arrow.png"
        alt="Next arrow"
        class="next-arrow"
      />
    </button> -->
  </Form>
  <h5
    style="font-weight: 400; margin-bottom: 10px"
    v-if="validatingSignupFields"
  >
    Validating Employment Number...
  </h5>
</template>

<script lang="ts" setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import axios from "axios";
import { ref } from "vue";
import { UserData } from "../../types/types";
const { userSignupData } = defineProps<{
  userSignupData: UserData;
}>();

let validatingSignupFields = ref<boolean>(false);
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

function isValidString(value) {
  const isAString = /^[a-zA-Z0-9\s-]+$/.test(value);
  switch (true) {
    case value.trim() === "":
      return "Field can not be empty";
    case !isAString:
      return "Invalid Characters";
    default:
      return true;
  }
}

function isValidPhoneNumber(value) {
  const isValidNumber = /^[0-9]+$/.test(value);
  const hasValidLength = /^[0-9]{10}$/.test(value);

  switch (true) {
    case value.trim() === "":
      return "Field cannot be empty";
    case !isValidNumber:
      return "Field only accepts numbers";
    case !hasValidLength:
      return "Please use the format xxxxxxxxxx";
    default:
      return true;
  }
}

function isValidEmploymentNumber(value) {
  const isValidNumber = /^[0-9]+$/.test(value);
  const hasValidLength = /^[0-9]{8}$/.test(value);

  switch (true) {
    case value === null:
      return "Field cannot be empty";
    case !isValidNumber:
      return "Field only accepts numbers";
    case !hasValidLength:
      return "Employment number must be 8 numbers";
    default:
      return true;
  }
}

//Manually doing it, going to use a better validation library next semester
function progress() {
  validatingSignupFields.value = true;

  axios
    .post(
      "https://udm-reimbursement-project.onrender.com/api/verifySignupBasicInformation",
      {
        employmentNumber: userSignupData.employmentNumber,
        workEmail: userSignupData.workEmail,
      }
    )
    .then((res) => {
      validatingSignupFields.value = false;
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      emits("continue");
    })
    .catch((err) => {
      alert(err.response.data.message);
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
