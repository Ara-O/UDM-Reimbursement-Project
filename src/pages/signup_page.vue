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
      <h3 class="signup-title-description" v-if="surveyProgress === 0">
        Basic Questions
      </h3>
      <h3 class="signup-title-description" v-if="surveyProgress === 1">
        Password Information
      </h3>
      <h3 class="signup-title-description" v-if="surveyProgress === 2">
        Address Information
      </h3>
      <h3 class="signup-title-description" v-if="surveyProgress === 3">
        User Foapa Information (Not Required)
      </h3>

      <section class="signup-form">
        <section v-show="surveyProgress === 0" class="signup-form">
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="first-name">First Name:*</label>
              <input
                type="text"
                name="First name"
                id="first-name"
                v-model="userSignupData.firstName"
              />
            </div>
            <div class="input-field">
              <label for="last-name">Last Name:*</label>
              <input
                type="text"
                name="Last Name"
                id="last-name"
                v-model="userSignupData.lastName"
              />
            </div>
            <div class="input-field">
              <label for="work-email">Work Email: *</label>
              <input
                type="email"
                name="Work Email"
                id="work-email"
                v-model="userSignupData.workEmail"
              />
            </div>
          </div>
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="employment-number">Employment Number: *</label>
              <span style="position: relative">
                <span
                  style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-51px, -50%);
                  "
                  ><h3
                    style="font-size: 14px; font-weight: 400; color: #474747"
                  >
                    T
                  </h3></span
                >
                <input
                  type="text"
                  name="Employment Number"
                  style="width: 130px; padding-left: 25px"
                  id="employment-number"
                  v-model="userSignupData.employmentNumber"
                />
              </span>
            </div>
            <div class="input-field">
              <label for="phone-number">Phone: *</label>
              <input
                type="text"
                name="Phone Number"
                id="phone-number"
                v-model="userSignupData.phoneNumber"
              />
            </div>

            <div class="input-field">
              <label for="department">Department: *</label>
              <input
                list="departmentList"
                type="text"
                name="Department"
                id="department"
                v-model="userSignupData.department"
              />
              <datalist id="departmentList">
                <option :value="department" v-for="department in departments">
                  {{ department }}
                </option>
              </datalist>
            </div>
          </div>
          <button
            class="signup-button"
            type="button"
            @click="finishedBasicQuestionsSection"
            style="margin-top: 0px"
          >
            Continue
          </button>
        </section>

        <!-- SECTION 2 -->
        <section v-show="surveyProgress === 1" class="signup-form">
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="password">Password: *</label>
              <input
                type="password"
                name="Password"
                id="password"
                v-model="userSignupData.password"
              />
            </div>
            <div class="input-field">
              <label for="reenter-password">Re-enter password: *</label>
              <input
                type="password"
                name="reenter-password"
                id="reenter-password"
                v-model="reEnteredPassword"
              />
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
            <button
              class="signup-button"
              type="button"
              style="margin-top: 0px"
              @click="finishedPasswordSection"
            >
              Continue
            </button>
          </div>
        </section>

        <!-- SECTION 3 -->
        <section v-show="surveyProgress === 2" class="signup-form">
          <div class="input-field-wrapper">
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
              <label for="city">City: *</label>
              <input
                type="text"
                name="City"
                id="city"
                v-model="userSignupData.city"
              />
            </div>
            <div class="input-field">
              <label for="state">State: *</label>
              <input
                list="states"
                type="text"
                name="State"
                id="state"
                v-model="userSignupData.state"
              />

              <datalist id="states">
                <option :value="state" v-for="state in states">
                  {{ state }}
                </option>
              </datalist>
            </div>
          </div>
          <div class="input-field-wrapper">
            <div class="input-field">
              <label for="zip-code">Postal Code: *</label>
              <input
                type="number"
                name="Postal Code"
                id="zip-code"
                v-model="userSignupData.zipCode"
              />
            </div>
            <div class="input-field">
              <label for="country">Country: *</label>
              <input
                list="countries"
                type="text"
                name="Country"
                id="country"
                v-model="userSignupData.country"
              />

              <datalist id="countries">
                <option :value="country" v-for="country in countries">
                  {{ country }}
                </option>
              </datalist>
            </div>
          </div>

          <div class="continue-buttons">
            <button
              class="signup-button"
              type="button"
              @click="surveyProgress = 1"
              style="margin-top: 0px"
            >
              Go Back
            </button>
            <button
              class="signup-button"
              type="button"
              style="margin-top: 0px"
              @click="finishedAddressSection"
            >
              Continue
            </button>
          </div>
        </section>

        <!-- SECTION 4 -->
        <section v-show="surveyProgress === 3" class="signup-form">
          <div>
            <div>
              <label for="foapa-numbers"
                >FOAPA [ FUND - ORG - ACCT - PROG - ACTV ]:</label
              >
            </div>
            <br />
            <div class="input-field-foapa-wrapper">
              <div class="input-FOAPA-field">
                <label for="foapa-name">FOAPA Name</label>
                <input
                  type="text"
                  style="width: 150px"
                  placeholder="FOAPA Name"
                  name="FOAPA Name"
                  id="foapa-name"
                  v-model="userFoapaStuff.foapaName"
                />
              </div>
              <h5>-</h5>

              <div class="input-FOAPA-field">
                <label for="foapa-name">FUND</label>

                <input
                  type="text"
                  name="F input"
                  id="f-input"
                  placeholder="xxxxxx"
                  v-model="userFoapaStuff.fNumber"
                />
              </div>
              <h5>-</h5>

              <div class="input-FOAPA-field">
                <label for="foapa-name">ORG</label>

                <input
                  type="text"
                  name="O input"
                  id="o-input"
                  placeholder="xxxx"
                  v-model="userFoapaStuff.oNumber"
                />
              </div>
              <h5>-</h5>
              <div class="input-FOAPA-field">
                <label for="foapa-name">ACCT</label>

                <input
                  type="text"
                  name="A input"
                  id="a-input"
                  placeholder="xxxx"
                  v-model="userFoapaStuff.aNumber"
                />
              </div>
              <h5>-</h5>

              <div class="input-FOAPA-field">
                <label for="foapa-name">PROG</label>

                <input
                  type="text"
                  name="P input"
                  id="p-input"
                  placeholder="xxxx"
                  v-model="userFoapaStuff.pNumber"
                />
              </div>
              <h5>-</h5>
              <div class="input-FOAPA-field">
                <label for="foapa-name">ACTV</label>

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
            <div class="continue-buttons" style="margin-top: 20px">
              <button
                class="signup-button"
                type="button"
                @click="surveyProgress--"
                style="margin-top: 0px"
              >
                Go Back
              </button>
              <button
                class="signup-button"
                @click="registerUser"
                style="margin-top: 0px"
              >
                Create Account
              </button>
            </div>
          </div>
        </section>

        <router-link to="/" style="font-size: 14px; margin-top: -15px"
          >Already have an Account</router-link
        >
        <h5
          class="required-field-note"
          style="font-weight: 300; margin-top: -25px"
        >
          Note: All required fields must be filled
        </h5>
      </section>
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
  employmentNumber: string;
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

