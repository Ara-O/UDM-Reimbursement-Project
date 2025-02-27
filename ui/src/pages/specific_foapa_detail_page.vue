<template>
  <main class="xl:px-32 px-16 pt-10">
    <div class="flex items-center gap-4 cursor-pointer" @click="router.go(-1)">
      <img src="../assets/left-arrow.png" alt="Left arrow" class="w-4" />
      <h4 class="font-normal text-sm text-gray-600 hover:underline">Go back</h4>
    </div>

    <section
      class="mt-20"
      v-if="foapa_information.foapa_information"
      style="margin-bottom: 5vh"
    >
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
        <div
          class="border box-border px-5 py-3 border-solid border-gray-200 max-w-xl w-72 mt-5"
        >
          <p class="text-sm font-medium">Total Requests Funded</p>
          <p class="font-semibold text-md">
            {{ foapa_information.claims_used.length }}
          </p>
        </div>
        <div
          class="border box-border px-5 py-3 border-solid border-gray-200 max-w-xl w-72 mt-5"
        >
          <p class="text-sm font-medium">Total Amount Used from FOAPA</p>
          <p class="font-semibold text-md">${{ totalAmountUsed }}</p>
        </div>
      </article>

      <!-- HISTORY -->
      <h2 class="text-xl font-semibold mt-12 underline">Foapa Usage History</h2>
      <p class="text-sm leading-7">
        Keep track of the reimbursement claims that you have used by this FOAPA
      </p>

      <div class="flex gap-4 items-center">
        <!-- Search field -->
        <span class="flex items-center gap-3">
          <InputText
            id="over_label"
            v-model="search_item"
            class="max-w-[800px] !border-gray-200 w-full"
            style="
              .p-inputtext {
                width: 100%;
                padding-left: 25px;
                font-size: 13px !important;
              }
            "
            placeholder="Search through your FOAPA"
          />
        </span>
        <div class="flex gap-3 flex-wrap">
          <Select
            v-model="view"
            :options="views"
            default-value="Grid View"
            placeholder="Grid View"
            class="w-full md:w-40"
          >
            <template #dropdownicon>
              <i class="pi pi-th-large" v-if="view === 'Grid View'" />
              <i class="pi pi-list" v-if="view === 'List View'" />
            </template>
          </Select>
          <Select
            v-model="sort"
            :options="sort_options"
            placeholder="Sort"
            class="w-full md:w-40"
          >
            <template #dropdownicon>
              <i class="pi pi-sort-alt" />
            </template>
          </Select>
        </div>
      </div>
      <div class="">
        <p class="text-sm">
          Filter by date ranges (based on when the reimbursement was last
          updated/submitted):
        </p>
        <div class="flex">
          <DatePicker
            v-model="foapa_date_range"
            selectionMode="range"
            placeholder="Filter by Date Range"
            :manualInput="false"
            :pt="{ root: 'h-9 !w-64' }"
          />
          <button
            type="button"
            @click="filterByDate"
            class="bg-udmercy-blue text-white border-none w-20 h-9 ml-3 rounded-full cursor-pointer text-xs flex justify-center items-center gap-3"
          >
            Filter
          </button>
          <button
            type="button"
            @click="removeFilter"
            class="bg-udmercy-blue text-white border-none w-32 h-9 ml-3 rounded-full cursor-pointer text-xs flex justify-center items-center gap-3"
          >
            Remove Filter
          </button>
        </div>
      </div>

      <div class="mb-0">
        <p class="mb-0 text-sm leading-7">
          Note: Clicking the name of a reimbursement request below will take you
          to the page where you can edit the request
        </p>
      </div>

      <!-- GRID VIEW -->
      <div
        class="flex gap-3 mt-3"
        v-if="
          Object.keys(foapa_information.claims_used).length !== 0 &&
          view === 'Grid View'
        "
      >
        <div
          v-for="claim in foapaHistoryFiltered"
          class="relative h-36 overflow-auto flex flex-col justify-center gap-2 pt-0 text-white box-border px-6 py-1 bg-udmercy-blue w-96 max-w-96 min-w-96 rounded-md"
        >
          <h3
            @click="goToReimbursement(claim._id, claim.reimbursementStatus)"
            class="font-medium text-base cursor-pointer my-0 mt-[-5px] w-fit max-w-64 overflow-hidden whitespace-nowrap text-ellipsis"
            :title="claim.reimbursementName + ' - ' + claim.reimbursementStatus"
          >
            {{ claim.reimbursementName }} - {{ claim.reimbursementStatus }}
          </h3>
          <h5 class="my-0 font-normal">Total cost: ${{ claim.totalCost }}</h5>
          <h5 class="my-0 font-normal">
            FOAPA usage: ${{ parseAmount(claim) }}
          </h5>
        </div>
      </div>

      <!-- TABLE VIEW -->
      <div
        style="margin-bottom: 30px"
        class="mt-5"
        v-if="view === 'Table View' && foapaHistoryFiltered.length !== 0"
      >
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
              <td
                @click="
                  () => goToReimbursement(foapa._id, foapa.reimbursementStatus)
                "
                class="cursor-pointer text-sm border-2"
              >
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
      <h3
        v-if="foapaHistoryFiltered.length === 0"
        class="text-sm font-normal italic"
      >
        This FOAPA hasn't been used yet
      </h3>
    </section>
    <!-- <section class="mt-20" v-else>
      <h3 class="text-sm font-medium">Loading...</h3>
    </section> -->
  </main>
