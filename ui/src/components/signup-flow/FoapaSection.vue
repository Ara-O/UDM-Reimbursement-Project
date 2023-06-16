<template>
  <div>
    <ManageFoapaDetails :foapa-details="userSignupData.foapaDetails" />
    <div class="continue-buttons" style="margin-top: 20px">
      <button class="signup-button mt-0" type="button" @click="regress">
        Go Back
      </button>
      <button class="signup-button mt-0" @click="$emit('finish')">
        Create Account
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ManageFoapaDetails from "../manage-foapa/ManageFoapaDetails.vue";
import { UserData } from "../../types/types";
const emits = defineEmits(["finish", "goBack"]);
defineProps<{ userSignupData: UserData }>();

function regress() {
  emits("goBack");
}
</script>

<style scoped>
@import url("../../assets/styles/signup-page.css");
</style>
