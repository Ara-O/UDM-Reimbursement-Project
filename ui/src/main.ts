import { createApp } from "vue";
import Router from "./router/index";
import App from "./App.vue";
import { configure } from "vee-validate";
import Toast, { POSITION, PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import "./style.css";
import { createPinia } from "pinia";

configure({
  validateOnChange: true,
  validateOnInput: true,
});

const toastOptions: PluginOptions = {
  transition: "Vue-Toastification__fade",
  position: POSITION.TOP_RIGHT,
  icon: false,
};

const pinia = createPinia();

createApp(App).use(Router).use(pinia).use(Toast, toastOptions).mount("#app");
