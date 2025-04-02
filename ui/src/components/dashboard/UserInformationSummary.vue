<template>
  <h3 class="text-base font-semibold mt-5">User Information</h3>
  <div class="flex items-center justify-start gap-5 mt-7">
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
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, watch } from "vue";
import DetroitMercyLogo from "../../assets/detroit-mercy-logo.png";
import Skeleton from "primevue/skeleton";
import { UserInformationSummary } from "../../types/types";
import { useRouter } from "vue-router";
import { useToast, TYPE } from "vue-toastification";

const user_information_has_loaded = ref<boolean>(false);

const user_information_data = inject<null | UserInformationSummary>(
  "user_information_data"
);

const router = useRouter();
const toast = useToast();

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
</script>
