import { createRouter, createWebHistory } from "vue-router";
import SignupPage from "../pages/signup_page.vue";
import CompleteVerificationPage from "../pages/signup_post_verification_page.vue";
import LoginPage from "../pages/login_page.vue";
import AccountPage from "../pages/account_page.vue";
import DashboardPage from "../pages/dashboard_page.vue";
import AddReimbursementPage from "../pages/add_reimbursement_page.vue";
import AddFoapaPage from "../pages/add_foapa_page.vue";
import PasswordPage from "../pages/password_page.vue";
import ForgotPassword from "../pages/forgot_password_page.vue";
import MobileProfilePage from "../pages/profile_page.vue";
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
      path: "/profile-page",
      component: MobileProfilePage,
    },
    {
      path: "/complete-verification",
      component: CompleteVerificationPage,
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
    {
      path: "/add-foapa",
      component: AddFoapaPage,
    },
    {
      path: "/change-password",
      component: PasswordPage,
    },
    {
      path: "/forgot-password/:userToken",
      component: ForgotPassword,
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});
