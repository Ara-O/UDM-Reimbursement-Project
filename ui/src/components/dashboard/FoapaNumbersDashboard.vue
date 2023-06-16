<template>
  <section class="foapa-number-section">
    <h3>Foapa Numbers</h3>
    <br />
    <div class="foapa-number-wrapper">
      <div
        class="foapa-number"
        v-for="foapa in userFoapaNumbers"
        style="display: flex; flex-direction: column; align-items: start"
      >
        <span class="foapa-number-title">
          <img
            src="../../assets/trash-icon.png"
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
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { FoapaStuff } from "../../types/types";

let userFoapaNumbers = ref<FoapaStuff[]>([]);

const router = useRouter();

function formatUserFoapa(foapa: FoapaStuff) {
  console.log(foapa);
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
      console.log(res);
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
