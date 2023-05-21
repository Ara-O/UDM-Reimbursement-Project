<template>
  <div class="input-field-wrapper">
    <div class="input-field">
      <label for="country">Country: *</label>
      <select
        name="Country"
        id="country"
        v-model="userSignupData.country"
        @change="countryChanged"
      >
        <option :value="country.name" v-for="country in countries">
          {{ country.name }}
        </option>
      </select>
    </div>

    <div class="input-field">
      <label for="state">State: *</label>
      <select
        name="State"
        id="state"
        :disabled="userSignupData.country === ''"
        v-model="userSignupData.state"
      >
        <option :value="state.name" v-for="state in states">
          {{ state.name }}
        </option>
      </select>
    </div>
    <div class="input-field">
      <label for="city">City: *</label>
      <input
        type="text"
        name="City"
        id="city"
        v-model="userSignupData.city"
        :disabled="userSignupData.state === ''"
      />
    </div>

    <div class="input-field">
      <label for="street-address">Street Address: *</label>
      <input
        type="text"
        name="Street Address"
        id="street-address"
        v-model="userSignupData.mailingAddress"
      />
    </div>
    <div class="input-field">
      <label for="postal-code">Postal Code: *</label>
      <input
        type="text"
        name="Postal Code"
        id="postal-code"
        v-model="userSignupData.postalCode"
      />
    </div>
  </div>
  <div class="continue-buttons">
    <button
      class="signup-button"
      type="button"
      @click="$emit('goBack')"
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
import axios from "axios";
import { UserData } from "../../types/types";
import { onMounted, ref, watch } from "vue";

type AddressDetails = {
  name: String;
  code: String;
};

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

function countryChanged() {
  let realCountryData = countries.value?.filter(
    (country) => userSignupData.country === country.name
  );

  axios
    .get("/api/getStateFromCountry", { params: { realCountryData } })
    .then((res) => {
      console.log(res.data);
      states.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

function progress() {
  let dataShown = ["country", "state", "city", "mailingAddress", "zipCode"];
  for (let i = 0; i < dataShown.length; i++) {
    if (userSignupData[dataShown[i]] === "") {
      console.log("field empty");
      alert(
        `The ${dataShown[i]
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} field is empty`
      );
      break;
    }

    if (i === dataShown.length - 1) {
      emits("continue");
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }
}

onMounted(() => {
  axios
    .get("/api/allCountries")
    .then((res) => {
      console.log(res.data);
      countries.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
});
</script>

<style scoped>
@import url("../../assets/styles/signup-page.css");
</style>
