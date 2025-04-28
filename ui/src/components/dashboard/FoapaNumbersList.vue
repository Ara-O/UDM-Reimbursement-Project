<template>
  <h3 class="text-base font-semibold mt-12">FOAPA Numbers</h3>
  <div class="max-h-96 h-auto overflow-auto">
    <skeleton
      height="5rem"
      borderRadius="6px"
      v-if="!foapa_numbers_has_loaded"
    ></skeleton>
    <div v-else>
      <div
        v-for="foapa in foapa_data"
        class="border box-border flex flex-col mb-3 gap-2 h-20 justify-center overflow-auto px-5 py-4 border-solid border-gray-200 rounded-md"
      >
        <h4
          class="my-0 text-nm font-medium text-ellipsis overflow-hidden max-w-56 whitespace-nowrap"
        >
          {{ foapa?.foapaName || "Error" }}
        </h4>
        <p class="my-0 text-sm">{{ formatFoapaDeails(foapa) }}</p>
      </div>
    </div>
  </div>
  <button
    class="bg-udmercy-blue cursor-pointer border-none hover:bg-[#002060] transition-all duration-200 text-white w-full h-12 mt-3 text-nm rounded-full border"
    @click="goToManageFoapaDetailsPage"
  >
    Manage FOAPA Details
  </button>
</template>

<script lang="ts" setup>
import Skeleton from "primevue/skeleton";
import { inject, ref, watch } from "vue";
import { FoapaStuff } from "../../types/types";
import { formatFoapaDeails } from "../../utils/formatFoapaDetails";
import { useRouter } from "vue-router";

const foapa_numbers_has_loaded = ref<boolean>(false);

const foapa_data = inject<null | FoapaStuff[]>("foapa_data");

const router = useRouter();

watch(
  foapa_data as object,
  () => {
    foapa_numbers_has_loaded.value = true;
  },
  {
    immediate: true,
  }
);

function goToManageFoapaDetailsPage() {
  router.push("/manage-foapa");
}
</script>
