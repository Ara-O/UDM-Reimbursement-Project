<template>
  <div
    class="absolute z-50 bg-black bg-opacity-50 h-screen top-0 left-0 w-screen items-center flex justify-center"
  >
    <div
      class="bg-white shadow-md border border-solid border-gray-100 h-min px-6 w-96 py-3 rounded-md"
    >
      <span class="flex justify-between">
        <div class="flex items-center gap-2">
          <img :src="CautionIcon" alt="Caution icon" class="w-10" />
          <h3 class="font-semibold text-sm">Confirmation</h3>
        </div>
        <!-- <img :src="CancelIcon" alt="Cancel icon" class="w-3 opacity-75" @click="cancelFunction" -->
      </span>
      <h4 class="text-[13px] font-normal leading-6 mt-1">
        <slot name="message"> </slot>
      </h4>
      <div class="float-right mb-2">
        <button
          @click="cancelFunction"
          class="bg-white border border-solid border-udmercy-red text-udmercy-red px-5 py-1.5 text-xs cursor-pointer hover:text-white hover:bg-udmercy-red transition-all rounded-full"
        >
          {{ leftButtonText || "Cancel" }}
        </button>
        <button
          @click="continueFunction"
          class="ml-3 bg-white border border-solid border-udmercy-blue text-udmercy-blue px-5 py-1.5 text-xs cursor-pointer hover:text-white hover:bg-udmercy-blue transition-all rounded-full"
        >
          {{ rightButtonText || "OK" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CautionIcon from "../../assets/caution-icon.png";
import CancelIcon from "../../assets/cross-icon.svg";

defineProps([
  "cancelFunction",
  "continueFunction",
  "leftButtonText",
  "rightButtonText",
]);
</script>
