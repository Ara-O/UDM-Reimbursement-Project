import { createRouter, createWebHistory, routerKey } from "vue-router";
import SignupPage from "../pages/signup_page.vue";
import CompleteVerificationPage from "../pages/signup_post_verification_page.vue";
import LoginPage from "../pages/login_page.vue";
import AccountPage from "../pages/account_page.vue";
import DashboardPage from "../pages/dashboard_page.vue";
import AddReimbursementPage from "../pages/add_reimbursement_page.vue";
import AddFoapaPage from "../pages/manage_foapa_details.vue";
import PasswordPage from "../pages/password_page.vue";
import ForgotPassword from "../pages/forgot_password_page.vue";
import MobileProfilePage from "../pages/profile_page.vue";
import PreVerificationPage from "../pages/signup_pre_verification_page.vue";
import FoapaInformationPage from "../pages/specific_foapa_detail_page.vue";
import ContactUsPage from "../pages/contact_us_page.vue";
import AdminPage from "../pages/admin_page.vue";
import axios from "axios";

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
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/foapa-information/:id",
      component: FoapaInformationPage,
      meta: {
        requiresAuth: true,
      },
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
      path: "/admin",
      component: AdminPage,
      meta: {
        requiresAuth: true,
      },
      beforeEnter: async (to, from, next) => {
        try {
          // Verify the user's admin status before allowing them to enter (this is called after the main beforeEach)
          const token = localStorage.getItem("token");
          let res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/role`,
            {
              params: {
                token: token,
              },
            }
          );

          const role = res.data.role;

          if (role === "ADMIN") {
            next();
          } else {
            next("/dashboard");
          }
        } catch (err) {
          console.log(err);
          next("/");
        }
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
      path: "/manage-foapa",
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
      path: "/contact",
      component: ContactUsPage,
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
