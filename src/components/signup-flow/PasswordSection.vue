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
    <div class="input-field" style="width: 320px">
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
    <button
      class="signup-button"
      type="button"
      @click="regress"
      style="margin-top: 0px"
    >
      Go Back
    </button>
    <button
      class="signup-button"
      type="button"
      style="margin-top: 0px"
      @click="progress"
    >
      Continue
    </button>
  </div>
</template>

<script lang="ts" setup>
import { UserData } from "../../types/types";
import { ref } from "vue";
let reEnteredPassword = ref<string>("");

const { userSignupData } = defineProps<{
  userSignupData: UserData;
}>();

const emits = defineEmits(["continue", "goBack"]);

function progress() {
  let dataShown = ["password"];
  for (let i = 0; i < dataShown.length; i++) {
    if (userSignupData[dataShown[i]] === "") {
      console.log("password field empty");
      alert(
        `The ${dataShown[i]
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} field is empty`
      );
      break;
    }

    if (i === dataShown.length - 1) {
      if (reEnteredPassword.value !== userSignupData.password) {
        alert("Passwords do not match, please try again");
      } else {
        if (!userSignupData.workEmail.includes("@udmercy.edu")) {
          userSignupData.workEmail += "@udmercy.edu";
        }
        emits("continue");
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    }
  }
}

function regress() {
  emits("goBack");
}
</script>

<style scoped>
@import url("../../assets/styles/signup-page.css");
</style>
