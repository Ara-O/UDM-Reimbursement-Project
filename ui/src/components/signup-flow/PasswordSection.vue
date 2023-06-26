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
            :rules="passwordMatchesReenteredPassword"
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
          <h5
            class="error-field"
            style="font-weight: 400; margin-top: 0px; margin-bottom: 0px"
            v-if="userSignupData.password !== reEnteredPassword"
          >
            Password does not match
          </h5>
        </span>
      </div>
    </div>

    <div class="continue-buttons mt-s-0">
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
@media (max-width: 812px) {
  .input-field-wrapper {
    height: auto;
  }

  .continue-buttons {
    margin-top: 40px;
  }
}
</style>
