<template>
  <section class="signup-page">
    <!-- Img is a way you can embed images to your site,
    the ../ before the folder means that we are traversing file systems -->
    <div class="udmercy-logo-wrapper">
      <img
        src="../assets/detroit-mercy-logo.png"
        alt="Detroit mercy logo"
        class="udmercy-logo"
      />
    </div>
    <br />
    <h3 class="signup-title">Detroit Mercy Reimbursement System</h3>
    <br />
    <form @submit.prevent="registerUser" class="signup-form">
      <div class="input-field">
        <label for="first-name">First Name: </label>
        <input
          type="text"
          name="First name"
          id="first-name"
          v-model="userSignupData.firstName"
          required
        />
      </div>
      <div class="input-field">
        <label for="last-name">Last Name: </label>
        <input
          type="text"
          name="Last Name"
          id="last-name"
          v-model="userSignupData.lastName"
          required
        />
      </div>
      <div class="input-field">
        <label for="work-email">Work Email: </label>
        <input
          type="email"
          name="Work Email"
          id="work-email"
          v-model="userSignupData.workEmail"
          required
        />
      </div>
      <div class="input-field">
        <label for="employment-number">Employment Number: </label>
        <input
          type="number"
          name="Employment Number"
          id="employment-number"
          v-model="userSignupData.employmentNumber"
          required
        />
      </div>
      <div class="input-field">
        <label for="department">Department:</label>
        <input
          type="text"
          name="Department"
          id="department"
          v-model="userSignupData.department"
          required
        />
      </div>
      <div class="input-field">
        <label for="phone-number">Phone Number:</label>
        <input
        type="text"
        name="Phone Number"
        id="phone-number"
        v-model="userSignupData.phoneNumber"
        required
        />
      </div>
      <div class="input-field">
        <label for="password">Password:</label>
        <input
        type="password"
        name="Password"
        id="password"
        v-model="userSignupData.password"
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
      <!-- Store foapa numbers in their own table -->
      <div class="input-field">
        <label for="street-address">Street Address:</label>
        <input
        type="text"
        name="Street Address"
        id="street-address"
        v-model="userSignupData.mailingAddress"
        required
        />
      </div>
      <div class="input-field">
        <label for="city">City:</label>
        <input
        type="text"
        name="City"
        id="city"
        v-model="userSignupData.city"
        required
        />
      </div>
      <div class="input-field">
        <label for="state">State:</label>
        <input
        type="text"
        name="State"
        id="state"
        v-model="userSignupData.state"
        required
        />
      </div>
      <div class="input-field">
        <label for="zip-code">Zip Code:</label>
        <input
        type="number"
        name="Zip Code"
        id="zip-code"
        v-model="userSignupData.zipCode"
        required
        />
      </div>
      <div class="input-field">
        <label for="foapa-numbers">FOAPA:</label>
      </div>
      <span style="display:flex; width:500px; margin-left: -31px;">
        <div class="input-field">
          <input
          type="text"
          name="FOAPA Name"
          id="foapa-name"
          v-model="userSignupData.foapaName"
          style="width:125px"
          />
        </div>
        <div class="input-field">
          <input
          type="text"
          name="FOAPA Numbers"
          id="foapa-numbers"
          v-model="userSignupData.foapaNumber"
          />
        </div>
      </span>
      <button class="signup-button">
          Add FOAPA
      </button>
      <br><br>
      <button class="signup-button" type="submit">Continue</button>
      <br>
      <router-link to="/login" style="font-size: 14px"
      >Already have an Account</router-link
      >
      <br />
    </form>
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
  foapaNumber: string;
  foapaName: string;
};

let reEnteredPassword = ref<string>("");

const router = useRouter();

let userSignupData = reactive<UserData>({
  firstName: "Bob",
  lastName: "Bobbington",
  workEmail: "Bob@gmail.com",
  employmentNumber: 11010,
  department: "Comp sci",
  mailingAddress: "123 Fakt",
  phoneNumber: "313-313-3133",
  password: "bobby",
  zipCode: 32422,
  city: "detroit",
  state: "mi",
  foapaNumber: "100-1101-0111-0111",
  foapaName: "UDMP",
});

function registerUser() {
  //Calls the api/register function and passes the user data, if it was successful, push to the dashboard page
  //or else, alert the user of an error

  if (reEnteredPassword.value === userSignupData.password) {
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
  if (localStorage.getItem("employmentNumber")?.length ?? 0 >= 0) {
    console.log("user is already signed in");
    router.push("/dashboard");
  }
});
</script>

<style scoped>
input {
  outline: none;
}

.signup-page {
  padding: 70px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  flex-direction: column;
}

.signup-title {
  font-weight: 600;
  font-size: 25px;
  text-align: center;
}

.udmercy-logo {
  width: 100px;
  padding: 40px 20px;
}

.udmercy-logo-wrapper {
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
  width: 470px;
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
  width: 175px;
  font-size: 14px;
}

/* .add-foapa-button{
  background-color: var(--udmercy-red);
  color: white;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 20px;
} */

.add-foapa-button, .signup-button {
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

.signup-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 610px) {
  .input-field {
    flex-direction: column;
  }

  .signup-title {
    font-size: 20px;
    width: 350px;
    line-height: 45px;
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

  .udmercy-logo {
    width: 70px;
    padding: 40px 20px;
  }

  .udmercy-logo-wrapper {
    border: 1px solid #ffffff;
    border-radius: 9999px;
    height: 110px;
    padding: 30px;
  }
  .signup-page {
    height: auto;
    padding-top: 30px;
    padding-bottom: 30px;
  }
}
</style>
