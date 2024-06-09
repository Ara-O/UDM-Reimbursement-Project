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
import PreVerificationPage from "../pages/signup_pre_verification_page.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: LoginPage,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")?.length ?? 0 > 0) {
          next("/dashboard");
        } else {
          next();
        }
      },
    },
    {
      path: "/signup",
      component: SignupPage,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")?.length ?? 0 > 0) {
          next("/dashboard");
        } else {
          next();
        }
      },
    },
    {
      path: "/profile-page",
      component: MobileProfilePage,
    },
    {
      path: "/complete-verification",
      component: CompleteVerificationPage,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")?.length ?? 0 > 0) {
          next("/dashboard");
        } else {
          next();
        }
      },
    },
    {
      path: "/verify-account",
      component: PreVerificationPage,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")?.length ?? 0 > 0) {
          next("dashboard");
        } else {
          next();
        }
      },
    },
    {
      path: "/account",
      component: AccountPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/dashboard",
      component: DashboardPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/add-reimbursement",
      component: AddReimbursementPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/add-foapa",
      component: AddFoapaPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/change-password",
      component: PasswordPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/forgot-password/:userToken",
      component: ForgotPassword,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")?.length ?? 0 > 0) {
          next("/dashboard");
        } else {
          next();
        }
      },
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});
