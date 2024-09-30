<template>
  <main class="xl:px-32 px-16 pt-10">
    <div class="flex items-center gap-4 cursor-pointer" @click="router.go(-1)">
      <img src="../assets/left-arrow.png" alt="Left arrow" class="w-4" />
      <h4 class="font-normal text-sm text-gray-600 hover:underline">Go back</h4>
    </div>

    <section class="mt-20" v-if="foapa_information.foapa_information">
      <h2 class="text-2xl font-semibold">
        {{ formatUserFoapa(foapa_information.foapa_information) }}
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
        Pending Amount: ${{
          foapa_information.foapa_information.availableAmount
        }}
        - This is the amount of money waiting on reimbursements
      </h3>

      <h2 class="text-xl font-semibold mt-20 underline">History</h2>
      <p class="text-sm leading-7">
        Keep track of the reimbursement claims that you have used by this FOAPA
      </p>

      <!-- Search field -->
      <span class="flex items-center gap-3">
        <input
          type="text"
          v-model="search_item"
          placeholder="Search by name"
          class="border border-gray-200 px-4 border-solid w-full max-w-96 h-8 rounded-md"
        />
        <img
          :src="SearchIcon"
          class="invert w-6 opacity-50 cursor-pointer"
          alt="Search icon"
        />
      </span>
      <div class="flex mt-3 gap-4">
        <!-- <p
          class="text-sm hover:underline cursor-pointer"
          @click="filterParam = 'NONE'"
        >
          Remove Filters
        </p> -->
        <p
          class="hover:underline cursor-pointer px-4 text-xs py-3 rounded-full bg-udmercy-blue text-white"
          @click="sortParam = 'COST ASC'"
        >
          Sort by cost (ASC)
        </p>
        <p
          class="hover:underline cursor-pointer px-4 text-xs py-3 rounded-full bg-udmercy-blue text-white"
          @click="sortParam = 'COST DESC'"
        >
          Sort by cost (DESC)
        </p>

        <p
          class="hover:underline cursor-pointer px-4 text-xs py-3 rounded-full bg-udmercy-blue text-white"
          @click="sortParam = 'NAME ASC'"
        >
          Sort by name (ASC)
        </p>
        <p
          class="hover:underline cursor-pointer px-4 text-xs py-3 rounded-full bg-udmercy-blue text-white"
          @click="sortParam = 'NAME DESC'"
        >
          Sort by name (DESC)
        </p>
      </div>
      <div
        v-if="Object.keys(foapa_information.claims_used).length !== 0"
        class="flex gap-4"
      >
        <div
          v-for="claim in foapaHistoryFiltered"
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
import SearchIcon from "../assets/search-icon.png";
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

let foapa_information = ref<any>({});
// let foapaHistoryFiltered = ref<any>({})
let search_item = ref<string>("");

let sortParam = ref<
  "COST ASC" | "COST DESC" | "NAME ASC" | "NAME DESC" | "NONE"
>("NONE");

const foapaHistoryFiltered = computed(() => {
  let foapas = foapa_information.value.claims_used.filter((info) => {
    return info.reimbursementName
      .toLowerCase()
      .includes(search_item.value.toLowerCase());
  });

  if (sortParam.value === "COST ASC") {
    return foapas.sort((a, b) => parseAmount(a) - parseAmount(b));
  }

  if (sortParam.value === "COST DESC") {
    return foapas.sort((a, b) => parseAmount(b) - parseAmount(a));
  }

  if (sortParam.value === "NAME DESC") {
    return foapas.sort((a, b) => a.reimbursementName > b.reimbursementName);
  }

  if (sortParam.value === "NAME ASC") {
    return foapas.sort((a, b) => a.reimbursementName < b.reimbursementName);
  }

  if (sortParam.value === "NONE") {
    return foapas;
  }
});

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
