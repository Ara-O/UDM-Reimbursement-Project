<template>
  <section class="signup-page">
    <section class="left-section">
      <div class="udmercy-logo-wrapper">
        <img
          src="../assets/detroit-mercy-logo.png"
          alt="Detroit mercy logo"
          class="udmercy-logo"
          @click="$router.push('/dashboard')"
        />
      </div>
    </section>
    <section class="right-section">
      <div class="udmercy-logo-wrapper-mobile">
        <img
          src="../assets/detroit-mercy-logo.png"
          alt="Detroit mercy logo"
          class="udmercy-logo-mobile"
        />
      </div>
      <h3 class="signup-title">Detroit Mercy Reimbursement System</h3>

      <Form @submit="save" class="signup-form">
        <section class="signup-form">
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="first-name">First Name: </label>
              <span>
                <Field
                  type="text"
                  name="first-name"
                  :rules="isValidString"
                  id="first-name"
                  v-model="accountInfo.firstName"
                  required
                />
                <ErrorMessage name="first-name" class="error-field" />
              </span>
            </div>
            <div class="input-field">
              <label for="last-name">Last Name: </label>
              <span>
                <Field
                  :rules="isValidString"
                  type="text"
                  name="last-name"
                  id="last-name"
                  v-model="accountInfo.lastName"
                  required
                />
                <ErrorMessage name="last-name" class="error-field" />
              </span>
            </div>
            <div class="input-field">
              <label for="work-email">Work Email: </label>
              <input
                type="email"
                name="Work Email"
                id="work-email"
                v-model="accountInfo.workEmail"
                required
                disabled
              />
            </div>
          </div>
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="employment-number" style="padding-top: 0px"
                >Employment Number:
              </label>
              <span style="gap: 0px">
                <span class="relative">
                  <span class="employment-number-section">
                    <h3>T</h3>
                  </span>
                </span>
                <span>
                  <Field
                    type="text"
                    name="employment-number"
                    :rules="isValidNumber"
                    id="employment-number"
                    v-model="accountInfo.employmentNumber"
                    required
                  />
                  <ErrorMessage
                    name="employment-number"
                    style="font-size: 11px; position: relative"
                    class="error-field"
                  />
                </span>
              </span>
            </div>
            <div class="input-field">
              <label for="phone-number" class="pt-0" style="padding-top: 0px"
                >Phone Number:*</label
              >
              <span>
                <Field
                  type="text"
                  name="phone-number"
                  id="phone-number"
                  :rules="isValidNumber"
                  v-model="accountInfo.phoneNumber"
                />
                <ErrorMessage name="phone-number" class="error-field" />
              </span>
            </div>
            <div class="input-field">
              <label for="department">Department:</label>
              <span>
                <Field
                  name="department"
                  id="department"
                  as="select"
                  v-model="accountInfo.department"
                >
                  <option :value="department" v-for="department in departments">
                    {{ department }}
                  </option>
                </Field>
                <ErrorMessage name="department" class="error-field" />
              </span>
            </div>
          </div>
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="country">Country:</label>
              <span>
                <Field
                  name="country"
                  id="country"
                  as="select"
                  :rules="isValidString"
                  v-model="accountInfo.country"
                  @change="countryChanged"
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
                  :disabled="accountInfo.country === ''"
                  v-model="accountInfo.state"
                  @change="stateChanged"
                >
                  <option :value="state.name" v-for="state in states">
                    {{ state.name }}
                  </option>
                </Field>
                <ErrorMessage name="state" class="error-field" />
              </span>
            </div>
            <div class="input-field">
              <label for="city">City: *</label>
              <span>
                <Field
                  name="city"
                  id="city"
                  :rules="isNotEmpty"
                  as="select"
                  v-model="accountInfo.city"
                  :disabled="accountInfo.state === ''"
                >
                  <option :value="city.name" v-for="city in cities">
                    {{ city.name }}
                  </option>
                </Field>
                <ErrorMessage name="city" class="error-field" />
              </span>
            </div>
          </div>
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="mailing-address" style="padding-top: 0px"
                >Mailing Address: *</label
              >
              <span>
                <Field
                  type="text"
                  :rules="isValidString"
                  name="mailing-address"
                  id="mailing-address"
                  v-model="accountInfo.mailingAddress"
                />
                <ErrorMessage name="mailing-address" class="error-field" />
              </span>
            </div>

            <div class="input-field">
              <label for="postal-code" style="padding-top: 0px"
                >Postal Code: *</label
              >
              <span>
                <Field
                  type="text"
                  :rules="isValidString"
                  name="postal-code"
                  id="postal-code"
                  v-model="accountInfo.postalCode"
                />
                <ErrorMessage name="postal-code" class="error-field" />
              </span>
            </div>
          </div>

          <div class="continue-buttons">
            <button
              class="signup-button"
              type="button"
              @click="back"
              style="margin-top: 0px"
            >
              Dashboard
            </button>
            <button class="signup-button" type="submit" style="margin-top: 0px">
              Update
            </button>
          </div>
          <!-- <h6 class="trademark-text">Made with love by the Duckateers TM</h6> -->
        </section>
      </Form>
      <h3 class="account-success-message" v-if="successMessage">
        {{ successMessage }}
      </h3>
      <h3 class="account-loading-message" v-if="loadingMessage">
        {{ loadingMessage }}
      </h3>
      <h3 class="account-error-message" v-if="errorMessage">
        {{ errorMessage }}
      </h3>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { Form, Field, ErrorMessage } from "vee-validate";

