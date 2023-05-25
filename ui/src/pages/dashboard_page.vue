<template>
  <section class="dashboard-page">
    <section class="foapa-number-section">
      <h3>Foapa Numbers</h3>
      <br />
      <div class="foapa-number-wrapper">
        <div
          class="foapa-number"
          v-for="foapa in userFoapaNumbers"
          :key="foapa.foapaNumber"
          style="display: flex; flex-direction: column; align-items: start"
        >
          <span class="foapa-number-title">
            <img
              src="../assets/trash-icon.png"
              alt="Trash"
              @click="deleteFoapa(foapa.foapaNumber)"
            />
            <h3 style="font-weight: 500">
              {{ foapa.foapaName }}
            </h3>
          </span>
          <div
            style="
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-around;
            "
          >
            <h3 style="margin-top: 10px">{{ foapa.foapaNumber }}</h3>
          </div>
        </div>
        <div class="filter" @click="goToFoapaPage">
          <h3>Add Foapa Number</h3>
        </div>
        <!-- <div class="foapa-number">
          <input
            type="text"
            name="Foapa Number"
            placeholder="New FOAPA Number"
            v-model="obj.foapaNumber"
          />
          <img
            src="../assets/add-icon2.png"
            alt="add-icon2"
            @click="addFoapaNumber"
          />
        </div> -->
      </div>
    </section>

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
          @click="sortBy('Date')"
        >
          <h3>Sort by Date</h3>
        </div>
        <div
          class="filter"
          :class="{ selected: sortParameter === 'Status' }"
          @click="sortBy('Status')"
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
        <!-- <div
          class="filter"
          :class="{ selected: sortParameter === 'Cost Ascending' }"
          @click="sortBy('Cost Ascending')"
        >
          <h3>Sort by Cost ( ASC )</h3>
        </div>
        <div
          class="filter"
          :class="{ selected: sortParameter === 'Cost Descending' }"
          @click="sortBy('Cost Descending')"
        >
          <h3>Sort by Cost ( DESC )</h3>
        </div> -->
        <div
          class="filter"
          :class="{ selected: sortParameter === '' }"
          @click="sortBy('')"
        >
          <h3>Remove filter</h3>
        </div>
      </div>
      <br />
      <h3 style="font-weight: 500; font-size: 14.5px">
        All Reimbursements -
        <router-link to="/add-reimbursement" class="add-reimbursement-link"
          >Click here to add reimbursement ticket</router-link
        >
      </h3>
      <br />
      <div class="reimbursement-wrapper">
        <div class="reimbursement" v-for="ticket in filterReimbursements">
          <div class="total-amount">${{ ticket.totalAmount }}</div>
          <h3>{{ ticket.eventName }}</h3>
          <h4>Status: In Progress</h4>
          <h5>
            {{ parseDate(ticket.reimbursementDate) }}
          </h5>
          <div class="reimbursement-buttons">
            <button @click="viewTicket(ticket.reimbursementId)">Modify</button>
            <button @click="deleteReimbursement(ticket.reimbursementId)">
              Delete
            </button>
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

      <router-link to="/password" style="font-size: 14px"
        >Change password</router-link
      >
      <button @click="signOut">Sign Out</button>
    </section>
    <!-- <h3>hi</h3>
    <button @click="closeConnection">Close server connection</button> -->
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import "../assets/styles/dashboard-page.css";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const searchValue = ref<string>("");

type SortParameters = "" | "Date" | "Name" | "Status";

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
  //   totalAmount: 300,
  //   reimbursementStatus: false,
  //   reimbursementDate: "2023-05-21",
  // },
]);

function orderByName() {
  sortParameter.value = "Name";
  reimbursementTickets.value = reimbursementTickets.value.sort((a, b) => {
    if (a.eventName.toUpperCase() < b.eventName.toUpperCase()) {
      return -1;
    }
    if (a.eventName.toUpperCase() > b.eventName.toUpperCase()) {
      return 1;
    }
    return 0;
  });
}

const filterReimbursements = computed(() => {
  return searchValue.value
    ? reimbursementTickets.value.filter((ticket) =>
        ticket.eventName.toLowerCase().includes(searchValue.value.toLowerCase())
      )
    : reimbursementTickets.value;
});

function signOut() {
  localStorage.setItem("token", "");
  router.push("/");
  alert("Successfully signed out!");
}

function deleteFoapa(foapaNumber: string) {
  axios
    .post("https://reimbursement-project.onrender.com/api/deleteFoapaDetail", {
      foapaNumber,
    })
    .then(() => {
      console.log("The thing that was deleted: " + foapaNumber);
      alert("Foapa Deleted Successfully");
      retrieveUserFoapaNumbers();
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.message);
    });
}

function deleteReimbursement(id: string) {
  axios
    .post(
      "https://reimbursement-project.onrender.com/api/deleteReimbursement",
      {
        id,
      }
    )
    .then(() => {
      retrieveReimbursements();
      console.log("Deleted reimbursement id: " + id);
      alert("Ticket Deleted Successfully");
    });
}

let userFoapaNumbers = ref<FoapaNumbers[]>([]);

function retrieveUserFoapaNumbers() {
  axios
    .get(`https://reimbursement-project.onrender.com/api/retrieveFoapaDetails`)
    .then((res) => {
      userFoapaNumbers.value = res.data;
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

function retrieveUserInformationSummary() {
  axios
    .get(
      "https://reimbursement-project.onrender.com/api/retrieveUserInformationSummary"
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
  console.log(reimbursementId);
  router.push({ path: "/add-reimbursement", query: { reimbursementId } });
}

let sortParameter = ref<SortParameters>("");

async function sortBy(parameter: SortParameters) {
  sortParameter.value = parameter;
  try {
    let reimbursements = await axios.get(
      "https://reimbursement-project.onrender.com/api/retrieveReimbursements",
      {
        params: {
          sortBy: parameter,
        },
      }
    );

    reimbursementTickets.value = reimbursements.data;
  } catch (err) {
    console.error(err);
  }
}

function goToFoapaPage() {
  router.push("/add-foapa");
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
    retrieveUserFoapaNumbers();
    retrieveReimbursements();
  }
});

function retrieveReimbursements() {
  axios
    .get(
      "https://reimbursement-project.onrender.com/api/retrieveReimbursements"
    )
    .then((res) => {
      console.log(res);
      reimbursementTickets.value = res.data;
    })
    .catch((err) => {
      alert(err);
    });
}
</script>
