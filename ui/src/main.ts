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

const pinia = createPinia()

createApp(App).use(Router).use(pinia).mount("#app");
