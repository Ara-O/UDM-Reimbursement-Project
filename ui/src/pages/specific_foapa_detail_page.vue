<template>
  <main class="xl:px-32 px-16 pt-10">
    <div class="flex items-center gap-4 cursor-pointer" @click="router.go(-1)">
      <img src="../assets/left-arrow.png" alt="Left arrow" class="w-4" />
      <h4 class="font-normal text-sm text-gray-600 hover:underline">Go back</h4>
    </div>

    <section class="mt-20">
      <h2 class="text-2xl font-semibold">
        UDMP: 302443-XXXX-2329-XXXX-2122-XXXX
      </h2>
      <h3 class="font-normal text-base mt-6">
        Initial Amount: $3000 | Current Amount: $2000
      </h3>
      <h3 class="font-normal text-base mt-3">
        Pending Amount: $4000 - This is the amount of money
      </h3>

      <h2 class="text-xl font-semibold mt-20 underline">History</h2>
      <p class="text-sm">Keep track of the expenses covered by this FOAPA</p>
      <div
        class="border box-border px-5 py-2 border-solid border-gray-200 max-w-sm mt-6"
      >
        <h3 class="text-sm mt-2 font-semibold text-gray-900">
          Conference - Lunch
        </h3>
        <p class="text-sm">Amount used: $300</p>
        <p class="text-xs">Date: 12/30/2023</p>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

console.log(route.params.id);

onMounted(() => {
  if (route.params.id === null) {
    router.push("/dashboard");
  }
});
</script>
