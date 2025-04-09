<template>
  <h3 class="text-base font-semibold mt-5">User Information</h3>
  <div class="flex items-center justify-start gap-5 mt-7 relative">
    <img :src="DetroitMercyLogo" alt="Detroit Mercy Logo" class="w-16" />
    <span class="flex flex-col gap-1">
      <skeleton v-if="!user_information_has_loaded" height="20px"></skeleton>
      <p
        title="Hello :D"
        class="text-sm my-0 h-5 font-semibold max-w-32 whitespace-nowrap overflow-hidden text-ellipsis"
        v-else
      >
        {{ user_information_data?.full_name || "Error" }}
      </p>
      <skeleton
        v-if="!user_information_has_loaded"
        height="20px"
        width="60px"
      ></skeleton>
      <p class="text-nm my-0 font-medium h-5" v-else>
        {{ user_information_data?.email_address || "Error" }}
      </p>
      <span class="flex gap-3">
        <router-link to="/account" class="underline my-0 text-xs text-black"
          >Manage account</router-link
        >
        <p
          @click="signOut"
          class="underline my-0 text-xs cursor-pointer text-black"
        >
          Sign Out
        </p>
      </span>
    </span>
    <div>
      <img
        :src="ThreeDots"
        @click="toggleMenu"
        alt="Three dots"
        class="w-5 opacity-50 absolute top-3.5 right-4 cursor-pointer"
      />

      <Popover ref="menu_ref">
        <div class="flex flex-col gap-4">
          <div>
            <span class="font-medium text-[14.5px] block underline mb-2"
              >Menu</span
            >
            <router-link to="/account" class="text-inherit no-underline">
              <p class="text-[13px] hover:underline cursor-pointer">
                View Archived Requests
              </p>
            </router-link>
            <router-link
              to="/change-password"
              class="text-inherit no-underline"
            >
              <p class="text-[13px] hover:underline cursor-pointer">
                Change Password
              </p>
            </router-link>
          </div>
        </div>
      </Popover>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, watch } from "vue";
import ThreeDots from "../../assets/three-dots.png";
import DetroitMercyLogo from "../../assets/detroit-mercy-logo.png";
import Skeleton from "primevue/skeleton";
import { UserInformationSummary } from "../../types/types";
import { useRouter } from "vue-router";
import Popover from "primevue/popover";
import { useToast, TYPE } from "vue-toastification";

const user_information_has_loaded = ref<boolean>(false);

const user_information_data = inject<null | UserInformationSummary>(
  "user_information_data"
);

const router = useRouter();
const toast = useToast();
const menu_ref = ref();

watch(user_information_data as object, (newValue) => {
  user_information_has_loaded.value = true;
});

function signOut() {
  localStorage.setItem("token", "");
  router.push("/");
  toast("Successfully signed out!", {
    type: TYPE.SUCCESS,
  });
}

function toggleMenu(event) {
  menu_ref.value.toggle(event);
}
</script>
