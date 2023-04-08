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
        />
      </div>
      <div class="input-field">
        <label for="work-email">Work Email: </label>
        <input
          type="email"
          name="Work Email"
          id="work-email"
          v-model="userSignupData.workEmail"
        />
      </div>
      <div class="input-field">
        <label for="employment-number">Employment Number: </label>
        <input
          type="number"
          name="Employment Number"
          id="employment-number"
          v-model="userSignupData.employmentNumber"
        />
      </div>
      <div class="input-field">
        <label for="department">Department:</label>
        <input
          type="text"
          name="Department"
          id="department"
          v-model="userSignupData.department"
        />
      </div>
      <div class="input-field">
        <label for="mailing-address">Mailing Address:</label>
        <input
          type="text"
          name="Mailing Address"
          id="mailing-address"
          v-model="userSignupData.mailingAddress"
        />
      </div>
      <div class="input-field">
        <label for="phone-number">Phone Number:</label>
        <input
          type="text"
          name="Phone Number"
          id="phone-number"
          v-model="userSignupData.phoneNumber"
        />
      </div>
      <div class="input-field">
        <label for="password">Password:</label>
        <input
          type="password"
          name="Password"
          id="password"
          v-model="userSignupData.password"
        />
      </div>
      <div class="input-field">
        <label for="foapa-numbers">FOAPA Numbers:</label>
        <input type="text" name="FOAPA Numbers" id="foapa-numbers" />
      </div>
      <div class="input-field">
        <label for="zip-code">Zip Code:</label>
        <input
          type="number"
          name="Zip Code"
          id="zip-code"
          v-model="userSignupData.zipCode"
        />
      </div>
      <div class="input-field">
        <label for="city">City:</label>
        <input
          type="text"
          name="City"
          id="city"
          v-model="userSignupData.city"
        />
      </div>
      <div class="input-field">
        <label for="state">State:</label>
        <input
          type="text"
          name="State"
          id="state"
          v-model="userSignupData.state"
        />
      </div>
      <button class="signup-button" type="submit">Continue</button>
    </form>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { reactive } from "vue";
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
};

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
});

function registerUser() {
  axios.post("/api/register", userSignupData).catch((err) => {
    console.log(err);
  });
}
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

.signup-button {
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
