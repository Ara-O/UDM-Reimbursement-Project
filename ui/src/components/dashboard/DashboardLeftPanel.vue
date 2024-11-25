<template>
  <section class="box-border px-7 py-5 border-r relative border-gray-100 border-0 border-solid">
    <user-information-summary></user-information-summary>
    <foapa-numbers-list></foapa-numbers-list>
    <h4 class="text-xs font-normal text-gray-400 absolute bottom-2">Made with love ♡</h4>
  </section>
</template>

<script lang="ts" setup>
import UserInformationSummary from "./UserInformationSummary.vue";
import FoapaNumbersList from "./FoapaNumbersList.vue";
</script>
