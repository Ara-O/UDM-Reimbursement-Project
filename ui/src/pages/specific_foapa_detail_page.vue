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
          class="border box-border px-5 py-3 border-solid border-gray-200 max-w-xl w-56 mt-5"
        >
          <p class="text-sm font-medium">Total Requests Funded</p>
          <p class="font-semibold text-2xl">
            {{ foapa_information.claims_used.length }}
          </p>
        </div>
        <div
          class="border box-border px-5 py-- h-36 border-solid border-gray-200 max-w-xl w-72 mt-5"
        >
          <p class="text-sm leading-7 font-medium">
            Submitted Requests: ${{ totalAmountFromFoapaInSubmittedRequests }}
          </p>
          <p class="text-sm leading-7 font-medium">
            Approved Requests: ${{ totalAmountFromFoapaInApprovedRequests }}
          </p>
          <p class="text-sm font-medium leading-7">
            In-Progress Requests: ${{
              totalAmountFromFoapaInInProgressRequests
            }}
          </p>
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
      </div>

      <div class=""></div>

      <div class="mb-0">
        <p class="mb-0 text-sm leading-7">
          Note: Clicking the name of a reimbursement request below will take you
          to the page where you can edit the request
        </p>
      </div>

      <!-- GRID VIEW -->
      <div
        class="flex gap-3 mt-3 max-w-vw overflow-auto flex-wrap"
        v-if="
          Object.keys(foapa_information.claims_used).length !== 0 &&
          view === 'Grid View'
        "
      >
        <div
          v-for="claim in foapaHistoryFiltered"
          class="relative h-44 overflow-auto flex flex-col justify-center gap-2 pt-0 text-white box-border px-6 py-1 bg-udmercy-blue w-96 max-w-96 min-w-96 rounded-md"
        >
          <reimbursement-status
            class="absolute top-3 right-3"
            :status="claim.reimbursementStatus"
          ></reimbursement-status>
          <h3
            @click="goToReimbursement(claim._id, claim.reimbursementStatus)"
            class="font-medium text-base cursor-pointer my-0 mt-[-5px] w-fit max-w-50 overflow-hidden whitespace-nowrap text-ellipsis"
            :title="claim.reimbursementName + ' - ' + claim.reimbursementStatus"
          >
            {{ claim.reimbursementName }}
          </h3>
          <h5 class="my-0 font-normal">
            Last Updated: {{ parseUTCDate(claim.reimbursementDate) }}
          </h5>
          <h5 class="my-0 font-normal">
            Total cost: ${{ claim.totalCost }} | FOAPA usage: ${{
              parseAmount(claim)
            }}
          </h5>
          <div class="flex gap-4 mt-2">
            <span
              class="bg-white px-4 h-8 w-12 justify-center cursor-pointer py-2 flex items-center content-center rounded-full"
              @click="() => viewPdf(claim)"
              title="View"
            >
              <img :src="EyeIcon" class="w-4" alt="Eye Icon" />
            </span>

            <span
              class="bg-white px-4 h-8 w-12 cursor-pointer py-2 justify-center flex items-center content-center rounded-full"
              @click="goToReimbursement(claim._id, claim.reimbursementStatus)"
              title="Edit Request"
              v-if="
                claim.reimbursementStatus != 'Submitted' &&
                claim.reimbursementStatus != 'Approved' &&
                claim.reimbursementStatus != 'Approved*'
              "
            >
              <img :src="PencilIcon" class="w-4" alt="Pencil Icon" />
            </span>
          </div>
        </div>
      </div>

      <!-- TABLE VIEW -->
      <div
        style="margin-bottom: 30px"
        class="mt-5"
        v-if="view === 'Table View' && foapaHistoryFiltered.length !== 0"
      >
        <table class="table border-1 table-style">
          <thead>
            <tr class="table-style">
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
                class="cursor-pointer !text-nm border-2"
              >
                {{ foapa.reimbursementName }}
              </td>
              <td class="!text-nm border-2">${{ foapa.totalCost }}</td>
              <td class="!text-nm border-2">
                {{ foapa.reimbursementStatus }}
              </td>
              <td class="!text-nm border-2">
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
import ReimbursementStatus from "../components/dashboard/ReimbursementStatus.vue";
import DatePicker from "primevue/datepicker";
import parseUTCDate from "../utils/parseDate";
import EyeIcon from "../assets/eye-view-blue.png";
import PencilIcon from "../assets/blue-pencil.png";
import DuplicateIcon from "../assets/duplicate-blue.png";
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

