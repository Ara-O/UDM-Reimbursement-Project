<template>
  <section class="add-foapa-page">
    <img
      src="../assets/detroit-mercy-logo.png"
      class="udmercy-logo"
      @click="$router.push('/dashboard')"
      alt="Detroit mercy logo"
    />
    <div class="manage-foapa-div">
      <h3 class="manage-foapa-text">Manage FOAPA</h3>
      <ManageFoapaDetails :foapa-details="foapaDetails" />
      <div class="add-foapa-button-wrapper">
        <button
          class="add-foapa-button"
          style="width: auto; padding: 0px 30px"
          @click="$router.push('/dashboard')"
        >
          Go to Dashboard
        </button>
        <button class="add-foapa-button" @click="updateFoapa">
          Save FOAPAs
        </button>
      </div>
      <h3 class="add-foapa-success-message" v-if="successMessage">
        {{ successMessage }}
      </h3>
      <h3 class="add-foapa-loading-message" v-if="loadingMessage">
        {{ loadingMessage }}
      </h3>
      <h3 class="add-foapa-error-message" v-if="errorMessage">
        {{ errorMessage }}
      </h3>
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
let loadingMessage = ref<string>("");
function retrieveUserFoapaDetails() {
  axios
    .get(
      "https://udm-reimbursement-project.onrender.com/api/retrieveFoapaDetails"
    )
    .then((res) => {
      foapaDetails.value = res.data;
      // console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

function updateFoapa() {
  successMessage.value = "";
  errorMessage.value = "";
  loadingMessage.value = "Updating FOAPA details...";
  axios
    .post(
      "https://udm-reimbursement-project.onrender.com/api/updateFoapaDetails",
      {
        foapaDetails: foapaDetails.value,
      }
    )
    .then((res) => {
      loadingMessage.value = "";
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
