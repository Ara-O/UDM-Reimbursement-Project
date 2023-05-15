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
          <h3 style="margin-top: 8px; font-weight: 500">
            {{ foapa.foapaName }}
          </h3>
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
          <img
            src="../assets/trash-icon.png"
            alt="Trash"
            @click="deleteFoapa(foapa.foapaNumber)"
            style="transform: translate(221px, -24px)"
          />
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
          :class="{ selected: sortParameter === 'Cost' }"
          @click="sortBy('Cost')"
        >
          <h3>Sort by Cost</h3>
        </div>
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
        <div
          class="reimbursement"
          v-for="ticket in filteredStoredReimbursementTickets"
        >
          <div class="total-amount">${{ ticket.totalAmount }}</div>
          <h3>{{ ticket.eventName }}</h3>
          <h4>Status: In Progress</h4>
          <h5>
            {{ parseDate(ticket.reimbursementDate) }}
          </h5>
          <div class="reimbursement-buttons">
            <button>Delete</button>
            <button @click="viewTicket(ticket.reimbursementId)">Modify</button>
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
        >Manage Account Information</router-link
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
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { computed } from "@vue/reactivity";

const router = useRouter();
const storedEmploymentNumber = localStorage.getItem("employmentNumber");
const searchValue = ref<string>("");

type FoapaNumbers = {
  employmentNumber: number;
  foapaNumber: string;
  foapaName: string;
};
// type FoapaName = {
//   foapaName: string;
// };

let obj = ref({
  empNo: localStorage.getItem("employmentNumber"),
  foapaNumber: "",
  foapaName: "",
});

let obj2 = ref({
  empNo2: localStorage.getItem("employmentNumber"),
  foapaNumber2: "",
});

type UserData = {
  firstName: string;
  lastName: string;
  workEmail: string;
  employmentNumber: number;
  phoneNumber: string;
};

let userInfo = ref<UserData>({
  employmentNumber: 0,
  firstName: "",
  lastName: "",
  phoneNumber: "",
  workEmail: "",
});

let storedReimbursementTickets = ref<any>([]);

let filteredStoredReimbursementTickets = computed(() => {
  if (searchValue.value === "") {
    return storedReimbursementTickets.value;
  } else {
    return storedReimbursementTickets.value.filter((ticket) =>
      ticket.eventName.toLowerCase().includes(searchValue.value.toLowerCase())
    );
  }
});

function closeConnection() {
  axios.get("/close").catch((err) => {
    console.log(err);
  });
}

function signOut() {
  localStorage.setItem("token", "");
  router.push("/");
  alert("Successfully signed out!");
}

function deleteFoapa(fNum: string) {
  obj2.value.foapaNumber2 = fNum;
  axios
    .post("/api/deleteFoapaNumber", obj2.value)
    .then(() => {
      console.log("The thing that was deleted: " + obj2.value);
      alert("Foapa Number Deleted");
      retrieveUserFoapaNumbers();
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.message);
    });
}

let userFoapaNumbers = ref<FoapaNumbers[]>([]);
// let userFoapaName = ref<FoapaName>;

function retrieveUserFoapaNumbers() {
  const storedEmploymentNumber = localStorage.getItem("employmentNumber");
  axios
    .get(`/api/retrieveFoapaNumbers2`, {
      params: { employmentNumber: storedEmploymentNumber },
    })
    .then((res) => {
      userFoapaNumbers.value = res.data;
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

// function retrieveFoapaName(){
//   const storedEmploymentNumber = localStorage.getItem("employmentNumber");
//   axios
//     .get(`/api/retrieveFoapaName`,{
//       params: {employmentNumber: storedEmploymentNumber},
//     })
//     .then((res) => {
//       userFoapaName = res.data;
//       console.log(res);
//     })
//     .catch((err)=>{
//       console.log(err);
//     })
// }

function retrieveUserInformationSummary() {
  axios
    .get(`/api/retrieveUserInformationSummary`)
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
  const dateObj = new Date(dateString);
  const formattedDate = dateObj.toISOString().slice(0, 10);
  return formattedDate;
}

function addReimbursement() {
  router.push("/add-reimbursement");
}

function viewTicket(reimbursementId: string) {
  console.log(reimbursementId);
  router.push({ path: "/add-reimbursement", query: { reimbursementId } });
}

let sortParameter = ref("");
function sortBy(parameter: String) {
  if (parameter === "Date") {
    sortParameter.value = "Date";
    storedReimbursementTickets.value = storedReimbursementTickets.value.sort(
      (ticketA, ticketB) => {
        return (
          //@ts-ignore
          new Date(ticketA.reimbursementDate) -
          //@ts-ignore
          new Date(ticketB.reimbursementDate)
        );
      }
    );
  }
  if (parameter === "") {
    sortParameter.value = "";
    storedReimbursementTickets.value = storedReimbursementTickets.value.sort(
      (ticketA, ticketB) => {
        return (
          //@ts-ignore
          new Date(ticketB.reimbursementDate) -
          //@ts-ignore
          new Date(ticketA.reimbursementDate)
        );
      }
    );
  }
  if (parameter === "Cost") {
    sortParameter.value = "Cost";
    storedReimbursementTickets.value = storedReimbursementTickets.value.sort(
      (ticketA, ticketB) => ticketA.totalAmount - ticketB.totalAmount
    );
  }
  if (parameter === "Status") {
    sortParameter.value = "Status";
    storedReimbursementTickets.value = storedReimbursementTickets.value.sort(
      (ticketA, ticketB) =>
        ticketA.reimbursementStatus - ticketB.reimbursementStatus
    );
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
    // router.push("/");
  } else {
    retrieveUserInformationSummary();
    retrieveUserFoapaNumbers();

    axios
      .get("/api/retrieveReimbursements", {
        params: { employmentNumber: localStorage.getItem("employmentNumber") },
      })
      .then((res) => {
        console.log(res);
        storedReimbursementTickets.value = res.data;
      })
      .catch((err) => {
        alert(err);
      });
  }
});
</script>
