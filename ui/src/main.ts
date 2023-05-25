import { createApp } from "vue";
import Router from "./router/index";
import "./style.css";
import App from "./App.vue";
import axios from "axios";

if (localStorage.getItem("token")?.length ?? 0 > 0) {
  axios.defaults.headers.common["authorization"] =
    localStorage.getItem("token");
} else {
  console.log("not logged in");
}

createApp(App).use(Router).mount("#app");
