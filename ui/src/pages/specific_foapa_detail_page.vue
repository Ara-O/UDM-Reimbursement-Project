<template>
  <main class="xl:px-32 px-16 pt-10">
    <div class="flex items-center gap-4 cursor-pointer" @click="router.go(-1)">
      <img src="../assets/left-arrow.png" alt="Left arrow" class="w-4" />
      <h4 class="font-normal text-sm text-gray-600 hover:underline">Go back</h4>
    </div>

    <section class="mt-20" v-if="foapa_information.foapa_information">
      <h2 class="text-2xl font-semibold">
        UDMP: {{ formatUserFoapa(foapa_information.foapa_information) }}
      </h2>
      <h3 class="font-semibold text-md mt-6">
        {{ foapa_information.foapa_information.description }}
      </h3>
      <h3 class="font-normal text-[15px] leading-7">
        <p class="inline font-medium">Initial Amount:</p>
        ${{ foapa_information.foapa_information.initialAmount }} |
        <p class="inline font-medium">Current Amount:</p>
        : ${{ foapa_information.foapa_information.currentAmount }}
      </h3>
      <h3 class="font-normal mt-3 leading-7 text-[15px]">
        Pending Amount: ${{ foapa_information.foapa_information.pendingAmount }}
        - This is the amount of money waiting on reimbursements
      </h3>

      <h2 class="text-xl font-semibold mt-20 underline">History</h2>
      <p class="text-sm leading-7">
        Keep track of the reimbursement claims that you have used by this FOAPA
      </p>
      <div
        v-if="Object.keys(foapa_information.claims_used).length !== 0"
        class="flex gap-4"
      >
        <div
          v-for="claim in foapa_information.claims_used"
          class="border box-border px-5 py-3 border-solid border-gray-200 max-w-xl w-72 mt-6"
        >
          <h3 class="text-[15px] mt-2 font-semibold text-gray-900">
            {{ claim.reimbursementName }}
          </h3>
          <p class="text-sm">
            ${{ parseAmount(claim) }} was used in this claim
          </p>
          <p class="text-xs">Date: {{ parseDate(claim.reimbursementDate) }}</p>
        </div>
      </div>
      <h3 v-else class="text-sm font-normal italic">
        This FOAPA hasn't been used yet
      </h3>
    </section>
    <section class="mt-20" v-else>
      <h3 class="text-sm font-medium">Loading...</h3>
    </section>
  </main>
</template>

<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

let foapa_information = ref<any>({});

function formatUserFoapa(foapa) {
  return `${foapa.fund}-${foapa.organization || "XXXX"}-${foapa.account}-${
    foapa.program || "XXXX"
  }-${foapa.activity || "XXXX"}`;
}

function parseDate(dateString: string) {
  const dateParsed = new Date(dateString);
  const formattedDate = dateParsed.toISOString().slice(0, 10);
  return formattedDate;
}

function parseAmount(claim) {
  const found_claim = claim.foapaDetails.find(
    (foapa) => foapa.foapa_id === route.params.id
  );

  return found_claim.cost;
}

onMounted(() => {
  if (route.params.id === null) {
    router.push("/dashboard");
  }

  axios
    .get(`${import.meta.env.VITE_API_URL}/api/retrieve-foapa-detail`, {
      params: {
        foapa_id: route.params.id,
      },
    })
    .then((res) => {
      foapa_information.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
});
</script>
