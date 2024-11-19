<template>
  <section class="foapa-number-section">
    <div class="logo-container">
      <img
        src="../../assets/detroit-mercy-logo.png"
        class="udmercy-logo"
        @click="$router.push('/dashboard')"
        alt="Detroit Mercy logo"
      />
    </div>
    <h3 class="mb-0">Foapa Numbers</h3>
    <br />
    <div v-if="userFoapaNumbers.length === 0">
      <h4 class="text-sm font-normal italic my-7 w-64 text-center leading-7">
        No FOAPA has been added yet.
      </h4>
    </div>
    <div class="foapa-number-wrapper max-h-[70vh] overflow-auto pb-3 px-3">
      <div
        class="foapa-number mt-5"
        v-for="foapa in userFoapaNumbers"
        style="display: flex; flex-direction: column; align-items: start"
      >
        <span class="foapa-number-title">
          <h3
            :title="foapa.foapaName"
            style="
              font-weight: 500;
              max-width: 100%;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            "
          >
            {{ foapa.foapaName }}
          </h3>
        </span>
        <div
          class="foapa-details-container overflow-hidden max-w-full text-ellipsis flex-nowrap"
        >
          <h3 style="margin-top: 10px">{{ formatFoapaDeails(foapa) }}</h3>
        </div>
      </div>
    </div>
    <div
      class="filter"
      :class="userFoapaNumbers.length === 0 ? '' : 'mt-5'"
      @click="goToFoapaPage"
    >
      <h3>Manage Foapa Details</h3>
    </div>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { FoapaStuff } from "../../types/types";
import { formatFoapaDeails } from "../../utils/formatFoapaDetails";

let userFoapaNumbers = ref<FoapaStuff[]>([]);

const router = useRouter();

function retrieveUserFoapaDetails() {
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/retrieve-foapa-details`)
    .then((res) => {
      userFoapaNumbers.value = res.data;
    })
    .catch((err) => {
      console.log("There was an error fetching FOAPA values");
      console.log(err);
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
