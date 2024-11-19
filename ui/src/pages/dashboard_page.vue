<template>
  <section class="dashboard-page">
    <!-- FOAPA numbers section -->
    <foapa-numbers></foapa-numbers>

    <!-- Middle section -->
    <section class="reimbursement-section">
      <h3 class="mb-0 !text-[16]">Welcome {{ userInfo.firstName }}</h3>
      <router-link to="/profile-page">
        <img src="../assets/user-icon.png" alt="User help" class="user-icon"
      /></router-link>
      <br />
      <div class="reimbursement-search-input">
        <input
          type="text"
          v-model="searchValue"
          class="reimbusement-search"
          onchange="filterReimbursements"
          placeholder="Search Reimbursement Claims"
        />
        <select
          v-model="sortValue"
          class="w-56 bg-white text-gray-600 select-dropdown reimbusement-search pl-4 pr-5 box-border"
        >
          <option value="Sort by" disabled selected>Sort</option>
          <option value="Name" @select="orderByName">Sort by Name</option>
          <option value="Date" @select="orderByDate">Sort by Date</option>
          <option value="Status" @change="orderByStatus">Sort by Status</option>
          <option value="Cost">Sort by Cost</option>
          <option value="None">Sort by:</option>
        </select>
        <div class="search-button w-20">
          <img
            src="../assets/search-icon.png"
            alt="Search icon"
            class="search-icon"
          />
        </div>
      </div>
      <!-- <div class="search-filters">
        <div
          class="filter"
          :class="{ selected: sortParameter === 'Date' }"
          @click="orderByDate()"
        >
          <h3>Sort by Date</h3>
        </div>
        <div class="filter" @click="orderByStatus()">
          <h3>Sort by Status</h3>
        </div>
        <div class="filter" @click="orderByName()">
          <h3>Sort by Name</h3>
        </div>
        <div class="filter" @click="orderByCost()">
          <h3>Sort by Cost</h3>
        </div>
      </div> -->
      <!--           :class="{ selected: sortParameter === 'Cost' }"
 -->
      <br />
      <div style="display: flex; flex-direction: column">
        <h3 style="font-weight: 500; font-size: 14.5px">
          All Reimbursements -
        </h3>
        <span class="w-full flex relative">
          <span
            class="w-full flex items-center flex-wrap justify-between gap-2"
          >
            <button
              @click="$router.push('/add-reimbursement')"
              class="filter flex gap-3 add-reimbursement-ticket-button"
            >
              Add new reimbursement
              <img
                :src="PlusIcon"
                alt="Add reimbursement"
                title="Add reimbursement"
                class="w-3"
              />
            </button>

            <div>
              <div class="flex gap-2 items-center">
                <img
                  :src="GridView"
                  alt="Grid view"
                  :class="{ '!opacity-60': currentView == 'grid' }"
                  class="w-4 cursor-pointer hover:opacity-40 transition-all opacity-30"
                  @click="changeView('grid')"
                />
                <img
                  :src="ListView"
                  alt="List view"
                  @click="changeView('list')"
                  class="w-5 opacity-30 ml-3 h-[0.9rem] hover:opacity-40 transition-all cursor-pointer"
                  :class="{ '!opacity-50': currentView == 'list' }"
                />
                <img
                  :src="TableView"
                  alt="Table View"
                  @click="changeView('table')"
                  :class="{ '!opacity-50': currentView == 'table' }"
                  class="w-4 ml-3 h-4 cursor-pointer hover:opacity-40 transition-all opacity-30"
                />
              </div>
            </div>
          </span>
        </span>
      </div>
      <br />
      <div
        v-if="filterReimbursements.length === 0"
        class="flex-row flex-wrap text-center mt-10 text-m text-black/50"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/3404/3404152.png"
          class="w-8 opacity-50"
        />
        <p>Nothing to Show... Try Creating a Reimbursement Request!</p>
      </div>
      <!-- TABLE -->
      <div v-if="currentView === 'table'" class="p-datatable-wrapper">
        <DataTable
          :value="filterReimbursements"
          tableStyle="min-width: 10rem"
          showGridlines
          class="border border-collapse border-solid border-black"
        >
          <Column
            field="reimbursementName"
            header="Name"
            style="width: 45%; overflow: auto"
            sortable
          ></Column>
          <Column
            field="reimbursementStatus"
            header="Status"
            sortable
            style="width: 25%"
          ></Column>
          <Column
            field="reimbursementDate"
            header="Date"
            sortable
            style="width: 25%"
          >
            <template #body="slotProps">{{
              parseDate(slotProps.data.reimbursementDate)
            }}</template>
          </Column>
          <Column field="cost" header="Cost" sortable style="width: 25%">
            <template #body="slotProps"
              >${{ slotProps.data.totalCost.toFixed(2) }}</template
            >
          </Column>
          <Column field="actions" header="Actions" style="width: 25%">
            <template #body="slotProps">
              <div class="flex gap-5 justify-center">
                <span
                  class="underline cursor-pointer h-[16px]"
                  @click="viewTicket(slotProps.data._id)"
                  v-if="slotProps.data.reimbursementStatus !== 'Submitted'"
                  ><img :src="pencilIcon" alt="Pencil icon" class="w-4"
                /></span>
                <span
                  class="underline cursor-pointer h-[16px]"
                  @click="deleteReimbursement(slotProps.data._id)"
                >
                  <img
                    src="../assets/trash-icon.png"
                    alt="Delete Icon"
                    class="w-4"
                /></span>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
      <!-- LIST/GRID -->
      <div v-else>
        <div
          :class="
            currentView === 'list'
              ? 'reimbursement-wrapper-list'
              : 'reimbursement-wrapper-grid'
          "
          v-if="!viewingTemplates"
        >
          <div class="reimbursement" v-for="ticket in filterReimbursements">
            <h3
              class="overflow-hidden text-ellipsis whitespace-nowrap max-w-80"
              :title="ticket.reimbursementName || 'Invalid Reimbursement'"
            >
              {{ ticket.reimbursementName || "Invalid Reimbursement" }}
            </h3>
            <div>
              ${{ ticket.totalCost ? ticket.totalCost.toFixed(2) : "0" }}
            </div>
            <h5>
              {{ parseDate(ticket.reimbursementDate) }}
            </h5>
            <h4
              class="total-amount !text-xs !font-medium"
              :style="getStyle(ticket.reimbursementStatus)"
            >
              {{ ticket.reimbursementStatus || "Invalid" }}
            </h4>
            <div class="reimbursement-buttons">
              <button
                @click="viewTicket(ticket._id)"
                title="Modify Request"
                style="background-color: white; border: 0px"
              >
                <!-- v-if="ticket.reimbursementStatus !== 'Submitted'" ENTER THIS WHEN V2.0 -->
                <img :src="pencilIcon" alt="Pencil icon" class="w-4" />
              </button>
              <button
                @click="deleteReimbursement(ticket._id)"
                title="Delete Request"
                style="background-color: #a5093e"
              >
                <img :src="deleteIcon" alt="Delete Icon" class="w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TEMPLATES -->
      <h3 class="mt-0" v-if="viewingTemplates">Templates</h3>
      <div
        v-if="viewingTemplates"
        :class="
          currentView === 'list'
            ? 'reimbursement-wrapper-list'
            : 'reimbursement-wrapper-grid'
        "
      >
        <div
          class="reimbursement"
          v-for="ticket in userInfo.reimbursementTemplates"
        >
          <h3>{{ ticket.reimbursementName || "Invalid Reimbursement" }}</h3>
          <h4>Status: {{ ticket.reimbursementStatus || "Invalid" }}</h4>
          <h5>
            {{ parseDate(ticket.reimbursementDate) }}
          </h5>
          <div class="total-amount">
            ${{ ticket.totalCost ? ticket.totalCost.toFixed(2) : "0" }}
          </div>
          <div class="reimbursement-buttons">
            <button
              v-if="ticket.reimbursementStatus !== 'Submitted'"
              @click="useClaimAsTemplate(ticket)"
            >
              Use as Template
            </button>
            <button>Delete</button>
          </div>
        </div>
      </div>
    </section>

    <!-- USER INFORMATION -->
    <section class="user-information-section">
      <!-- <div class="user-information-header">
        <h3>User Information</h3>
      </div> -->
      <!-- <div class="user-information-wrapper">
        <div>
          <h3>Full Name: {{ userInfo.firstName }} {{ userInfo.lastName }}</h3>
        </div>
        <div>
          <h3>Work Email: {{ userInfo.workEmail }}</h3>
        </div>
        <div>
          <h3>Employment Number: {{ userInfo.employmentNumber }}</h3>
        </div>
        <div>
          <h3>Phone Number: {{ formatPhoneNumber(userInfo.phoneNumber) }}</h3>
        </div>
      </div> -->
      <div class="flex gap-2 justify-center">
        <img
          src="../assets/hamburger-stack.png"
          @click="visibleRight = true"
          class="w-4 cursor-pointer mt-3"
        />
      </div>
      <Drawer
        v-model:visible="visibleRight"
        header="Manage Info"
        position="right"
      >
        <div class="flex flex-col justify-evenly items-center h-full">
          <router-link
            to="/account"
            class="text-black hover:text-udmercy-blue"
            style="font-size: 14px"
            >Manage account information</router-link
          >
          <router-link
            to="/change-password"
            class="text-black hover:text-udmercy-blue"
            style="font-size: 14px"
            >Change password</router-link
          >
          <router-link
            to="/contact"
            class="text-black hover:text-udmercy-blue"
            style="font-size: 14px"
            >Contact Us</router-link
          >
          <button class="sign-out-button" @click="signOut">Sign Out</button>
        </div>
      </Drawer>
      <!-- <router-link
        to="/account"
        class="text-black hover:text-udmercy-blue"
        style="font-size: 14px"
        >Manage account information</router-link
      >

      <router-link
        to="/change-password"
        class="text-black hover:text-udmercy-blue"
        style="font-size: 14px"
        >Change password</router-link
      >

      <router-link
        to="/contact"
        class="text-black hover:text-udmercy-blue"
        style="font-size: 14px"
        >Contact Us</router-link
      >
      <button @click="signOut">Sign Out</button>-->
    </section>
    <confirmation-popup
      v-if="delete_claim_confirmation_dialog"
      :cancel-function="stopDelete"
      :continue-function="confirmDelete"
      left-button-text="No, Don't Delete"
      right-button-text="Yes, Delete this claim"
    >
      <template #message>
        Are you sure you want to delete this reimbursement claim?
      </template>
    </confirmation-popup>
  </section>
  <template>
    <div id="app">
      <router-view></router-view>
    </div>
  </template>