</template>

<script lang="ts" setup>
import Select from "primevue/select";
import InputText from "primevue/inputtext";
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatFoapaDeails } from "../utils/formatFoapaDetails";
import { TYPE, useToast } from "vue-toastification";
import DatePicker from "primevue/datepicker";
const route = useRoute();
const router = useRouter();

let foapa_information = ref<any>({});
let view = ref<string>("Grid View");
let search_item = ref<string>("");

let sort = ref<
  | "Cost (ASC)"
  | "Cost (DESC)"
  | "Name (ASC)"
  | "Name (DESC)"
  | "Sort By: Default"
>("Sort By: Default");

const views = ["Grid View", "Table View"];
const foapa_date_range = ref<any[]>([]);

const sort_options = [
  "Cost (ASC)",
  "Cost (DESC)",
  "Name (ASC)",
  "Name (DESC)",
  "Sort By: Default",
];

const dateRangesFiltering = ref([]);
const filteringByDateRange = ref(false);

const foapaHistoryFiltered = computed(() => {
  if (filteringByDateRange.value) {
    return dateRangesFiltering.value;
  }

  if (Object.keys(foapa_information.value).length == 0) {
    return [];
  }

  let foapas = foapa_information.value.claims_used.filter((info) => {
    return info.reimbursementName
      .toLowerCase()
      .includes(search_item.value.toLowerCase());
  });

  if (sort.value === "Cost (ASC)") {
    return foapas.sort((a, b) => parseAmount(a) - parseAmount(b));
  }

  if (sort.value === "Cost (DESC)") {
    return foapas.sort((a, b) => parseAmount(b) - parseAmount(a));
  }

  if (sort.value === "Name (ASC)") {
    return foapas.sort((a, b) => a.reimbursementName > b.reimbursementName);
  }

  if (sort.value === "Name (DESC)") {
    return foapas.sort((a, b) => a.reimbursementName < b.reimbursementName);
  }

  if (sort.value === "Sort By: Default") {
    return foapas;
  }

  return foapas;
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

function filterByDate() {
  if (foapa_date_range.value && foapa_date_range.value.length === 0) return;
  let foapas = foapa_information.value.claims_used.filter((info) => {
    return info.reimbursementName
      .toLowerCase()
      .includes(search_item.value.toLowerCase());
  });

  const filteredFoapas = foapas.filter((foapa) => {
    const reqDate = new Date(foapa.reimbursementDate);
    return (
      reqDate >= foapa_date_range.value[0] &&
      reqDate <= foapa_date_range.value[1]
    );
  });

  dateRangesFiltering.value = filteredFoapas;
  filteringByDateRange.value = true;
}

function removeFilter() {
  filteringByDateRange.value = false;
  foapa_date_range.value = [];
}

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
const toast = useToast();
async function goToReimbursement(reimbursementId, status) {
  if (status === "In Progress" || status === "Denied") {
    router.push({ path: "/add-reimbursement", query: { reimbursementId } });
  } else {
    toast.clear();
    toast("You can not edit a submitted or approved request", {
      type: TYPE.ERROR,
    });
  }
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
  /* border: 3px solid black;
  border-collapse: collapse;
  padding: 1rem;
  font-size: 1rem; */
}

th {
  /* background-color: #002d72;
  color: white; */
}

.p-datepicker-input {
  font-size: 12.5px !important;
  border: solid 0.5px rgb(196, 195, 195) !important;
}
</style>
