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
    <button class="signup-button mt-s-0" type="button" @click="progress">
      Continue
    </button>
  </div>
</template>

<script lang="ts" setup>
import { UserData } from "../../types/types";
import { ref } from "vue";

let reEnteredPassword = ref<string>("");

const props = defineProps<{ userSignupData: UserData }>();

const emits = defineEmits(["continue"]);

function progress() {
  emits("continue");
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}
</script>

<style scoped>
@import url("../../assets/styles/signup-page.css");
</style>
