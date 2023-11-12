<template>
  <Form @submit="progress">
    <div class="input-field-wrapper">
      <div class="input-field">
        <label for="country">Country: *</label>
        <span>
          <Field name="country" id="country" as="select" :rules="isValidString" v-model="userSignupData.country"
            @change="countryChanged">
            <option :value="country.name" v-for="country in countries">
              {{ country.name }}
            </option>
          </Field>
          <ErrorMessage name="country" class="error-field" />
        </span>
      </div>

      <div class="input-field">
        <label for="state">State: *</label>
        <span>
          <Field name="state" id="state" as="select" :rules="isValidString" :disabled="userSignupData.country === ''"
            v-model="userSignupData.state" @change="stateChanged">
            <option :value="state.name" v-for="state in states">
              {{ state.name }}
            </option>
          </Field>
          <ErrorMessage name="state" class="error-field" />
        </span>
      </div>
    </div>
    <div class="input-field-wrapper">
      <div class="input-field">
        <label for="city">City: *</label>
        <span>
          <Field name="city" id="city" :rules="isNotEmpty" as="select" v-model="userSignupData.city"
            :disabled="userSignupData.state === ''">
            <option :value="city.name" v-for="city in cities">
              {{ city.name }}
            </option>
          </Field>
          <ErrorMessage name="city" class="error-field" />
        </span>
      </div>

      <div class="input-field">
        <label for="mailing-address">Mailing Address: *</label>
        <span>
          <Field type="text" :rules="isValidString" name="mailing-address" id="mailing-address"
            v-model="userSignupData.mailingAddress" />
          <ErrorMessage name="mailing-address" class="error-field" />
        </span>
      </div>
    </div>
    <div class="input-field-wrapper">
      <div class="input-field">
        <label for="postal-code">Postal Code: *</label>
        <span>
          <Field type="text" :rules="isValidString" name="postal-code" id="postal-code"
            v-model="userSignupData.postalCode" />
          <ErrorMessage name="postal-code" class="error-field" />
        </span>
      </div>
    </div>

    <div class="continue-buttons">
      <button class="signup-button mt-0" type="button" @click="$emit('goBack')">
        Go Back
      </button>
      <button class="signup-button mt-0 address-section-button" type="submit">
        Continue
      </button>
    </div>
  </Form>
</template>

<script lang="ts" setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import axios from "axios";
import { UserData, AddressDetails } from "../../types/types";
import { onMounted, ref } from "vue";
import { isValidString, isNotEmpty } from "../../utils/validators";
const { userSignupData } = defineProps<{
  userSignupData: UserData;
}>();

const emits = defineEmits(["continue", "goBack"]);

const countries = ref<AddressDetails[]>([
  {
    name: "Default",
    code: "Default",
  },
]);
const states = ref<AddressDetails[]>([
  {
    name: "Default",
    code: "Default",
  },
]);
const cities = ref<AddressDetails[]>([
  {
    name: "Default",
    code: "Default",
  },
]);

function countryChanged() {
  let realCountryData = countries.value?.filter(
    (country) => userSignupData.country === country.name
  );

  axios
    .get(
      `${import.meta.env.VITE_API_URL}/api/getStateFromCountry`,
      {
        params: { realCountryData },
      }
    )
    .then((res) => {
      states.value = res.data;
      cities.value = [];
    })
    .catch((err) => {
      console.log(err);
    });
}

function stateChanged() {
  let realCountryData = countries.value?.filter(
    (country) => userSignupData.country === country.name
  );

  let realStateData = states.value?.filter(
    (state) => userSignupData.state === state.name
  );

  axios
    .get(
      `${import.meta.env.VITE_API_URL}/api/getCityFromState`,
      {
        params: { realCountryData, realStateData },
      }
    )
    .then((res) => {
      cities.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

function progress() {
  emits("continue");
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

onMounted(() => {
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/allCountries`)
    .then((res) => {
      countries.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
});
</script>

<style scoped>
@import url("../../assets/styles/signup-page.css");

.input-field,
.work-email-section {
  height: 63px;
}

.input-field label,
.work-email-section label {
  /* margin-top: 0px; */
  align-items: center;
}
</style>