</template>

<script lang="ts" setup>
import PlusIcon from "../assets/add-icon.png";
import ListView from "../assets/list-view-2.png";
import GridView from "../assets/grid-view-2.png";
import TableView from "../assets/table.png";
import FoapaNumbers from "../components/dashboard/FoapaNumbersDashboard.vue";
import axios from "axios";
import ConfirmationPopup from "../components/utilities/ConfirmationPopup.vue";
import "../assets/styles/dashboard-page.css";
import { onMounted, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { TYPE, useToast } from "vue-toastification";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import deleteIcon from "../assets/trash-icon-white.png";
import pencilIcon from "../assets/blue-pencil.png";
const router = useRouter();
const searchValue = ref<string>("");
import Drawer from "primevue/drawer";
const visibleRight = ref(false);

type SortParameters = "" | "Date" | "Name" | "Status" | "Cost";

type FoapaNumbers = {
  employmentNumber: number;
  foapaNumber: string;
  foapaName: string;
};

type UserData = {
  firstName: string;
  lastName: string;
  workEmail: string;
  employmentNumber: string;
  phoneNumber: string;
};

const toast = useToast();

interface Ticket {
  status: "Submitted" | "In Progress" | "Approved" | "Denied";
}
const getStyle = (status) => {
  const bgColors: Record<Ticket["status"], string> = {
    Submitted: "#006672", // blue
    "In Progress": "white", // orange
    Approved: "#2D7200", // purple
    Denied: "#72002D", // red
  };
  const colors: Record<Ticket["status"], string> = {
    Submitted: "white",
    "In Progress": "#002d72",
    Approved: "white",
    Denied: "white",
  };
  return {
    backgroundColor: bgColors[status] || "#002d72",
    color: colors[status] || "white", // Default background
  };
};

let costFlag = -1,
  nameFlag = -1,
  dateFlag = -1,
  statusFlag = -1;

let userInfo = ref<any>({
  employmentNumber: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  workEmail: "",
});

let viewingTemplates = ref<boolean>(false);
let viewPopupIsShown = ref<boolean>(false);
let delete_claim_confirmation_dialog = ref<boolean>(false);
let claim_to_delete_id = ref<string>("");
const sortValue = ref<string>("None");
let reimbursementTickets = ref<any>([]);

const theme = ref({
  backgroundColor: "red",
});

// name, date, status, cost
watch(sortValue, (newvalue) => {
  console.log(newvalue);
  switch (newvalue) {
    case "Name":
      reimbursementTickets.value = reimbursementTickets.value.sort((a, b) => {
        if (
          b.reimbursementName.toUpperCase() < a.reimbursementName.toUpperCase()
        ) {
          return 1;
        }
      });
      break;
    case "Date":
      reimbursementTickets.value = reimbursementTickets.value.sort((a, b) => {
        if (a.reimbursementDate < b.reimbursementDate) {
          return 1;
        }
      });
      break;
    case "Status":
      reimbursementTickets.value = reimbursementTickets.value.sort((a, b) => {
        if (a.reimbursementStatus === "Submitted") {
          return 1;
        }
      });
      break;
    case "Cost":
      reimbursementTickets.value = reimbursementTickets.value.sort((a, b) => {
        if (a.totalCost < b.totalCost) {
          return 1;
        }
      });
      break;
  }
});

let currentView = ref<"grid" | "list" | "table">("grid");
function changeView(view: "grid" | "list" | "table") {
  currentView.value = view;
  viewPopupIsShown.value = false;
}

function formatPhoneNumber(phoneNumber: string) {
  const formattedPhoneNumber = `(${phoneNumber.slice(
    0,
    3
  )})-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  return formattedPhoneNumber;
}

function orderByName() {
  sortParameter.value = "Name";
  reimbursementTickets.value = reimbursementTickets.value.sort((a, b) => {
    if (a.reimbursementName.toUpperCase() < b.reimbursementName.toUpperCase()) {
      return 1 * nameFlag;
    }
    if (a.reimbursementName.toUpperCase() > b.reimbursementName.toUpperCase()) {
      return -1 * nameFlag;
    }
    return 0;
  });
  nameFlag = -nameFlag;
}

function orderByStatus() {
  sortParameter.value = "Status";
  reimbursementTickets.value = reimbursementTickets.value.sort((a, b) => {
    if (a.reimbursementStatus === "Submitted") {
      return -1 * statusFlag;
    }
    if (a.reimbursementStatus === "In Progress") {
      return 1 * statusFlag;
    }
    return 0;
  });
  statusFlag = -statusFlag;
}

function orderByCost() {
  sortParameter.value = "Cost";
  reimbursementTickets.value = reimbursementTickets.value.sort((a, b) => {
    if (a.totalCost < b.totalCost) {
      return 1 * costFlag;
    }
    if (a.totalCost > b.totalCost) {
      return -1 * costFlag;
    }
    return 0;
  });
  costFlag = -costFlag;
}

function orderByDate() {
  sortParameter.value = "Date";
  reimbursementTickets.value = reimbursementTickets.value.sort((a, b) => {
    if (a.reimbursementDate < b.reimbursementDate) {
      return 1 * dateFlag;
    }
    if (a.reimbursementDate > b.reimbursementDate) {
      return -1 * dateFlag;
    }
    return 0;
  });
  dateFlag = -dateFlag;
}

const filterReimbursements = computed(() => {
  return searchValue.value
    ? reimbursementTickets.value.filter((ticket) =>
        ticket.reimbursementName
          .toLowerCase()
          .includes(searchValue.value.toLowerCase())
      )
    : reimbursementTickets.value;
});

function signOut() {
  localStorage.setItem("token", "");
  router.push("/");
  toast("Successfully signed out!", {
    type: TYPE.SUCCESS,
  });
}

function stopDelete() {
  claim_to_delete_id.value = "";
  delete_claim_confirmation_dialog.value = false;
}

function deleteReimbursement(id: string) {
  delete_claim_confirmation_dialog.value = true;
  claim_to_delete_id.value = id;
}

function confirmDelete() {
  toast("Deleting reimbursement claim...", {
    type: TYPE.INFO,
  });
  axios
    .post(`${import.meta.env.VITE_API_URL}/api/delete-reimbursement`, {
      id: claim_to_delete_id.value,
    })
    .then(() => {
      retrieveDashboardData();
      delete_claim_confirmation_dialog.value = false;
      toast("Reimbursement claim deleted successfully", {
        type: TYPE.SUCCESS,
      });
    })
    .catch((err) => {
      alert(
        err?.response?.data?.message ||
          "An error occured, please try again later"
      );
    });
}

async function retrieveDashboardData() {
  try {
    let res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/retrieve-dashboard-data`
    );

    userInfo.value = res.data;
    reimbursementTickets.value = res.data.reimbursementTickets;
  } catch (err: any) {
    if (err.code === "ERR_NETWORK") {
      toast(
        "There was an error with your network. Please check your internet connection and try again",
        {
          type: TYPE.ERROR,
        }
      );

      return;
    }

    if (err?.response?.status === 403) {
      toast(
        "There was an error fetching your account information. Please create an account or log in.",
        {
          type: TYPE.ERROR,
        }
      );
      localStorage.setItem("token", "");
      router.push("/");
      return;
    }

    toast(
      err?.response?.data?.message ||
        "An unexpected error has occured. Please try again",
      {
        type: TYPE.ERROR,
      }
    );
  }
}

