<template>
  <section class="add-foapa-page">
    <img
      src="../assets/detroit-mercy-logo.png"
      class="udmercy-logo"
      alt="Detroit mercy logo"
    />
    <div class="manage-foapa-div">
      <h3 class="manage-foapa-text">Manage FOAPA</h3>
      <ManageFoapaDetails :foapa-details="foapaDetails" />
      <div class="add-foapa-button-wrapper">
        <button class="add-foapa-button" @click="$router.push('/dashboard')">
          Discard Changes
        </button>
        <button class="add-foapa-button" @click="updateFoapa">
          Save FOAPAs
        </button>
      </div>
      <h3 class="add-foapa-success-message">{{ successMessage }}</h3>
      <h3 class="add-foapa-error-message">{{ errorMessage }}</h3>
    </div>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { FoapaStuff } from "../types/types";
import { useRouter } from "vue-router";
import ManageFoapaDetails from "../components/manage-foapa/ManageFoapaDetails.vue";

const router = useRouter();
let foapaDetails = ref<FoapaStuff[]>([]);
let successMessage = ref<string>("");
let errorMessage = ref<string>("");
function retrieveUserFoapaDetails() {
  axios
    .get("http://localhost:8080/api/retrieveFoapaDetails")
    .then((res) => {
      foapaDetails.value = res.data;
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

function updateFoapa() {
  axios
    .post("http://localhost:8080/api/updateFoapaDetails", {
      foapaDetails: foapaDetails.value,
    })
    .then((res) => {
      successMessage.value = res.data.message;
      // alert(res.data.message);
      // router.push("/dashboard");
    })
    .catch((err) => {
      console.log(err);
      errorMessage.value = err.response.data.message;
    });
}

onMounted(() => {
  retrieveUserFoapaDetails();
});
</script>

<style scoped>
@import url("../assets/styles/add-foapa-page.css");
</style>
