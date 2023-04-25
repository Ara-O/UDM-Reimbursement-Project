<template>
  <section class="account-page">
    <!-- Img is a way you can embed images to your site,
      the ../ before the folder means that we are traversing file systems -->
    <div class="profile-logo-wrapper">
      <img
        src="../assets/profile-logo.png"
        alt="Profile picture logo"
        class="profile-logo"
      />
    </div>
    <br />
    <h3 class="account-title">Edit Account Information</h3>
    <br />
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
      <label for="phone-number">Phone Number:</label>
      <input
        type="text"
        name="Phone Number"
        id="phone-number"
        v-model="accountInfo.phoneNumber"
        required
      />
    </div>
    <div class="input-field">
      <label for="password">Password:</label>
      <input
        type="text"
        name="Password"
        id="password"
        v-model="accountInfo.password"
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
      <label for="city">City:</label>
      <input
        type="text"
        name="City"
        id="city"
        v-model="accountInfo.city"
        required
      />
    </div>
    <div class="input-field">
      <label for="state">State:</label>
      <input
        list="defaults"
        type="text"
        name="State"
        id="state"
        v-model="accountInfo.state"
        required
      />

      <datalist id="defaults">
          <option :value="state" v-for="state in states">
            {{ state }}
          </option>
        </datalist>
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
    <button class="button" @click="save">Save</button>
    <button class="button" @click="back">Back</button>
    <br />
    <h6 class="trademark-text">Made with love by the Duckateers TM</h6>
    <br />
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { reactive } from "vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

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
};

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
});

const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming"
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
  "Zimbabwe"
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
input {
  outline: none;
}

.account-page {
  padding: 70px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  flex-direction: column;
}

.account-title {
  font-weight: 600;
  font-size: 25px;
}

.profile-logo {
  width: 100px;
  padding: 40px 20px;
}

.profile-logo-wrapper {
  border: 1px solid #ffffff;
  border-radius: 9999px;
  height: 140px;
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 9px rgba(184, 184, 184, 0.38);
}

.input-field {
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 450px;
  justify-content: space-between;
}

.input-field input {
  margin-left: 30px;
  padding-left: 20px;
  width: 224px;
  height: 36px;
  background: #ffffff;
  border: 1px solid #f7f7f7;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.17);
  border-radius: 5px;
}

.input-field label {
  width: 140px;
  font-size: 14px;
}

.button {
  background-color: var(--udmercy-blue);
  color: white;
  padding: 10px 70px;
  border: solid 1px;
  width: 232px;
  height: 50px;
  margin-top: 20px;
  cursor: pointer;
  background: #a5093e;
  border-radius: 26px;
}

.trademark-text {
  font-family: "Poppins";
  font-weight: 400;
}

@media (max-width: 610px) {
  .input-field {
    flex-direction: column;
  }

  .input-field input {
    margin-left: 0px;
    text-align: center;
    padding-left: 0px;
  }
  .input-field label {
    width: auto;
    margin-bottom: 10px;
  }

  .profile-logo {
    width: 70px;
    padding: 40px 20px;
  }

  .profile-logo-wrapper {
    border: 1px solid #ffffff;
    border-radius: 9999px;
    height: 110px;
    padding: 30px;
  }
  .account-page {
    height: auto;
    padding-top: 30px;
    padding-bottom: 30px;
  }
}
</style>