const totalAmountFromFoapaInSubmittedRequests = computed(() => {
  let totalAmount = 0;

  foapa_information.value.claims_used.forEach((claim) => {
    claim.foapaDetails.forEach((foapa) => {
      if (claim.reimbursementStatus === "Submitted") {
        if (
          foapa.foapaName ===
            foapa_information.value.foapa_information.foapaName &&
          foapa.cost
        ) {
          totalAmount += foapa.cost * 100;
        }
      }
    });
  });

  return totalAmount / 100;
});

const totalAmountFromFoapaInApprovedRequests = computed(() => {
  let totalAmount = 0;

  foapa_information.value.claims_used.forEach((claim) => {
    claim.foapaDetails.forEach((foapa) => {
      if (
        claim.reimbursementStatus === "Approved" ||
        claim.reimbursementStatus === "Approved*"
      ) {
        if (
          foapa.foapaName ===
            foapa_information.value.foapa_information.foapaName &&
          foapa.cost
        ) {
          totalAmount += foapa.cost * 100;
        }
      }
    });
  });

  return totalAmount / 100;
});

const totalAmountFromFoapaInInProgressRequests = computed(() => {
  let totalAmount = 0;

  foapa_information.value.claims_used.forEach((claim) => {
    claim.foapaDetails.forEach((foapa) => {
      if (claim.reimbursementStatus === "In Progress") {
        if (
          foapa.foapaName ===
            foapa_information.value.foapa_information.foapaName &&
          foapa.cost
        ) {
          totalAmount += foapa.cost * 100;
        }
      }
    });
  });

  return totalAmount / 100;
});

function downloadPDF(pdfData: string) {
  const linkSource = pdfData;
  let iframe =
    "<iframe width='100%' height='100%' src='" + linkSource + "'></iframe>";
  let x = window.open();
  if (x != null) {
    x.document.open();
    x.document.write(iframe);
    x.document.close();

    // Remove padding from the iframe content
    x.document.querySelector("style") ||
      x.document.head.appendChild(x.document.createElement("style"));
    // @ts-ignore
    x.document.querySelector("style").textContent += `
  body, iframe {
    margin: 0;
    padding: 0;
    overflow: hidden
  }
`;
  }
}

async function viewPdf(request) {
  try {
    toast.clear();
    toast("Loading... Please wait...", {
      type: TYPE.INFO,
    });

    let res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/generate-pdf`,
      {
        reimbursementTicket: request,
      }
    );

    downloadPDF(res.data);

    toast.clear();
  } catch (err: any) {
    console.log(err);
    toast.clear();
    toast(
      err?.response?.data?.message ||
        "There was an error previewing this PDF. Please try again later",
      {
        type: TYPE.ERROR,
      }
    );
  }
}

const totalAmountUsed = computed(() => {
  let totalAmount = 0;

  //Loop through all the claims the foapa is used in,
  //for each claim, match the foapa id out of the list of the foapas used in the claim
  //and add its cost - the amount spent from it to the totalAmount
  foapa_information.value.claims_used.forEach((claim) => {
    claim.foapaDetails.forEach((foapa) => {
      if (
        foapa.foapaName ===
          foapa_information.value.foapa_information.foapaName &&
        foapa.cost
      ) {
        console.log(foapa.cost, foapa);
        totalAmount += foapa.cost * 100;
      }
    });
  });

  return totalAmount / 100;
});

/**
 * This function is used to filter the reimbursement claims table based on the reimbursement date,
 * by filtering the foapa information's claims_used array. It will return only the claims that
 * have a reimbursement date that is within the range of the two dates specified in the
 * foapa_date_range. If the range is empty, it will do nothing. It will also set
 * filteringByDateRange to true.
 */
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
  const found_claim = claim.foapaDetails.find((foapa) => {
    return (
      foapa.foapaName === foapa_information.value.foapa_information.foapaName
    );
  });

  return found_claim.cost;
}

const toast = useToast();

async function goToReimbursement(reimbursementId, status) {
  router.push({
    path: "/add-reimbursement",
    query: { reimbursementId },
    state: { from: "foapa-page" },
  });
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
.table-style table,
.table-style th,
.table-style td {
  border: 1px solid rgb(113, 113, 113);
  border-collapse: collapse;
  padding: 1rem;
  font-size: 1rem;
}

.table-style th {
  background-color: #002d72;
  color: white;
}

.table {
  border-collapse: collapse;
}

.p-datepicker-input {
  font-size: 12.5px !important;
  border: solid 0.5px rgb(196, 195, 195) !important;
}
</style>
