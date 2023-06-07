<template>
  <div class="input-field-wrapper">
    <div class="input-field">
      <label for="password">Password: *</label>
      <input
        type="password"
        name="Password"
        id="password"
        v-model="userSignupData.password"
      />
    </div>
    <div class="input-field">
      <label for="reenter-password" style="width: auto"
        >Re-enter password: *</label
      >
      <input
        type="password"
        name="reenter-password"
        id="reenter-password"
        v-model="reEnteredPassword"
      />
    </div>
  </div>
  <div class="continue-buttons">
    <button class="signup-button" type="button" @click="progress">
      Continue
    </button>
  </div>
</template>

<script lang="ts" setup>
import { UserData } from "../../types/types";
import { ref, watch } from "vue";

let reEnteredPassword = ref<string>("");

// const props = defineProps<{
//   userSignupData: UserData;
// }>();
const props = defineProps(["userSignupData"]);

const emits = defineEmits(["continue"]);

function progress() {
  let dataShown = ["password"];
  for (let i = 0; i < dataShown.length; i++) {
    if (props.userSignupData[dataShown[i]] === "") {
      console.log("password field empty");
      alert(
        `The ${dataShown[i]
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} field is empty`
      );
      break;
    }

    if (i === dataShown.length - 1) {
      if (reEnteredPassword.value !== props.userSignupData.password) {
        alert("Passwords do not match, please try again");
      } else {
        if (!props.userSignupData.workEmail.includes("@udmercy.edu")) {
          props.userSignupData.workEmail += "@udmercy.edu";
        }
        emits("continue");
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    }
  }
}
</script>

<style scoped>
@import url("../../assets/styles/signup-page.css");
</style>
