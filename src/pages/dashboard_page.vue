<template>
  <section class="dashboard-page">
    <h3>hi</h3>
    <button @click="closeConnection">Close server connection</button>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { Axios } from "axios";

function closeConnection() {
  axios.get("/close").catch((err) => {
    console.log(err);
  });
}
</script>
