<template>
  <main class="xl:px-32 px-16 pt-10">
    <div class="flex items-center gap-4 cursor-pointer" @click="router.go(-1)">
      <img src="../assets/left-arrow.png" alt="Left arrow" class="w-4" />
      <h4 class="font-normal text-sm text-gray-600 hover:underline">Go back</h4>
    </div>

    <section class="mt-20" v-if="foapa_information.foapa_information" style="margin-bottom: 5vh">
      <h2 class="text-2xl font-semibold">
        {{ formatFoapaDeails(foapa_information.foapa_information) }}
      </h2>
      <h3 class="font-semibold text-md mt-6">
        {{ foapa_information.foapa_information.description }}
      </h3>
      <h4 class="text-sm font-normal italic">
        Created at
        {{ parseDate(foapa_information.foapa_information.createdAt) }} - Last
        updated at
        {{ parseDate(foapa_information.foapa_information.updatedAt) }}
      </h4>

      <!-- STATISTICS -->
      <h2 class="text-xl font-semibold mt-10 underline">FOAPA Statistics</h2>
      <article class="flex gap-4 flex-wrap">
        <div class="border box-border px-5 py-3 border-solid border-gray-200 max-w-xl w-72 mt-5">
          <p class="text-sm font-medium">Total Requests Funded</p>
          <p class="font-semibold text-md">
            {{ foapa_information.claims_used.length }}
          </p>
        </div>
        <div class="border box-border px-5 py-3 border-solid border-gray-200 max-w-xl w-72 mt-5">
          <p class="text-sm font-medium">Total Amount Used from FOAPA</p>
          <p class="font-semibold text-md">${{ totalAmountUsed }}</p>
        </div>
      </article>

      <!-- HISTORY -->
      <h2 class="text-xl font-semibold mt-12 underline">Foapa Usage History</h2>
      <p class="text-sm leading-7">
        Keep track of the reimbursement claims that you have used by this FOAPA
      </p>

      <!-- Search field -->
      <span class="flex items-center gap-3">
        <input type="text" v-model="search_item" placeholder="Search by name"
          class="border border-gray-200 px-4 border-solid w-full max-w-96 h-8 rounded-md" />
        <img :src="SearchIcon" class="invert w-6 opacity-50 cursor-pointer" alt="Search icon" />
      </span>
      <div class="mt-3 gap-4 hidden sm:flex">
        <p class="hover:underline text-center cursor-pointer px-4 text-xs py-3 rounded-full bg-udmercy-blue text-white"
          @click="sortParam = 'COST ASC'">
          Sort by cost (ASC)
        </p>
        <p class="hover:underline text-center cursor-pointer px-4 text-xs py-3 rounded-full bg-udmercy-blue text-white"
          @click="sortParam = 'COST DESC'">
          Sort by cost (DESC)
        </p>

        <p class="hover:underline text-center cursor-pointer px-4 text-xs py-3 rounded-full bg-udmercy-blue text-white"
          @click="sortParam = 'NAME ASC'">
          Sort by name (ASC)
        </p>
        <p class="hover:underline text-center cursor-pointer px-4 text-xs py-3 rounded-full bg-udmercy-blue text-white"
          @click="sortParam = 'NAME DESC'">
          Sort by name (DESC)
        </p>
      </div>
      <div class="mt-3">
        <img :src="ListView" alt="List view" @click="view = 'List'" class="invert w-4 cursor-pointer opacity-50" />
        <img :src="GridView" alt="Grid view" class="invert ml-3 w-3 cursor-pointer opacity-50" @click="view = 'Grid'" />
        <img :src="TableView" alt="Table View" @click="view = 'Table'" class="w-3 ml-4 cursor-pointer opacity-50" />
      </div>
      <div class="mb-0">
        <p class="mb-0 text-sm leading-7">
          Note: Clicking the name of a reimbursement request below will take you
          to the page where you can edit the request
        </p>
      </div>
      <div v-if="
        Object.keys(foapa_information.claims_used).length !== 0 &&
        view !== 'Table'
      " class="flex gap-4 mb-16 flex-wrap">
        <div v-for="claim in foapaHistoryFiltered"
          class="border box-border px-5 py-3 border-solid border-gray-200 max-w-xl w-80 h-32 flex flex-col justify-center overflow-auto mt-5"
          v-if="view !== 'Table'">
          <div class="flex justify-between">
            <h3
              class="text-[15px] my-0 cursor-pointer whitespace-nowrap max-w-64 overflow-hidden text-ellipsis font-semibold text-gray-900"
              @click="() => goToReimbursement(claim._id)" :title="claim.reimbursementName + ' - ' + claim.reimbursementStatus
                ">
              {{ claim.reimbursementName }} - {{ claim.reimbursementStatus }}
            </h3>
            <p class="text-[14px]" v-if="view === 'List'">
              ${{ parseAmount(claim) }}
            </p>
          </div>

          <p class="text-sm leading-7 mt-2 mb-0" v-if="view === 'Grid'">
            Total cost: ${{ claim.totalCost }}
          </p>
          <p class="text-sm leading-7 mt-1 mb-0">
            FOAPA usage: ${{ parseAmount(claim) }}
          </p>
        </div>
      </div>
      <div style="margin-bottom: 30px" class="mt-5" v-if="view === 'Table' && foapaHistoryFiltered.length !== 0">
        <table class="table border-1">
          <thead>
            <tr>
              <th class="font-medium border-2 text-sm">Title</th>
              <th class="font-medium border-2 text-sm">Cost</th>
              <th class="font-medium border-2 text-sm">Status</th>
              <th class="font-medium border-2 text-sm">Date Created</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="foapa in foapaHistoryFiltered">
              <td @click="() => goToReimbursement(foapa._id)" class="cursor-pointer text-sm border-2">
                {{ foapa.reimbursementName }}
              </td>
              <td class="text-sm border-2">${{ foapa.totalCost }}</td>
              <td class="text-sm border-2">
                {{ foapa.reimbursementStatus }}
              </td>
              <td class="text-sm border-2">
                {{ parseDate(foapa.reimbursementDate) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3 v-if="foapaHistoryFiltered.length === 0" class="text-sm font-normal italic">
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
import ListView from "../assets/list-view.png";
import GridView from "../assets/grid-view.png";
import TableView from "../assets/table.png";
import { useRoute, useRouter } from "vue-router";
import { formatFoapaDeails } from "../utils/formatFoapaDetails";

const route = useRoute();
const router = useRouter();

let foapa_information = ref<any>({});
let view = ref<string>("Grid");
let search_item = ref<string>("");

let sortParam = ref<
  "COST ASC" | "COST DESC" | "NAME ASC" | "NAME DESC" | "NONE"
>("NONE");

const foapaHistoryFiltered = computed(() => {
  if (Object.keys(foapa_information.value).length == 0) {
    return [];
  }
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

const totalAmountUsed = computed(() => {
  let totalAmount = 0;

  //Loop through all the claims the foapa is used in,
  //for each claim, match the foapa id out of the list of the foapas used in the claim
  //and add its cost - the amount spent from it to the totalAmount
  foapa_information.value.claims_used.forEach((claim) => {
    claim.foapaDetails.forEach((foapa) => {
      if (foapa.foapa_id === route.params.id) {
        totalAmount += foapa.cost;
      }
    });
  });

  return totalAmount;
});

function parseDate(dateString: string) {
  if (!dateString) return;
  const year = dateString.split("-")[0];
  const month = dateString.split("-")[1];
  const day = dateString.split("-")[2].substring(0, 2);
  const formattedDate = month + "/" + day + "/" + year;

  // console.log(dateString);
  return formattedDate;
}

function parseAmount(claim) {
  const found_claim = claim.foapaDetails.find(
    (foapa) => foapa.foapa_id === route.params.id
  );

  return found_claim.cost;
}

function goToReimbursement(reimbursementId) {
  router.push({ path: "/add-reimbursement", query: { reimbursementId } });
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
<style>
table,
th,
td {
  border: 3px solid black;
  border-collapse: collapse;
  padding: 1rem;
  font-size: 1rem;
}

th {
  background-color: #002d72;
  color: white;
}
</style>
