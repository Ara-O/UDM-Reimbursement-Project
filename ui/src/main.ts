import { createApp } from "vue";
import Router from "./router/index";
import "./style.css";
import App from "./App.vue";
import { configure } from "vee-validate";
import axios from "axios";
import { createPinia } from "pinia";
import router from "./router/index";

configure({
  validateOnChange: true,
  validateOnInput: true,
});

if (localStorage.getItem("token") !== null && (localStorage.getItem("token")?.length ?? 0 > 0)) {
  axios.defaults.headers.common["authorization"] =
    localStorage.getItem("token");
  console.log("User is logged in")
} else {
  console.log("User is not logged in");
  router.push("/")
}

const pinia = createPinia()

createApp(App).use(Router).use(pinia).mount("#app");
