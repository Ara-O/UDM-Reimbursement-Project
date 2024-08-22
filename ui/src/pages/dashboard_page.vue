<template>
  <section class="dashboard-page">
    <!-- FOAPA numbers section -->
    <foapa-numbers></foapa-numbers>

    <!-- Middle section -->
    <section class="reimbursement-section">
      <h3>Welcome {{ userInfo.firstName }}</h3>
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
        <div class="search-button">
          <img
            src="../assets/search-icon.png"
            alt="Search icon"
            class="search-icon"
          />
        </div>
      </div>
      <div class="search-filters">
        <div
          class="filter"
          :class="{ selected: sortParameter === 'Date' }"
          @click="orderByDate()"
        >
          <h3>Sort by Date</h3>
        </div>
        <div
          class="filter"
          :class="{ selected: sortParameter === 'Status' }"
          @click="orderByStatus()"
        >
          <h3>Sort by Status</h3>
        </div>
        <div
          class="filter"
          :class="{ selected: sortParameter === 'Name' }"
          @click="orderByName()"
        >
          <h3>Sort by Name</h3>
        </div>
        <div
          class="filter"
          :class="{ selected: sortParameter === 'Cost' }"
          @click="orderByCost()"
        >
          <h3>Sort by Cost</h3>
        </div>
      </div>
      <br />
      <div style="display: flex; flex-direction: column">
        <h3 style="font-weight: 500; font-size: 14.5px">
          All Reimbursements -
        </h3>
        <span class="w-full flex relative">
          <span class="w-full flex flex-wrap gap-2">
            <button
              @click="$router.push('/add-reimbursement')"
              class="filter add-reimbursement-ticket-button"
            >
              Click to add new reimbursement
            </button>
            <button
              @click="viewingTemplates = !viewingTemplates"
              class="filter add-reimbursement-ticket-button"
            >
              {{
                viewingTemplates === false
                  ? "View Your Templates"
                  : "View Claims"
              }}
            </button>
            <div class="relative">
              <button
                class="filter add-reimbursement-ticket-button"
                @click="viewPopupIsShown = !viewPopupIsShown"
              >
                Change View
              </button>
              <div
                class="absolute right-0 shadow rounded-md z-20 px-5 bg-white top-12"
                v-if="viewPopupIsShown"
              >
                <h4
                  class="font-normal hover:underline cursor-pointer text-sm"
                  @click="changeView('grid')"
                >
                  Grid View
                </h4>
                <h4
                  class="font-normal hover:underline cursor-pointer text-sm"
                  @click="changeView('list')"
                >
                  List View
                </h4>
                <h4
                  class="font-normal hidden md:block hover:underline cursor-pointer text-sm"
                  @click="changeView('table')"
                >
                  Table View
                </h4>
              </div>
            </div>
          </span>
        </span>
      </div>
      <br />
      <!-- <button
        v-if="filterReimbursements.length > 0"
        @click="changeView"
        class=""
      >
        Viewing as {{ currentView }}
      </button> -->
      <!-- TABLE -->
      <div v-if="currentView === 'table'">
        <table class="border table border-collapse border-solid border-black">
          <tr class="tr">
            <td class="font-medium td">Reimbursment Identifier</td>
            <td class="font-medium td">Status</td>
            <td class="font-medium td">Date</td>
            <td class="font-medium td">Cost</td>
            <td class="font-medium td">Actions</td>
          </tr>
          <tr v-for="ticket in filterReimbursements" class="tr">
            <td class="td">{{ ticket.reimbursementName }}</td>
            <td class="td">{{ ticket.reimbursementStatus }}</td>
            <td class="td">{{ parseDate(ticket.reimbursementDate) }}</td>
            <td class="td">${{ ticket.totalCost.toFixed(2) }}</td>
            <td class="flex td gap-4 border-none">
              <span
                class="underline cursor-pointer"
                @click="viewTicket(ticket._id)"
                v-if="ticket.reimbursementStatus !== 'Submitted'"
                >Modify</span
              >
              <span
                class="underline cursor-pointer"
                @click="deleteReimbursement(ticket._id)"
                >Delete</span
              >
            </td>
          </tr>
        </table>
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
            <h3>{{ ticket.reimbursementName }}</h3>
            <h4>Status: {{ ticket.reimbursementStatus }}</h4>
            <h5>
              {{ parseDate(ticket.reimbursementDate) }}
            </h5>
            <div class="total-amount">${{ ticket.totalCost.toFixed(2) }}</div>
            <div class="reimbursement-buttons">
              <button
                @click="viewTicket(ticket._id)"
                v-if="ticket.reimbursementStatus !== 'Submitted'"
              >
                Modify
              </button>
              <button @click="deleteReimbursement(ticket._id)">Delete</button>
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
          <h3>{{ ticket.reimbursementName }}</h3>
          <h4>Status: {{ ticket.reimbursementStatus }}</h4>
          <h5>
            {{ parseDate(ticket.reimbursementDate) }}
          </h5>
          <div class="total-amount">${{ ticket.totalCost.toFixed(2) }}</div>
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
      <div class="user-information-header">
        <h3>User Information</h3>
      </div>
      <div class="user-information-wrapper">
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
      </div>
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
      <button @click="signOut">Sign Out</button>
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
import FoapaNumbers from "../components/dashboard/FoapaNumbersDashboard.vue";
import axios from "axios";
import ConfirmationPopup from "../components/utilities/ConfirmationPopup.vue";
import "../assets/styles/dashboard-page.css";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { TYPE, useToast } from "vue-toastification";

const router = useRouter();
const searchValue = ref<string>("");

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

let reimbursementTickets = ref<any>([]);

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
      retrieveReimbursements();
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

function retrieveUserInformationSummary() {
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/retrieveUserInformationSummary`)
    .then((res) => {
      userInfo.value = res.data;
      retrieveReimbursements();
      // console.log(res);
    })
    .catch((err: any) => {
      console.log("ERROR", err);
      if (err.code === "ERR_NETWORK") {
        toast(
          err?.response?.data?.message ||
            "An error has occured, please log in again",
          {
            type: TYPE.ERROR,
          }
        );
        localStorage.setItem("token", "");
        router.push("/");
        return;
      }
      if (
        err?.response?.status === 401 ||
        err?.response?.status === 403 ||
        err?.response.status === 404
      ) {
        //If JWT is expired, clear the token and go back to signup page
        toast(
          err?.response?.data?.message ||
            "An error has occured, please log in again",
          {
            type: TYPE.ERROR,
          }
        );
        localStorage.setItem("token", "");
        router.push("/");
      }
    });
}

function parseDate(dateString: string) {
  // console.log(dateString);
  const dateParsed = new Date(dateString);
  const formattedDate = dateParsed.toISOString().slice(0, 10);
  return formattedDate;
}

function addReimbursement() {
  router.push("bursement");
}

function viewTicket(reimbursementId: string) {
  router.push({ path: "/add-reimbursement", query: { reimbursementId } });
}

let sortParameter = ref<SortParameters>("Name");

function retrieveReimbursements() {
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/retrieveReimbursements`)
    .then((res) => {
      // console.log(res);
      reimbursementTickets.value = res.data;
    })
    .catch((err) => {
      alert(err);
    });
}

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
    retrieveUserInformationSummary();
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
.table,
.td,
.th,
.tr {
  border: solid 1px black;
  padding: 8px 14px;
  font-size: 13.5px;
}
</style>
