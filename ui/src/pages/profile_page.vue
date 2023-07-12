<template>
  <section class="profile-page-section">
    <img
      src="../assets/detroit-mercy-logo.png"
      alt="Detroit mercy logo"
      class="detroit-mercy-logo"
    />
    <br />
    <h3 class="profile-page-title">Foapa number section</h3>
    <br />
    <div class="foapa-number-wrapper">
      <div
        class="foapa-number"
        v-for="foapa in userFoapaNumbers"
        style="display: flex; flex-direction: column; align-items: start"
      >
        <span class="foapa-number-title">
          <img
            src="../assets/trash-icon.png"
            alt="Trash"
            @click="deleteFoapa(foapa)"
          />
          <h3 style="font-weight: 500">
            {{ foapa.foapaName }}
          </h3>
        </span>
        <div class="foapa-details-container">
          <h3 style="margin-top: 10px">{{ formatUserFoapa(foapa) }}</h3>
        </div>
      </div>
      <div class="filter" @click="goToFoapaPage">
        <h3>Manage Foapa Details</h3>
      </div>
    </div>
    <br />
    <router-link to="/account">
      <h3 class="view-account-info">View User information</h3></router-link
    >
    <br />
    <router-link to="/dashboard" style="text-decoration: none"
      ><button
        class="filter"
        style="border: 0px; padding: 0px 30px; text-decoration: none"
      >
        Back to home
      </button></router-link
    >
    <br />
    <button class="filter sign-out-button" @click="signOut">Sign Out</button>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { FoapaStuff } from "../types/types";

let userFoapaNumbers = ref<FoapaStuff[]>([]);

const router = useRouter();

function formatUserFoapa(foapa: FoapaStuff) {
  // console.log(foapa);
  return `${foapa.fund}-${foapa.organization || "XXXX"}-${foapa.account}-${
    foapa.program || "XXXX"
  }-${foapa.activity || "XXXX"}`;
}

function retrieveUserFoapaDetails() {
  axios
    .get(
      "https://udm-reimbursement-project.onrender.com/api/retrieveFoapaDetails"
    )
    .then((res) => {
      userFoapaNumbers.value = res.data;
      // console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

function deleteFoapa(foapa: FoapaStuff) {
  axios
    .post(
      "https://udm-reimbursement-project.onrender.com/api/deleteFoapaDetail",
      {
        foapa,
      }
    )
    .then(() => {
      retrieveUserFoapaDetails();
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.message);
    });
}

function goToFoapaPage() {
  router.push("/add-foapa");
}

function signOut() {
  localStorage.setItem("token", "");
  router.push("/");
  alert("Successfully signed out!");
}

onMounted(() => {
  retrieveUserFoapaDetails();
});
</script>
<style scoped>
.profile-page-section {
  padding: 50px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.detroit-mercy-logo {
  width: 100px;
}

.profile-page-title {
  font-weight: 500;
  font-size: 15px;
}

.view-account-info {
  font-weight: 400;
  font-size: 14px;
}

.sign-out-button {
  border: 0px;
  padding: 0px 30px;
  text-decoration: none;
  background-color: var(--udmercy-red);
}
</style>
