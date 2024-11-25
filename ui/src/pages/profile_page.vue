<template>
  <section class="profile-page-section">
    <img src="../assets/detroit-mercy-logo.png" alt="Detroit mercy logo" class="detroit-mercy-logo" />
    <br />
    <h3 class="profile-page-title mt-10 !text-lg">Your Profile</h3>
    <router-link to="/account" style="text-decoration: none"><button class="filter"
        style="border: 0px; padding: 0px 30px; text-decoration: none">
        View Your User Information
      </button></router-link>
    <h3 class="profile-page-title mt-10 !text-lg">FOAPA Section</h3>
    <div class="foapa-number-wrapper">
      <div class="foapa-number" v-for="foapa in userFoapaNumbers"
        style="display: flex; flex-direction: column; align-items: start">
        <span class="foapa-number-title">
          <!-- <img
            src="../assets/trash-icon.png"
            alt="Trash"
            @click="deleteFoapa(foapa)"
          /> -->
          <h3 style="font-weight: 500">
            {{ foapa.foapaName }}
          </h3>
        </span>
        <div class="foapa-details-container overflow-hidden flex-nowrap max-w-full text-ellipsis">
          <h3 style="margin-top: 10px">{{ formatFoapaDeails(foapa) }}</h3>
        </div>
      </div>
      <button class="filter" @click="goToFoapaPage" style="border: 0px; padding: 0px 30px; text-decoration: none">
        Manage FOAPA Details
      </button>
    </div>

    <router-link to="/dashboard" style="text-decoration: none" class="mt-5"><button class="filter"
        style="border: 0px; padding: 0px 30px; text-decoration: none">
        Back to home
      </button></router-link>

    <br />
    <button class="filter sign-out-button mt-5" @click="signOut">
      Sign Out
    </button>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { FoapaStuff } from "../types/types";
import { TYPE, useToast } from "vue-toastification";
import { formatFoapaDeails } from "../utils/formatFoapaDetails";

let userFoapaNumbers = ref<FoapaStuff[]>([]);

const router = useRouter();

function retrieveUserFoapaDetails() {
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/retrieve-foapa-details`)
    .then((res) => {
      userFoapaNumbers.value = res.data;
      // console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

// TODO: UPDATE
// function deleteFoapa(foapa: FoapaStuff) {

//   axios
//     .post(`${import.meta.env.VITE_API_URL}/api/deleteFoapaDetail`, {
//       foapa,
//     })
//     .then(() => {
//       retrieveUserFoapaDetails();
//     })
//     .catch((err) => {
//       console.log(err);
//       alert(err.response.data.message);
//     });
// }

function goToFoapaPage() {
  router.push("/manage-foapa");
}

const toast = useToast();
function signOut() {
  localStorage.setItem("token", "");
  router.push("/");
  toast("Successfully signed out!", {
    type: TYPE.SUCCESS,
  });
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
