import { createRouter, createWebHistory } from "vue-router";
import SignupPage from "../pages/signup_page.vue";
import LoginPage from "../pages/login_page.vue";
import AccountPage from "../pages/account_page.vue";
import DashboardPage from "../pages/dashboard_page.vue";
import AddReimbursementPage from "../pages/add_reimbursement_page.vue";
export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: LoginPage,
    },
    {
      path: "/signup",
      component: SignupPage,
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
      path: "/add-reimbursement",
      component: AddReimbursementPage,
    },
  ],
});
