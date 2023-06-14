<template>
  <div>
    <ManageFoapaDetails :foapa-list="userSignupData.foapaList" />
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
const emits = defineEmits(["finish", "goBack"]);
import { UserData } from "../../types/types";
defineProps<{ userSignupData: UserData }>();

function regress() {
  emits("goBack");
}
</script>

<style scoped>
@import url("../../assets/styles/signup-page.css");
</style>
