<template>
  <section class="dashboard-page">
    <!-- FOAPA numbers section -->
    <foapa-numbers></foapa-numbers>
    <section class="reimbursement-section">
      <h3>Welcome {{ userInfo.firstName }}</h3>
      <br />
      <div class="reimbursement-search-input">
        <input
          type="text"
          v-model="searchValue"
          class="reimbusement-search"
          onchange="filterReimbursements"
          placeholder="Search Reimbursement"
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
        <button
          @click="$router.push('/add-reimbursement')"
          class="filter"
          style="
            border: 0px;
            padding: 0px 20px;
            width: 300px;
            font-weight: 300;
            font-size: 12.5px;
          "
        >
          Click here to add reimbursement ticket
        </button>
      </div>
      <br />
      <div class="reimbursement-wrapper">
        <div class="reimbursement" v-for="ticket in filterReimbursements">
          <div class="total-amount">${{ ticket.totalCost }}</div>
          <h3>{{ ticket.reimbursementName }}</h3>
          <h4>Status: {{ ticket.reimbursementStatus }}</h4>
          <h5>
            {{ parseDate(ticket.reimbursementDate) }}
          </h5>
          <div class="reimbursement-buttons">
            <button @click="viewTicket(ticket._id)">Modify</button>
            <button @click="deleteReimbursement(ticket._id)">Delete</button>
          </div>
        </div>
      </div>
    </section>
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
          <h3>Phone Number: {{ userInfo.phoneNumber }}</h3>
        </div>
      </div>
      <router-link to="/account" style="font-size: 14px"
        >Manage account information</router-link
      >

      <router-link to="/change-password" style="font-size: 14px"
        >Change password</router-link
      >
      <button @click="signOut">Sign Out</button>
    </section>
    <!-- <h3>hi</h3>
    <button @click="closeConnection">Close server connection</button> -->
  </section>
</template>

<script lang="ts" setup>
import FoapaNumbers from "../components/dashboard/FoapaNumbersDashboard.vue";
import axios from "axios";
import "../assets/styles/dashboard-page.css";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

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

let costFlag = -1,
  nameFlag = -1,
  dateFlag = -1,
  statusFlag = -1;

let userInfo = ref<UserData>({
  employmentNumber: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  workEmail: "",
});

let reimbursementTickets = ref<any>([
  // {
  //   reimbursementId: 169449298,
  //   eventName: "Reim3",
  //   totalCost: 300,
  //   reimbursementStatus: false,
  //   reimbursementDate: "2023-05-21",
  // },
]);

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
  alert("Successfully signed out!");
}

function deleteReimbursement(id: string) {
  axios
    .post(
      "https://udm-reimbursement-project.onrender.com/api/deleteReimbursement",
      {
        id,
      }
    )
    .then(() => {
      retrieveReimbursements();
    })
    .catch((err) => {
      alert(err.response.data.message);
    });
}

function retrieveUserInformationSummary() {
  axios
    .get(
      "https://udm-reimbursement-project.onrender.com/api/retrieveUserInformationSummary"
    )
    .then((res) => {
      userInfo.value = res.data;
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 401 || err.response.status === 403) {
        //If JWT is expired, clear the token and go back to signup page
        alert(err.response.data.message);
        localStorage.setItem("token", "");
        router.push("/");
      }
    });
}

function parseDate(dateString: string) {
  console.log(dateString);
  const dateParsed = new Date(dateString);
  const formattedDate = dateParsed.toISOString().slice(0, 10);
  return formattedDate;
}

function addReimbursement() {
  router.push("/add-reimbursement");
}

function viewTicket(reimbursementId: string) {
  router.push({ path: "/add-reimbursement", query: { reimbursementId } });
}

let sortParameter = ref<SortParameters>("Name");

function retrieveReimbursements() {
  axios
    .get(
      "https://udm-reimbursement-project.onrender.com/api/retrieveReimbursements"
    )
    .then((res) => {
      console.log(res);
      reimbursementTickets.value = res.data;
    })
    .catch((err) => {
      alert(err);
    });
}

onMounted(() => {
  if (
    localStorage.getItem("token") === null ||
    localStorage.getItem("token") === ""
  ) {
    console.log("User not signed in");
    router.push("/");
  } else {
    retrieveUserInformationSummary();
    retrieveReimbursements();
  }
});
</script>
