<template>
  <section class="add-foapa-page">
    <div>
      <img
        src="../assets/detroit-mercy-logo.png"
        class="udmercy-logo"
        alt="Detroit mercy logo"
      />
    </div>

    <div class="add-foapa-button-wrapper">
      <button class="add-foapa-button" @click="$router.push('/dashboard')">
        Discard Changes
      </button>
      <button class="add-foapa-button" @click="updateFoapa">Save FOAPAs</button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { reactive, ref, onMounted } from "vue";
import { FoapaStuff } from "../types/types";
import { useRouter } from "vue-router";

const router = useRouter();
let foapaList = ref<FoapaStuff[]>([]);

function updateFoapa() {
  axios
    .post("http://localhost:8080/api/updateFoapaDetails", {
      foapaData: foapaList.value,
    })
    .then((res) => {
      alert(res.data.message);
      router.push("/dashboard");
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.message);
    });
}

onMounted(() => {
  retrieveFoapaDetails();
});
</script>

<style scoped>
@import url("../assets/styles/add-foapa-page.css");
</style>
