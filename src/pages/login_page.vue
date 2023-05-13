<template>
  <section class="login-page">
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
    <h3 class="login-title">Detroit Mercy Reimbursement System</h3>
    <br />
    <form @submit.prevent="loginUser" class="login-form">
      <div class="input-field">
        <label for="work-email">Work Email: </label>
        <input
          v-model="userInfo.workEmail"
          type="email"
          name="Work Email"
          id="work-email"
        />
      </div>
      <div class="input-field">
        <label for="password">Password:</label>
        <input
          v-model="userInfo.password"
          type="password"
          name="Password"
          id="password"
        />
      </div>
      <router-link to="/signup" style="font-size: 14px"
        >Create an Account</router-link
      >
      <button class="login-button">Login</button>
    </form>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
let userInfo = ref<any>({ workEmail: "", password: "" });

const router = useRouter();
function loginUser() {
  axios
    .post("/api/login", userInfo.value)
    .then((res) => {
      console.log(res);
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
    console.log("user is already signed in");
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    router.push("/dashboard");
  }
});
</script>

<style scoped>
input {
  outline: none;
}

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
}

.login-title {
  font-weight: 600;
  font-size: 25px;
  margin-bottom: 4px;
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

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.login-button {
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

@media (max-width: 610px) {
  .login-title {
    font-size: 20px;
    text-align: center;
    width: 350px;
    margin: 0px;
    line-height: 45px;
    margin-top: 0px;
  }
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
  .login-page {
    height: 95vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
