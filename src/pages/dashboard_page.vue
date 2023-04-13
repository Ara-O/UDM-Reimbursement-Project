<template>
  <section class="dashboard-page">
    <section class="foapa-number-section">
      <h3>Foapa Numbers</h3>
      <br />
      <div class="foapa-number-wrapper">
        <div class="foapa-number" v-for="foapa in userFoapaNumbers">
          <h3>{{ foapa.foapaNumber }}</h3>
          <img
            src="../assets/trash-icon.png"
            alt="Trash"
            @click="deleteFoapa"
          />
        </div>
        <div class="foapa-number">
          <input
            type="text"
            name="Foapa Number"
            placeholder="New FOAPA Number"
          />
          <img src="../assets/add-icon2.png" alt="add-icon2" @click="add" />
        </div>
      </div>
    </section>

    <section class="reimbursement-section">
      <h3>Welcome {{ userInfo.firstName }}</h3>
      <br />
      <div class="reimbursement-search-input">
        <input
          type="text"
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
        <div class="add-button">
          <img
            src="../assets/add-icon.png"
            alt="Add icon"
            class="add-icon"
            @click="addReimbursement"
          />
        </div>
      </div>
      <div class="search-filters">
        <div class="filter selected">
          <h3>Sort by Date</h3>
        </div>
        <div class="filter">
          <h3>Sort by Date</h3>
        </div>
        <div class="filter">
          <h3>Sort by Date</h3>
        </div>
      </div>
      <br />
      <h3 style="font-weight: 500; font-size: 14.5px">
        All Reimbursements -
        <router-link to="/add-reimbursement"
          >Click here to add reimbursement ticket</router-link
        >
      </h3>
      <br />
      <div class="reimbursement-wrapper">
        <div class="reimbursement">
          <h3>University Conference</h3>
          <h4>Status: Accepted</h4>
          <h5>12/12/2032</h5>
          <div class="reimbursement-buttons">
            <button>Delete</button>
            <button>View</button>
          </div>
        </div>
        <div class="reimbursement">
          <h3>University Conference</h3>
          <h4>Status: Accepted</h4>
          <h5>12/12/2032</h5>
          <div class="reimbursement-buttons">
            <button>Delete</button>
            <button>View</button>
          </div>
        </div>
        <div class="reimbursement">
          <h3>University Conference</h3>
          <h4>Status: Accepted</h4>
          <h5>12/12/2032</h5>
          <div class="reimbursement-buttons">
            <button>Delete</button>
            <button>View</button>
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
      <button>Sign Out</button>
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

const router = useRouter();
type FoapaNumbers = {
  employmentNumber: number;
  foapaNumber: string;
};

function closeConnection() {
  axios.get("/close").catch((err) => {
    console.log(err);
  });
}

function add() {
  console.log("The foapa number was added");
}

function deleteFoapa() {
  console.log("The foapa was deleted");
}

let userFoapaNumbers = ref<FoapaNumbers[]>([
  {
    employmentNumber: 200,
    foapaNumber: "100-10001-101-01",
  },
  {
    employmentNumber: 200,
    foapaNumber: "100-13201-101-01",
  },
]);

function retrieveUserFoapaNumbers() {
  const storedEmploymentNumber = localStorage.getItem("employmentNumber");
  axios
    .get(`/api/retrieveFoapaNumbers`, {
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

function retrieveUserInformation() {
  const storedEmploymentNumber = localStorage.getItem("employmentNumber");
  axios
    .get(`/api/retrieveUserInformation`, {
      params: { employmentNumber: storedEmploymentNumber },
    })
    .then((res) => {
      userInfo.value = res.data[0];
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

function addReimbursement() {
  router.push("/add-reimbursement");
}
onMounted(() => {
  if (localStorage.getItem("employmentNumber") === null) {
    console.log("no local storage item");
    // Commenting out cau
    router.push("/");
  } else {
    retrieveUserFoapaNumbers();
    retrieveUserInformation();
  }
});
</script>