import axios from "axios";
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { UserDataAcct, AddressDetails } from "../types/types";
import { isNotEmpty, isValidNumber, isValidString } from "../utils/validators";

let successMessage = ref<string>("");
let loadingMessage = ref<string>("");
let errorMessage = ref<string>("");
const router = useRouter();
const departments = [
  "Dean's Office",
  "Biology",
  "Math",
  "Physics",
  "Chemistry and Biochemistry",
  "Pre-Health",
  "Civil Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Computing",
  "Professional Engineering",
  "Computer Science",
];

let accountInfo = ref<UserDataAcct>({
  firstName: "",
  lastName: "",
  workEmail: "",
  department: "",
  mailingAddress: "",
  phoneNumber: "",
  employmentNumber: "",
  postalCode: "",
  city: "",
  state: "",
  country: "",
});

const countries = ref<string[]>(["United States", "Canada"]);

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

function back() {
  router.push("/dashboard");
}

function save() {
  successMessage.value = "";
  errorMessage.value = "";
  loadingMessage.value = "Updating account data...";
  axios
    .post(`${import.meta.env.VITE_API_URL}/api/updateAccountInfo`, {
      accountInformation: accountInfo.value,
    })
    .then((res) => {
      loadingMessage.value = "";
      successMessage.value = res.data.message;
    })
    .catch((err) => {
      console.log(err);
      errorMessage.value = err.response.data.message;
    });
}

async function retrieveAccountInformation() {
  try {
    let res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/retrieve-account-information`
    );

    res.data.employmentNumber = res.data.employmentNumber.replace("T", "");
    accountInfo.value = res.data;
    countryChanged();
  } catch (err) {
    console.log(err);
  }
}

const countryCode = {
  Canada: "CA",
  "United States": "US",
};

function countryChanged() {
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/get-state-from-country`, {
      params: { countryCode: countryCode[accountInfo.value.country] },
    })
    .then((res) => {
      states.value = res.data;

      stateChanged();
    })
    .catch((err) => {
      console.log(err);
    });
}

function stateChanged() {
  let realStateData = states.value?.filter(
    (state) => accountInfo.value.state === state.name
  );

  axios
    .get(`${import.meta.env.VITE_API_URL}/api/get-city-from-state`, {
      params: { stateCode: realStateData[0].code },
    })
    .then((res) => {
      cities.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(() => {
  retrieveAccountInformation();
});
</script>

<style scoped>
@import url("../assets/styles/account-page.css");
</style>
