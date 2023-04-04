import { createRouter, createWebHistory } from "vue-router";
import SignupPage from "../pages/signup_page.vue";
export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: SignupPage,
    },
  ],
});
