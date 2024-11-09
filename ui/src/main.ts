import Router from "./router/index";
import App from "./App.vue";
import Toast, { POSITION, PluginOptions } from "vue-toastification";
import { createApp } from "vue";
import { configure } from "vee-validate";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import "vue-toastification/dist/index.css";
//@ts-ignore
import Aura from "@primevue/themes/aura";
import "./style.css";

configure({
  validateOnChange: true,
  validateOnInput: true,
});

const toastOptions: PluginOptions = {
  transition: "Vue-Toastification__fade",
  position: POSITION.TOP_RIGHT,
  icon: false,
};

//Before each route
Router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // If the user has a token and the page requires authentication, allow them to move on
    if (localStorage.getItem("token")?.length ?? 0 > 0) {
      next();
    } else {
      // If the user doeesnt have a token but the page requries auth, route them to the login page
      next("/");
    }
  } else {
    next();
  }
});

const pinia = createPinia();

createApp(App)
  .use(Router)
  .use(pinia)
  .use(Toast, toastOptions)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: "",
      },
    },
  })
  .mount("#app");
