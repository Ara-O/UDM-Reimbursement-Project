<template>
  <Form @submit="progress">
    <div class="input-field-wrapper">
      <div class="input-field">
        <label for="password">Password: *</label>
        <span style="position: relative;">
          <Field :type="passwordFieldType" name="password" id="password" :rules="passwordMatchesReenteredPassword"
            v-model="userSignupData.password" />
          <ErrorMessage name="password" class="error-field" />
          <img 
            v-if="passwordFieldType === 'password'" 
            class="hover:!opacity-100"
            src="../../assets/eye.png" 
            @click="togglePasswordVisibility"
            style="position: absolute; right: 20px; top: 28%; transform: translateY(-50%); cursor: pointer; width: 20px; opacity: 25%; hover-opacity: 100%"
          />
          <img 
            v-else 
            class="hover:!opacity-100"
            src="../../assets/eyeslash.png" 
            @click="togglePasswordVisibility"
            style="position: absolute; right: 20px; top: 28%; transform: translateY(-50%); cursor: pointer; width: 20px; opacity: 25%"
          />
        </span>
      </div>
      <div class="input-field">
        <label for="reenter-password" class="re-enter-password-label" style="width: auto">Re-enter password: *</label>
        <span style="position: relative;">
          <Field :type="passwordFieldType2" :rules="passwordMatches" name="re-enter-password" id="re-enter-password"
            v-model="reEnteredPassword" />
            <img 
            v-if="passwordFieldType2 === 'password'" 
            class="hover:!opacity-100"
            src="../../assets/eye.png" 
            @click="togglePasswordVisibility2"
            style="position: absolute; right: 20px; top: 28%; transform: translateY(-50%); cursor: pointer; width: 20px; opacity: 25%; hover-opacity: 100%"
          />
          <img 
            v-else 
            class="hover:!opacity-100"
            src="../../assets/eyeslash.png" 
            @click="togglePasswordVisibility2"
            style="position: absolute; right: 20px; top: 28%; transform: translateY(-50%); cursor: pointer; width: 20px; opacity: 25%"
          />
          <h5 class="error-field" style="font-weight: 400; margin-top: 0px; margin-bottom: 0px"
            v-if="userSignupData.password !== reEnteredPassword">
            Password does not match
          </h5>
        </span>
      </div>
    </div>

    <div class="continue-buttons mt-s-0" style="margin-top: 5px">
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

const passwordFieldType = ref<string>('password');
  const passwordFieldType2 = ref<string>('password');

function togglePasswordVisibility() {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
}

function togglePasswordVisibility2() {
  passwordFieldType2.value = passwordFieldType2.value === 'password' ? 'text' : 'password';
}
function passwordMatches(value) {
  if (value.trim() === "") {
    return "Field can not be empty";
  } else if (value !== props.userSignupData.password) {
    return "Password does not match";
  } else {
    return true;
  }
}

function passwordMatchesReenteredPassword(value) {
  if (value.trim() === "") {
    return "Field can not be empty";
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

@media (max-width: 813px) {
  .input-field-wrapper {
    height: auto;
  }

  .re-enter-password-label {
    width: 100px !important;
    margin-top: 0px !important;
  }

  .continue-buttons {
    margin-top: 30px !important;
  }
}

@media (max-width: 780px) {
  .re-enter-password-label {
    width: auto !important;
  }
}
</style>
