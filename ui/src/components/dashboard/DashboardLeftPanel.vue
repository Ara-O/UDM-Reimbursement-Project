<template>
  <section
    class="box-border px-7 py-5 border-r relative border-gray-100 border-0 border-solid"
  >
    <user-information-summary></user-information-summary>
    <foapa-numbers-list></foapa-numbers-list>
    <!-- Admin Section -->
    <div class="text-center mt-4">
      <router-link
        to="/admin"
        class="text-nm text-black"
        v-if="user_information_data?.role === 'ADMIN'"
        >Go to Admin Dashboard</router-link
      >
    </div>
    <h4 class="text-xs font-normal text-gray-400 absolute bottom-2">
      Made with love ♡
    </h4>
  </section>
</template>

<script lang="ts" setup>
import UserInformationSummary from "./UserInformationSummary.vue";
import FoapaNumbersList from "./FoapaNumbersList.vue";
import { inject, onMounted, watch } from "vue";
import { UserInformationSummary as UserInformationSummaryType } from "../../types/types";

const user_information_data = inject<null | UserInformationSummaryType>(
  "user_information_data"
);

watch(user_information_data as object, (data) => {
  console.log(data);
});
</script>
