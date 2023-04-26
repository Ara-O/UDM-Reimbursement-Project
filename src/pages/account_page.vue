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
                v-model="accountInfo.fName"
                required
              />
            </div>
            <div class="input-field">
              <label for="last-name">Last Name: </label>
              <input
                type="text"
                name="Last Name"
                id="last-name"
                v-model="accountInfo.lName"
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
              <label for="street-address">Street Address:</label>
              <input
                type="text"
                name="Street Address"
                id="street-address"
                v-model="accountInfo.streetAddress"
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
          </div>
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="password">Password:</label>
              <input
                type="password"
                name="Password"
                id="password"
                v-model="accountInfo.password"
                required
              />
            </div>
            <div class="input-field">
              <label for="reenter-password">Re-enter password:</label>
              <input
                type="password"
                name="reenter-password"
                id="reenter-password"
                v-model="reEnteredPassword"
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
              <label for="state">State:</label>
              <input
                type="text"
                name="State"
                id="state"
                v-model="accountInfo.state"
                required
              />
            </div>
            <div class="input-field">
              <label for="zip-code">Zip Code:</label>
              <input
                type="number"
                name="Zip Code"
                id="zip-code"
                v-model="accountInfo.zipCode"
                required
              />
            </div>
            <div class="input-field">
              <label for="country">Country:</label>
              <input
                type="text"
                name="Country"
                id="country"
                v-model="accountInfo.country"
                required
              />
            </div>
          </div>
          <!-- IN CASE IN THE FUTURE, WE ADD FOAPA NUMBERS -->
          <!-- <div class="foapa-section">
            <div>
              <label for="foapa-numbers"
                >FOAPA [ FUND - ORG - ACCT - PROG - ACTV ]:</label
              >
            </div>
            <br />
            <div class="input-field-foapa-wrapper">
              <div class="input-FOAPA-field">
                <input
                  type="text"
                  style="width: 150px"
                  placeholder="FOAPA Name"
                  name="FOAPA Name"
                  id="foapa-name"
                  v-model="userFoapaStuff.foapaName"
                />
              </div>
              :
              <div class="input-FOAPA-field">
                <input
                  type="text"
                  name="F input"
                  id="f-input"
                  placeholder="xxxxxx"
                  v-model="userFoapaStuff.fNumber"
                />
              </div>
              -
              <div class="input-FOAPA-field">
                <input
                  type="text"
                  name="O input"
                  id="o-input"
                  placeholder="xxxx"
                  v-model="userFoapaStuff.oNumber"
                />
              </div>
              -
              <div class="input-FOAPA-field">
                <input
                  type="text"
                  name="A input"
                  id="a-input"
                  placeholder="xxxx"
                  v-model="userFoapaStuff.aNumber"
                />
              </div>
              -
              <div class="input-FOAPA-field">
                <input
                  type="text"
                  name="P input"
                  id="p-input"
                  placeholder="xxxx"
                  v-model="userFoapaStuff.pNumber"
                />
              </div>
              -
              <div class="input-FOAPA-field">
                <input
                  type="text"
                  name="A2 input"
                  id="a2-input"
                  placeholder="xxxx"
                  v-model="userFoapaStuff.a2Number"
                />
              </div>
              <button class="add-foapa-button" type="button" @click="addFoapa">
                <img
                  src="../assets/add-icon.png"
                  alt="add-icon"
                  style="width: 15px"
                />
              </button>
            </div>
            <br />
            <div
              v-for="(foapa, index) in foapaList"
              style="display: flex"
              class="added-foapa-number"
            >
              <h3 style="margin-right: 15px; font-weight: 500">
                #{{ index + 1 }}
              </h3>
              <h3>{{ foapa.foapaName }} : {{ foapa.fNumber }}</h3>
              <h3>-</h3>
              <h3>{{ foapa.oNumber }}</h3>
              <h3>-</h3>
              <h3>{{ foapa.aNumber }}</h3>
              <h3>-</h3>
              <h3>{{ foapa.pNumber }}</h3>
              <h3>-</h3>
              <h3>{{ foapa.a2Number }}</h3>
            </div>
          </div> -->
          <div class="continue-buttons">
            <button
              class="signup-button"
              type="button"
              @click="back"
              style="margin-top: 0px"
            >
              Go Back
            </button>
            <button class="signup-button" type="submit" style="margin-top: 0px">
              Save
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

type FoapaStuff = {
  fNumber: string;
  oNumber: string;
  aNumber: string;
  pNumber: string;
  a2Number: string;
  foapaName: string;
};
const router = useRouter();

type UserData = {
  fName: string;
  lName: string;
  workEmail: string;
  department: string;
  streetAddress: string;
  phoneNumber: string;
  password: string;
  zipCode: number;
  city: string;
  state: string;
  country: string;
};
let foapaList = ref<FoapaStuff[]>([]);
function addFoapa() {
  let currentFoapa = reactive<FoapaStuff>({
    fNumber: userFoapaStuff.fNumber,
    oNumber: userFoapaStuff.oNumber,
    aNumber: userFoapaStuff.aNumber,
    pNumber: userFoapaStuff.pNumber,
    a2Number: userFoapaStuff.a2Number,
    foapaName: userFoapaStuff.foapaName,
  });
  foapaList.value.push(currentFoapa);
}

let accountInfo = ref<UserData>({
  fName: "",
  lName: "",
  workEmail: "",
  department: "",
  streetAddress: "",
  phoneNumber: "",
  password: "",
  zipCode: 0,
  city: "",
  state: "",
  country: "",
});

let reEnteredPassword = ref<string>("");
let userFoapaStuff = reactive<FoapaStuff>({
  fNumber: "",
  oNumber: "",
  aNumber: "",
  pNumber: "",
  a2Number: "",
  foapaName: "",
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
  const storedEmploymentNumber = localStorage.getItem("employmentNumber");
  axios
    .get(`/api/retrieveAccountInfo`, {
      params: { employmentNumber: storedEmploymentNumber },
    })
    .then((res) => {
      accountInfo.value = res.data[0];
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(() => {
  if (localStorage.getItem("employmentNumber") === null) {
    console.log("no local storage item");
    // Commenting out cau
    router.push("/");
  } else {
    retrieveAccountInformation();
  }
});
</script>

<style scoped>
@import url("../assets/styles/account-page.css");
</style>