const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia (Czech Republic)",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini (fmr. 'Swaziland')",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Holy See",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (formerly Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste (East Timor)",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const departments = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Statistics",
  "Psychology",
  "Sociology",
  "Anthropology",
  "History",
  "Philosophy",
  "English",
  "Foreign Languages",
  "Business",
  "Economics",
  "Political Science",
  "Law",
  "Education",
  "Journalism",
  "Fine Arts",
  "Music",
  "Theater",
  "Architecture",
];

let userSignupData = reactive<UserData>({
  firstName: "",
  lastName: "",
  workEmail: "@udmercy.edu",
  employmentNumber: "",
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
// let userSignupData = reactive<UserData>({
//   firstName: "Ara",
//   lastName: "Ob",
//   workEmail: "bob@udmercy.edu",
//   employmentNumber: "3222",
//   department: "Comp sci",
//   mailingAddress: "120 fake street",
//   phoneNumber: "313-33-133",
//   password: "bob",
//   zipCode: 32233,
//   city: "det",
//   state: "mi",
//   country: "usa",
//   userFoapas: [],
// });

let userFoapaStuff = reactive<FoapaStuff>({
  fNumber: "",
  oNumber: "",
  aNumber: "",
  pNumber: "",
  a2Number: "",
  foapaName: "",
});

function addFoapa() {
  const foapaFields = ["fNumber", "oNumber", "aNumber", "pNumber", "a2Number"];
  for (let i = 0; i < foapaFields.length; i++) {
    if (userFoapaStuff[foapaFields[i]] === "") {
      alert("Some FOAPA information is missing, please try again.");
      break;
    }

    if (i === foapaFields.length - 1) {
      let currentFoapa = reactive<FoapaStuff>({
        fNumber: userFoapaStuff.fNumber,
        oNumber: userFoapaStuff.oNumber,
        aNumber: userFoapaStuff.aNumber,
        pNumber: userFoapaStuff.pNumber,
        a2Number: userFoapaStuff.a2Number,
        foapaName: userFoapaStuff.foapaName,
      });
      foapaList.value.push(currentFoapa);
      userFoapaStuff.foapaName =
        userFoapaStuff.fNumber =
        userFoapaStuff.oNumber =
        userFoapaStuff.aNumber =
        userFoapaStuff.pNumber =
        userFoapaStuff.a2Number =
          "";
    }
  }
}

function finishedAddressSection() {
  let dataShown = ["mailingAddress", "city", "state", "zipCode", "country"];
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
      surveyProgress.value++;
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }
}

function finishedBasicQuestionsSection() {
  //Manually doing it, going to use a better validation library next semester
  let dataShown = [
    "firstName",
    "lastName",
    "workEmail",
    "employmentNumber",
    "phoneNumber",
    "department",
  ];

  for (let i = 0; i < dataShown.length; i++) {
    if (userSignupData[dataShown[i]] === "") {
      console.log("field empty");
      alert(
        `The ${dataShown[i]
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} field is empty`
      );
      break;
    } else {
      if (i === dataShown.length - 1) {
        surveyProgress.value++;
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
       }
    }
  }
}

function finishedPasswordSection() {
  let dataShown = [
    "password"
  ];

  for (let i = 0; i < dataShown.length; i++) {
    if (userSignupData[dataShown[i]] === "") {
      console.log("password field empty");
      alert(
        `The ${dataShown[i]
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} field is empty`
      );
      break;
    }

    if (i === dataShown.length - 1) {
      if (reEnteredPassword.value !== userSignupData.password) {
        alert("Passwords do not match, please try again");
      } else {
        surveyProgress.value++;
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    }
  }
}

function registerUser() {
  //Calls the api/register function and passes the user data, if it was successful, push to the dashboard page
  //or else, alert the user of an error

  userSignupData.userFoapas = foapaList.value;
  if (!userSignupData.employmentNumber.toUpperCase().includes("T")) {
    userSignupData.employmentNumber = "T" + userSignupData.employmentNumber;
  }

  axios
    .post("/api/register", userSignupData)
    .then((res) => {
      alert(res.data.message);
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      router.push("/dashboard");
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.message);
    });
}

onMounted(() => {
  if (localStorage.getItem("token")?.length ?? 0 > 0) {
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    console.log("user is already signed in");
    router.push("/dashboard");
  }
});
</script>

<style scoped>
@import url("../assets/styles/signup-page.css");
</style>