function parseDate(dateString: string) {
  if (dateString === "" || dateString === undefined) return "Invalid";
  const dateParsed = new Date(dateString);
  const date = dateParsed.toISOString().slice(0, 10);
  const formattedDate =
    date.split("-")[1] + "/" + date.split("-")[2] + "/" + date.split("-")[0];
  return formattedDate;
}

function viewTicket(reimbursementId: string) {
  router.push({ path: "/add-reimbursement", query: { reimbursementId } });
}

let sortParameter = ref<SortParameters>("Name");

function useClaimAsTemplate(template) {
  router.push({
    path: "/add-reimbursement",
    query: { templateData: JSON.stringify(template) },
  });
}

onMounted(() => {
  if (
    localStorage.getItem("token") === null ||
    localStorage.getItem("token") === ""
  ) {
    router.push("/");
  } else {
    retrieveDashboardData();
  }
});
</script>

<style>
.image-container {
  text-align: center;
  margin-top: 20px;
}

.udmercy-logo {
  width: 60px;
  /* Adjust the width to your desired size */
  height: auto;
  /* Maintain the aspect ratio */
}
.table {
  width: 100%;
}
.p-datatable .p-datatable-thead > tr > th {
  background-color: #002d72;
  color: white;
}
.table,
.td,
.th,
.tr {
  border: solid 1px black;
  padding: 8px 14px;
  font-size: 13.5px;
}

