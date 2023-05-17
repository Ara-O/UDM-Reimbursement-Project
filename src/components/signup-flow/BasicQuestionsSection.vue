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
    <div class="input-field" style="width: 225px">
      <label for="phone-number">Phone: *</label>
      <input
        type="text"
        name="Phone Number"
        id="phone-number"
        v-model="userSignupData.phoneNumber"
      />
    </div>
  </div>
  <div class="input-field-wrapper">
    <div class="work-email-section">
      <label for="work-email" style="font-size: 14px; width: 100px"
        >Work Email: *</label
      >
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
    <div class="input-field" style="width: 322px">
      <label for="employment-number" style="width: auto"
        >Employment Number: *</label
      >
      <span style="position: relative">
        <span
          style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-51px, -50%);
          "
        >
          <h3 style="font-size: 14px; font-weight: 400; color: #474747">T</h3>
        </span>
        <input
          type="text"
          name="Employment Number"
          style="width: 130px; padding-left: 25px"
          id="employment-number"
          v-model="userSignupData.employmentNumber"
        />
      </span>
    </div>
  </div>
  <div class="input-field-wrapper">
    <div class="input-field" style="width: 320px">
      <label for="department">Department: *</label>
      <select
        style="width: 200px"
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
      if (isNaN(userSignupData.employmentNumber)) {
        alert("Employment number must be a number");
        break;
      }

      if (i === dataShown.length - 1) {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        axios
          .post("/api/verifyEmploymentNumber", {
            employmentNumber: userSignupData.employmentNumber,
          })
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
