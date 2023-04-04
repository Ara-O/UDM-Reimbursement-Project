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
    <h3 class="signup-page-title">Sign up page</h3>
    <br />
    <div class="input-field">
      <label for="first-name">First Name: </label>
      <input type="text" name="First name" id="first-name" />
    </div>
    <div class="input-field">
      <label for="last-name">Last Name: </label>
      <input type="text" name="Last Name" id="last-name" />
    </div>
    <div class="input-field">
      <label for="work-email">Work Email: </label>
      <input type="text" name="Work Email" id="work-email" />
    </div>
    <div class="input-field">
      <label for="employment-number">Employment Number: </label>
      <input type="text" name="Employment Number" id="employment-number" />
    </div>
    <div class="input-field">
      <label for="department">Department:</label>
      <input type="text" name="Department" id="department" />
    </div>
    <div class="input-field">
      <label for="mailing-address">Mailing Address:</label>
      <input type="text" name="Mailing Address" id="mailing-address" />
    </div>
  </section>
</template>

<script lang="ts" setup></script>

<style scoped>
.signup-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
}

.signup-page-title {
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
  width: 450px;
  justify-content: space-between;
}

.input-field input {
  margin-left: 30px;
  width: 224px;
  height: 36px;
  background: #ffffff;
  border: 1px solid #f7f7f7;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.17);
  border-radius: 5px;
}
</style>