.p-datatable .p-datatable-thead > tr > th {
  background-color: #002d72;
  color: white;
  padding: 10px 25px;
  font-size: 14px;
}

.border-solid {
  border-style: none;
}

.p-datatable-column-header-content {
  gap: 15px !important;
  justify-content: center;
}

.p-datatable-sortable-column:not(.p-datatable-column-sorted):hover {
  background-color: #002d72 !important;
  color: white !important;
}

.p-datatable.p-component.p-datatable-gridlines.border.border-collapse.border-solid.border-black {
  border: 1px solid #002d72;
}

.p-datatable.p-datatable-gridlines:has(.p-datatable-thead):has(
    .p-datatable-tbody
  )
  .p-datatable-tbody
  > tr
  > td {
  border-width: 0 0 1px 1px;
  text-align: center;
}

.p-datatable.p-datatable-gridlines:has(.p-datatable-thead):has(
    .p-datatable-tbody
  )
  .p-datatable-tbody
  > tr
  > td {
  border-width: 0 0 1px 1px;
  font-size: 14px;
}
.p-row-even,
.p-row-odd {
  height: 40px;
}

.p-datatable-table {
  border: solid 2px #002967;
  border-collapse: collapse;
}

td {
  text-align: center;
}

.select-dropdown {
  -moz-appearance: none; /* Firefox */
  -webkit-appearance: none; /* Safari and Chrome */
  appearance: none;
}
</style>
