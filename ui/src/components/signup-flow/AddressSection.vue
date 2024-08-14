<template>
  <Form @submit="progress">
    <div class="input-field-wrapper">
      <div class="input-field">
        <label for="country">Country: *</label>
        <span>
          <Field
            name="country"
            id="country"
            as="select"
            :rules="isValidString"
            v-model="selectedCountry"
          >
            <option :value="country" v-for="country in countries">
              {{ country }}
            </option>
          </Field>
          <ErrorMessage name="country" class="error-field" />
        </span>
      </div>

      <div class="input-field">
        <label for="state">State: *</label>
        <span>
          <Field
            name="state"
            id="state"
            as="select"
            :rules="isValidString"
            :disabled="selectedCountry === ''"
            v-model="selectedState"
          >
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
          <Field
            name="city"
            id="city"
            :rules="isNotEmpty"
            as="select"
            :disabled="selectedState === ''"
            v-model="selectedCity"
          >
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
          <Field
            type="text"
            :rules="isValidString"
            name="mailing-address"
            id="mailing-address"
            v-model="userSignupData.mailingAddress"
          />
          <ErrorMessage name="mailing-address" class="error-field" />
        </span>
      </div>
    </div>
    <div class="input-field-wrapper">
      <div class="input-field">
        <label for="postal-code">Postal Code: *</label>
        <span>
          <Field
            type="text"
            :rules="isValidString"
            name="postal-code"
            id="postal-code"
            v-model="userSignupData.postalCode"
          />
          <ErrorMessage name="postal-code" class="error-field" />
        </span>
      </div>
    </div>

    <div class="continue-buttons">
      <button class="signup-button mt-0" type="button" @click="$emit('goBack')">
        Go Back
      </button>
      <button class="signup-button mt-0 address-section-button" type="submit">
        Create Account
      </button>
    </div>
  </Form>
</template>

<script lang="ts" setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import axios from "axios";
import { UserData, AddressDetails } from "../../types/types";
import { onMounted, ref, watch } from "vue";
import { isValidString, isNotEmpty } from "../../utils/validators";
import { TYPE, useToast } from "vue-toastification";
const { userSignupData } = defineProps<{
  userSignupData: UserData;
}>();

const selectedCountry = ref<string>("");
const selectedState = ref<string>("");
const selectedCity = ref<string>("");
const emits = defineEmits(["continue", "goBack"]);

const countries = ref<string[]>(["United States", "Canada"]);
const states = ref<AddressDetails[]>([]);
const cities = ref<AddressDetails[]>([
  {
    name: "Default",
    code: "Default",
  },
]);

const toast = useToast();
const countryCode = {
  Canada: "CA",
  "United States": "US",
};

watch(selectedCountry, () => countryChanged());
watch(selectedState, () => stateChanged());

async function countryChanged() {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/get-state-from-country`,
      {
        params: { countryCode: countryCode[selectedCountry.value] },
      }
    );

    states.value = res.data;
    cities.value = [];
  } catch (err) {
    toast("There was an error fetching the states. Please try again later", {
      type: TYPE.ERROR,
    });
  }
}

async function stateChanged() {
  try {
    const stateCode = states.value.find(
      (state) => state.name === selectedState.value
    )?.code;

    let res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/get-city-from-state`,
      {
        params: { stateCode },
      }
    );

    cities.value = res.data;
  } catch (err: any) {
    toast("There was an error fetching the cities. Please try again later", {
      type: TYPE.ERROR,
    });
  }
}

function progress() {
  userSignupData.country = selectedCountry.value;
  userSignupData.city = selectedCity.value;
  userSignupData.state = selectedState.value;
  emits("continue");
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

onMounted(() => {});
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
