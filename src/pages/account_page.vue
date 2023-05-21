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
              <label for="country">Country:</label>
              <input
                name="Country"
                id="country"
                v-model="accountInfo.country"
              />
            </div>
          </div>
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="work-email">Work Email: </label>
              <input
                type="email"
                name="Work Email"
                id="work-email"
                v-model="accountInfo.workEmail"
                required
              />
            </div>

            <div class="input-field">
              <label for="department">Department:</label>
              <input
                type="text"
                name="Department"
                id="department"
                v-model="accountInfo.department"
                required
              />
            </div>
            <div class="input-field">
              <label for="state">State:</label>
              <input
                name="State"
                id="state"
                :disabled="accountInfo.country === ''"
                v-model="accountInfo.state"
              />
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
              <label for="city">City:</label>
              <input
                type="text"
                name="City"
                id="city"
                v-model="accountInfo.city"
                required
              />
            </div>
          </div>

          <div class="input-field-wrapper">
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
let countries = ref<AddressDetails[]>();
let states = ref<AddressDetails[]>([]);

let accountInfo = ref<UserDataAcct>({
  firstName: "",
  lastName: "",
  workEmail: "",
  department: "",
  mailingAddress: "",
  phoneNumber: "",
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
    .post("/api/updateAccountInfo", accountInfo.value)
    .then((res) => {
      console.log(res.data);
      alert("Account information updated!");
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.message);
    });
}

function retrieveAccountInformation() {
  axios
    .get(`/api/retrieveAccountInformation`)
    .then((res) => {
      accountInfo.value = res.data;
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

function countryChanged() {
  let realCountryData = countries.value?.filter(
    (country: AddressDetails) => accountInfo.value.country === country.name
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

onMounted(() => {
  retrieveAccountInformation();
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
@import url("../assets/styles/account-page.css");
</style>
