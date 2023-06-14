<template>
  <section class="signup-page">
    <section class="left-section">
      <div class="udmercy-logo-wrapper">
        <img
          src="../assets/detroit-mercy-logo.png"
          alt="Detroit mercy logo"
          class="udmercy-logo"
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

      <form @submit.prevent="save" class="signup-form">
        <section class="signup-form">
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="first-name">First Name: </label>
              <input
                type="text"
                name="First name"
                id="first-name"
                v-model="accountInfo.firstName"
                required
              />
            </div>
            <div class="input-field">
              <label for="last-name">Last Name: </label>
              <input
                type="text"
                name="Last Name"
                id="last-name"
                v-model="accountInfo.lastName"
                required
              />
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
              <label for="employment-number">Employment Number: </label>
              <input
                type="text"
                name="Employment Number"
                id="employment-number"
                v-model="accountInfo.employmentNumber"
                required
                disabled
              />
            </div>

            <div class="input-field">
              <label for="department">Department: *</label>
              <select
                name="Department"
                id="department"
                v-model="accountInfo.department"
                required
              >
                <option :value="department" v-for="department in departments">
                  {{ department }}
                </option>
              </select>
            </div>
            <div class="input-field">
              <label for="country">Country: *</label>
              <select
                name="Country"
                id="country"
                v-model="accountInfo.country"
                required
                @change="countryChanged"
              >
                <option :value="country.name" v-for="country in countries">
                  {{ country.name }}
                </option>
              </select>
            </div>
            <div class="input-field">
              <label for="mailing-address">Mailing Address:</label>
              <input
                type="text"
                name="Mailing Address"
                id="mailing-address"
                v-model="accountInfo.mailingAddress"
                required
              />
            </div>

            <div class="input-field">
              <label for="city">City: *</label>
              <select
                name="City"
                id="city"
                v-model="accountInfo.city"
                required
                :disabled="accountInfo.state === ''"
              >
                <option :value="city.name" v-for="city in cities">
                  {{ city.name }}
                </option>
              </select>
            </div>
            <div class="input-field">
              <label for="state">State: *</label>
              <select
                name="State"
                id="state"
                :disabled="accountInfo.country === ''"
                v-model="accountInfo.state"
                required
                @change="stateChanged"
              >
                <option :value="state.name" v-for="state in states">
                  {{ state.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="phone-number">Phone:</label>
              <input
                type="text"
                name="Phone Number"
                id="phone-number"
                v-model="accountInfo.phoneNumber"
                required
              />
            </div>
            <div class="input-field">
              <label for="postal-code">Postal Code:</label>
              <input
                type="text"
                name="Postal Code"
                id="postal-code"
                v-model="accountInfo.postalCode"
                required
              />
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
      </form>
    </section>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { UserDataAcct, AddressDetails } from "../types/types";

const router = useRouter();
const departments = [
  "Architectural Engineering",
  "Biochemistry",
  "Civil Engineering",
  "Computer Science",
  "Electrical Engineering",
  "Environmental Engineering",
  "Mathematics",
  "Mechanical Engineering",
  "Office of the Dean",
  "Physics",
  "Chemistry",
  "Robotics and Mechatronic Systems Engineering",
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

function back() {
  router.push("/dashboard");
}

function save() {
  axios
    .post("http://localhost:8080/api/updateAccountInfo", accountInfo.value)
    .then((res) => {
      console.log(res.data);
      alert("Account information updated!");
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.message);
    });
}

async function retrieveAccountInformation() {
  try {
    let res = await axios.get(
      "http://localhost:8080/api/retrieveAccountInformation"
    );
    accountInfo.value = res.data;

    let countriesFromApi = await axios.get(
      "http://localhost:8080/api/allCountries"
    );

    countries.value = countriesFromApi.data;
    countryChanged();
  } catch (err) {
    console.log(err);
  }
}

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
  console.log("account info", accountInfo.value);
  let realCountryData = countries.value?.filter(
    (country) => accountInfo.value.country === country.name
  );

  axios
    .get("http://localhost:8080/api/getStateFromCountry", {
      params: { realCountryData },
    })
    .then((res) => {
      console.log(res.data);
      states.value = res.data;
      stateChanged();
    })
    .catch((err) => {
      console.log(err);
    });
}

function stateChanged() {
  let realCountryData = countries.value?.filter(
    (country) => accountInfo.value.country === country.name
  );
  let realStateData = states.value?.filter(
    (state) => accountInfo.value.state === state.name
  );

  axios
    .get("http://localhost:8080/api/getCityFromState", {
      params: { realCountryData, realStateData },
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
