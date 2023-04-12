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
  import { useRouter } from "vue-router";

  const router = useRouter();

  type UserData = {
  firstName: string;
  lastName: string;
  workEmail: string;
  department: string;
  mailingAddress: string;
  phoneNumber: string;
  password: string;
  zipCode: number;
  city: string;
  state: string;
  foapaNumber: string;
};

  let accountInfo = reactive<UserData>({
  firstName: "Bob",
  lastName: "Bobbington",
  workEmail: "Bob@gmail.com",
  department: "Comp sci",
  mailingAddress: "123 Fakt",
  phoneNumber: "313-313-3133",
  password: "bobby",
  zipCode: 32422,
  city: "detroit",
  state: "mi",
  foapaNumber: "100-1101-0111-0111",
});

  function back() {
    router.push("/dashboard");
  }

  function save(){
    axios
    .post("/api/register", accountInfo)
    .then(() => {
      alert("Account information updated!");
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.message);
    });
  }

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
