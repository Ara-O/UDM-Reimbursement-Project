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
</template>

<script lang="ts" setup>
import axios from "axios";
import { UserData } from "../../types/types";
const { userSignupData } = defineProps<{
  userSignupData: UserData;
}>();

const emits = defineEmits(["continue"]);

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

//Manually doing it, going to use a better validation library next semester
function progress() {
  let dataShown = [
    "firstName",
    "lastName",
    "workEmail",
    "employmentNumber",
    "phoneNumber",
    "department",
  ];

  for (let i = 0; i < dataShown.length; i++) {
    if (userSignupData[dataShown[i]] === "") {
      console.log("field empty");
      alert(
        `The ${dataShown[i]
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} field is empty`
      );
      break;
    } else {
      if (
        userSignupData.employmentNumber !== null &&
        isNaN(userSignupData.employmentNumber)
      ) {
        alert("Employment number must be a number");
        break;
      }

      if (i === dataShown.length - 1) {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        axios
          .post(
            "https://reimbursement-project.onrender.com/api/verifyEmploymentNumber",
            {
              employmentNumber: userSignupData.employmentNumber,
            }
          )
          .then((res) => {
            emits("continue");
          })
          .catch((err) => {
            console.log(err);
            alert(err.response.data.message);
          });
      }
    }
  }
}
</script>

<style scoped>
@import url("../../assets/styles/signup-page.css");
</style>
