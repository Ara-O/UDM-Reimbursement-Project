<template>
  <Form @submit="progress">
    <div class="input-field-wrapper">
      <div class="input-field">
        <label for="password">Password: *</label>
        <span>
          <Field
            type="password"
            name="password"
            id="password"
            :rules="isNotEmpty"
            v-model="userSignupData.password"
          />
          <ErrorMessage name="password" class="error-field" />
        </span>
      </div>
      <div class="input-field">
        <label for="reenter-password" style="width: auto"
          >Re-enter password: *</label
        >
        <span>
          <Field
            type="password"
            :rules="passwordMatches"
            name="re-enter-password"
            id="re-enter-password"
            v-model="reEnteredPassword"
          />
          <ErrorMessage name="re-enter-password" class="error-field" />
        </span>
      </div>
    </div>
    <div class="continue-buttons mt-0">
      <button class="signup-button mt-0" type="submit">Continue</button>
    </div>
  </Form>
</template>

<script lang="ts" setup>
import { UserData } from "../../types/types";
import { ref } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import { isNotEmpty } from "../../utils/validators";

let reEnteredPassword = ref<string>("");

const props = defineProps<{ userSignupData: UserData }>();
const emits = defineEmits(["continue"]);

function passwordMatches(value) {
  if (value !== props.userSignupData.password) {
    return "Does not match password";
  } else {
    return true;
  }
}

function progress() {
  emits("continue");
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}
</script>

<style scoped>
@import url("../../assets/styles/signup-page.css");

.input-field-wrapper {
  height: 65px;
}
</style>
