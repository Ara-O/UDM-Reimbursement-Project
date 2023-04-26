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

      <form @submit.prevent="registerUser" class="signup-form">
        <section v-show="surveyProgress === 0" class="signup-form">
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="first-name">First Name:*</label>
              <input
                type="text"
                name="First name"
                id="first-name"
                v-model="userSignupData.firstName"
                required
              />
            </div>
            <div class="input-field">
              <label for="last-name">Last Name:*</label>
              <input
                type="text"
                name="Last Name"
                id="last-name"
                v-model="userSignupData.lastName"
                required
              />
            </div>
            <div class="input-field">
              <label for="work-email">Work Email: *</label>
              <input
                type="email"
                name="Work Email"
                id="work-email"
                placeholder="@udmercy.edu"
                v-model="userSignupData.workEmail"
                required
              />
            </div>
          </div>
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="employment-number">Employment Number: *</label>
              <input
                type="number"
                name="Employment Number"
                style="width: 90px"
                id="employment-number"
                v-model="userSignupData.employmentNumber"
                required
              />
            </div>
            <div class="input-field">
              <label for="phone-number">Phone: *</label>
              <input
                type="text"
                name="Phone Number"
                id="phone-number"
                v-model="userSignupData.phoneNumber"
                required
              />
            </div>
            <div class="input-field">
              <label for="street-address">Street Address: *</label>
              <input
                type="text"
                name="Street Address"
                id="street-address"
                v-model="userSignupData.mailingAddress"
                required
              />
            </div>
          </div>
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="department">Department: *</label>
              <input
                type="text"
                name="Department"
                id="department"
                v-model="userSignupData.department"
                required
              />
            </div>
            <div class="input-field">
              <label for="password">Password: *</label>
              <input
                type="password"
                name="Password"
                id="password"
                v-model="userSignupData.password"
                required
              />
            </div>
            <div class="input-field">
              <label for="reenter-password">Re-enter password: *</label>
              <input
                type="password"
                name="reenter-password"
                id="reenter-password"
                v-model="reEnteredPassword"
                required
              />
            </div>
          </div>
          <button
            class="signup-button"
            type="button"
            @click="surveyProgress = 1"
            style="margin-top: 0px"
          >
            Continue
          </button>
        </section>

        <!-- SECTION 2 -->
        <section v-show="surveyProgress === 1" class="signup-form">
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="city">City: *</label>
              <input
                type="text"
                name="City"
                id="city"
                v-model="userSignupData.city"
                required
              />
            </div>
            <div class="input-field">
              <label for="state">State: *</label>
              <input
                type="text"
                name="State"
                id="state"
                v-model="userSignupData.state"
                required
              />
            </div>
          </div>
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="zip-code">Zip Code: *</label>
              <input
                type="number"
                name="Zip Code"
                id="zip-code"
                v-model="userSignupData.zipCode"
                required
              />
            </div>
            <div class="input-field">
              <label for="country">Country: *</label>
              <input
                type="text"
                name="Country"
                id="country"
                v-model="userSignupData.country"
                required
              />
            </div>
          </div>
          <div class="foapa-section">
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
          </div>
          <div class="continue-buttons">
            <button
              class="signup-button"
              type="button"
              @click="surveyProgress = 0"
              style="margin-top: 0px"
            >
              Go Back
            </button>
            <button class="signup-button" type="submit" style="margin-top: 0px">
              Continue
            </button>
          </div>
        </section>

        <router-link
          to="/"
          style="font-size: 14px; margin-top: -15px"
          class="already-has-account"
          >Already have an Account</router-link
        >
        <h5 style="font-weight: 300; margin: 0px; margin-top: -25px">
          Note: All required fields must be filled
        </h5>
      </form>
    </section>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

type UserData = {
  firstName: string;
  lastName: string;
  workEmail: string;
  employmentNumber: number;
  department: string;
  mailingAddress: string;
  phoneNumber: string;
  password: string;
  zipCode: number;
  city: string;
  state: string;
  country: string;
  userFoapas: Array<FoapaStuff>;
};

type FoapaStuff = {
  fNumber: string;
  oNumber: string;
  aNumber: string;
  pNumber: string;
  a2Number: string;
  foapaName: string;
};

let reEnteredPassword = ref<string>("");
let surveyProgress = ref<number>(0);
let foapaList = ref<FoapaStuff[]>([]);

const router = useRouter();

let userSignupData = reactive<UserData>({
  firstName: "",
  lastName: "",
  workEmail: "",
  employmentNumber: 0,
  department: "",
  mailingAddress: "",
  phoneNumber: "",
  password: "",
  zipCode: 0,
  city: "",
  state: "",
  country: "",
  userFoapas: [],
});

let userFoapaStuff = reactive<FoapaStuff>({
  fNumber: "",
  oNumber: "",
  aNumber: "",
  pNumber: "",
  a2Number: "",
  foapaName: "",
});

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

function registerUser() {
  //Calls the api/register function and passes the user data, if it was successful, push to the dashboard page
  //or else, alert the user of an error

  if (reEnteredPassword.value === userSignupData.password) {
    userSignupData.userFoapas = foapaList.value;

    axios
      .post("/api/register", userSignupData)
      .then(() => {
        alert("User registration successful");
        localStorage.setItem(
          "employmentNumber",
          userSignupData.employmentNumber.toString()
        );
        router.push("/dashboard");
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  } else {
    alert("Passwords do not match, please try again");
  }
}

onMounted(() => {
  if (localStorage.getItem("employmentNumber")?.length ?? 0 > 0) {
    console.log("user is already signed in");
    router.push("/dashboard");
  }
});
</script>

<style scoped>
@import url("../assets/styles/signup-page.css");
</style>
