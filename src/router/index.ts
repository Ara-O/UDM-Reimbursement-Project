import { createRouter, createWebHistory } from "vue-router";
import SignupPage from "../pages/signup_page.vue";
import LoginPage from "../pages/login_page.vue";
import AccountPage from "../pages/account_page.vue";
import DashboardPage from "../pages/dashboard_page.vue";
import ReimbursementPage from "../pages/reimbursement_page.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: SignupPage,
    },
    {
      path: "/login",
      component: LoginPage,
    },
    {
      path: "/account",
      component: AccountPage,
    },
    {
      path: "/dashboard",
      component: DashboardPage,
    },
    {
      path: "/reimbursement",
      component: ReimbursementPage,
    },
  ],
});
