<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

onMounted(() => {
  if (localStorage.getItem("token") !== null && (localStorage.getItem("token")?.length ?? 0 > 0)) {
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    console.log("User is logged in")
  } else {
    console.log("User is not logged in");
  }
})
</script>
