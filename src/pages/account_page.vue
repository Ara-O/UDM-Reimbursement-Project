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
                list="countries"
                type="text"
                name="Country"
                id="country"
                v-model="accountInfo.country"
                required
              />

              <datalist id="countries">
                <option :value="country" v-for="country in countries">
                  {{ country }}
                </option>
              </datalist>
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
                list="states"
                type="text"
                name="State"
                id="state"
                v-model="accountInfo.state"
                required
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
            <!-- <div class="input-field">
              <label for="password">Password:</label>
              <input
                type="password"
                name="Password"
                id="password"
                v-model="accountInfo.password"
                required
              />
            </div> -->
            <!-- <div class="input-field">
              <label for="reenter-password">Re-enter password:</label>
              <input
                type="password"
                name="reenter-password"
                id="reenter-password"
                v-model="reEnteredPassword"
                required
              />
            </div> -->
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
  firstName: string;
  lastName: string;
  workEmail: string;
  department: string;
  mailingAddress: string;
  phoneNumber: string;
  zipCode: number;
  city: string;
  state: string;
  country: string;
};

let foapaList = ref<FoapaStuff[]>([]);

let accountInfo = ref<UserData>({
  firstName: "",
  lastName: "",
  workEmail: "",
  department: "",
  mailingAddress: "",
  phoneNumber: "",
  zipCode: 0,
  city: "",
  state: "",
  country: "",
});

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
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

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

onMounted(() => {
  retrieveAccountInformation();
});
</script>

<style scoped>
@import url("../assets/styles/account-page.css");
</style>
