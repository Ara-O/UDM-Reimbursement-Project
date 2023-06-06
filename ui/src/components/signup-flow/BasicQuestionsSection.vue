<template>
  <div class="input-field-wrapper">
    <div class="input-field">
      <label for="first-name">First Name:*</label>
      <input
        type="text"
        name="First name"
        id="first-name"
        v-model="userSignupData.firstName"
      />
    </div>
    <div class="input-field">
      <label for="last-name">Last Name:*</label>
      <input
        type="text"
        name="Last Name"
        id="last-name"
        v-model="userSignupData.lastName"
      />
    </div>
    <div class="input-field">
      <label for="phone-number">Phone: *</label>
      <input
        type="text"
        name="Phone Number"
        id="phone-number"
        v-model="userSignupData.phoneNumber"
      />
    </div>
    <div class="work-email-section">
      <label for="work-email">Work Email: *</label>
      <div class="work-email-input-field">
        <input
          type="email"
          name="Work Email"
          id="work-email"
          v-model="userSignupData.workEmail"
        />
        <h6 class="work-email-descriptor">@udmercy.edu</h6>
      </div>
    </div>
    <div class="input-field">
      <label for="employment-number">Employment Number: *</label>
      <span style="position: relative">
        <span class="employment-number-section">
          <h3>T</h3>
        </span>
        <input
          type="text"
          style="padding-left: 30px"
          name="Employment Number"
          id="employment-number"
          v-model="userSignupData.employmentNumber"
        />
      </span>
    </div>
    <div class="input-field">
      <label for="department">Department: *</label>
      <select
        name="Department"
        id="department"
        v-model="userSignupData.department"
      >
        <option :value="department" v-for="department in departments">
          {{ department }}
        </option>
      </select>
    </div>
  </div>
  <button
    class="signup-button"
    type="button"
    @click="progress"
    style="margin-top: 0px"
  >
    Continue
  </button>
  <h5
    style="font-weight: 400; margin: -24px 0px -10px 0px"
    v-if="validatingSignupFields"
  >
    Validating Employment Number...
  </h5>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref } from "vue";
import { UserData } from "../../types/types";
const { userSignupData } = defineProps<{
  userSignupData: UserData;
}>();

type ValidationResult = {
  field: (typeof fieldsToValidate)[number];
  reason: "Invalid type" | "Empty" | "Invalid chars" | "Invalid format";
};

const emits = defineEmits(["continue"]);
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

const fieldsToValidate = [
  "firstName",
  "lastName",
  "workEmail",
  "phoneNumber",
  "employmentNumber",
  "department",
];

function validateField(data, fieldsToValidate) {
  //Regex to test for alphanumeric vals, thanks chatGpt
  var pattern = /^[a-zA-Z0-9\s-]+$/;

  return new Promise((resolve, reject) => {
    if (data.employmentNumber !== null && isNaN(data.employmentNumber)) {
      reject({
        field: "employmentNumber",
        reason: "Invalid type",
      } as ValidationResult);
    }

    if (data.employmentNumber === null) {
      reject({
        field: "employmentNumber",
        reason: "Empty",
      } as ValidationResult);
    }

    const numericPhoneNumber = userSignupData.phoneNumber.replace(/\D/g, "");
    const isValidPhoneNumber = /^\d{10}$/.test(numericPhoneNumber);
    if (!isValidPhoneNumber) {
      reject({
        field: "phoneNumber",
        reason: "Invalid format",
      } as ValidationResult);
    }

    for (let i = 0; i < fieldsToValidate.length; i++) {
      let field = fieldsToValidate[i];
      console.log(field, data[field]);
      if (String(data[field]).trim() === "") {
        reject({ field, reason: "Empty" } as ValidationResult);
      }

      if (!pattern.test(data[field])) {
        reject({ field, reason: "Invalid chars" } as ValidationResult);
      }

      //Normalizing the fields
      if (typeof userSignupData[field] === "string")
        userSignupData[field] = userSignupData[field].trim();
    }
    resolve("All valid fields");
  });
}
//Manually doing it, going to use a better validation library next semester
function progress() {
  validateField(userSignupData, fieldsToValidate)
    .then(() => {
      validatingSignupFields.value = true;

      axios
        .post(
          "https://reimbursement-project.onrender.com/api/verifySignupBasicInformation",
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
    })
    .catch((err) => {
      validatingSignupFields.value = false;
      let erringField = err.field
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, function (match) {
          return match.toUpperCase();
        });

      err.reason === "Invalid type" &&
        alert(`The ${erringField} field must be a number`);

      err.reason === "Invalid chars" &&
        alert(`The ${erringField} field contains invalid characters`);

      err.reason === "Empty" &&
        alert(`The ${erringField} field cannot be empty`);

      err.reason === "Invalid format" &&
        alert(`The ${erringField} field must have the format XXXXXXXXXX`);
    });
}
</script>

<style scoped>
@import url("../../assets/styles/signup-page.css");
</style>
