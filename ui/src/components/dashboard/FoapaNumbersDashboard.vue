<template>
  <section class="foapa-number-section">
    <div class="logo-container">
      <img src="../../assets/detroit-mercy-logo.png" class="udmercy-logo" @click="$router.push('/dashboard')"
        alt="Detroit Mercy logo" />
    </div>
    <h3>Foapa Numbers</h3>
    <br />
    <div class="foapa-number-wrapper">
      <div class="foapa-number" v-for="foapa in userFoapaNumbers"
        style="display: flex; flex-direction: column; align-items: start">
        <span class="foapa-number-title">
          <img src="../../assets/trash-icon.png" alt="Trash" @click="showFoapaDeletionPopup(foapa)" />
          <h3 :title="foapa.foapaName" style="font-weight: 500; max-width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
">
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
  </section>
  <confirmation-popup v-if="deleteFoapaPopupIsVisible" :cancel-function="() => deleteFoapaPopupIsVisible = false"
    :continue-function="() => deleteFoapa(foapaToDelete)">
    <template #message>
      Are you sure you want to delete this FOAPA number. This process can not be reversed. If yes, click Continue.
    </template>
  </confirmation-popup>
</template>

<script lang="ts" setup>
import axios from "axios";
import ConfirmationPopup from "../utilities/ConfirmationPopup.vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { FoapaStuff } from "../../types/types";
import { TYPE, useToast } from "vue-toastification";

let userFoapaNumbers = ref<FoapaStuff[]>([]);
let deleteFoapaPopupIsVisible = ref<boolean>(false)
let foapaToDelete = ref<FoapaStuff>()

const router = useRouter();
const toast = useToast()

function formatUserFoapa(foapa: FoapaStuff) {
  // console.log(foapa);
  return `${foapa.fund}-${foapa.organization || "XXXX"}-${foapa.account}-${foapa.program || "XXXX"
    }-${foapa.activity || "XXXX"}`;
}

function retrieveUserFoapaDetails() {
  axios
    .get(
      `${import.meta.env.VITE_API_URL}/api/retrieve-foapa-details`
    )
    .then((res) => {
      userFoapaNumbers.value = res.data;
      // console.log(res);
    })
    .catch((err) => {
      console.log("err fetching foapa")
      console.log(err.message);
    });
}

function showFoapaDeletionPopup(foapa: FoapaStuff) {
  foapaToDelete.value = foapa
  deleteFoapaPopupIsVisible.value = true
}

function deleteFoapa(foapa: FoapaStuff | undefined) {
  axios
    .post(
      `${import.meta.env.VITE_API_URL}/api/deleteFoapaDetail`,
      {
        foapa,
      }
    )
    .then(() => {
      toast("FOAPA deleted successfully", {
        type: TYPE.SUCCESS
      })

      retrieveUserFoapaDetails();
      deleteFoapaPopupIsVisible.value = false;
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.message);
    });
}

function goToFoapaPage() {
  router.push("/add-foapa");
}

onMounted(() => {
  retrieveUserFoapaDetails();
});
</script>

<style scoped>
.foapa-details-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
</style>
