<template>
  <div class="input-field-wrapper">
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
    <div class="input-field">
      <label for="city">City: *</label>
      <input type="text" name="City" id="city" v-model="userSignupData.city" />
    </div>
  </div>
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
      <label for="zip-code">Postal Code: *</label>
      <input
        type="number"
        name="Postal Code"
        id="zip-code"
        v-model="userSignupData.zipCode"
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
import { UserData } from "../../types/types";

const { userSignupData } = defineProps<{
  userSignupData: UserData;
}>();

const emits = defineEmits(["continue", "goBack"]);

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

function progress() {
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
      emits("continue");
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }
}
</script>

<style scoped>
@import url("../../assets/styles/signup-page.css");
</style>
