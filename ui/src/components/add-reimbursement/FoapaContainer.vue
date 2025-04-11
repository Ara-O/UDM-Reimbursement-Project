<template>
  <div class="foapa relative" v-if="foapa">
    <h3
      class="overflow-hidden text-ellipsis whitespace-nowrap"
      :title="formatFoapaDeails(foapa)"
    >
      {{ foapa.foapaName }} -
      {{ formatFoapaDeails(foapa) }}
    </h3>
    <h4
      class="overflow-hidden text-ellipsis !text-[14px] whitespace-nowrap"
      :title="'' + foapa.cost"
    >
      Cost: ${{ foapa.cost }}
    </h4>
    <button
      title="Delete FOAPA"
      :disabled="view_only_mode === true"
      class="activity-option border-none absolute disabled:bg-gray-500 right-10 bottom-5"
      @click="() => $emit('deleteFoapa', foapa._id)"
    >
      <img
        src="../../assets/trash-icon-white.png"
        alt="Trash icon"
        class="trash-icon w-3"
      />
    </button>
    <button
      title="Edit FOAPA"
      class="activity-option absolute disabled:bg-gray-500 :disabled:disabled-icons right-24 border-none bottom-5"
      :disabled="view_only_mode === true"
      @click="() => $emit('editFoapa', foapa._id)"
      style="background-color: white"
    >
      <img
        src="../../assets/blue-pencil.png"
        alt="Edit Foapa"
        class="trash-icon w-4"
      />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { FoapaStuff } from "../../types/types";
import { formatFoapaDeails } from "../../utils/formatFoapaDetails";

type FoapaDetails = FoapaStuff & { _id: string };

const props = defineProps<{
  foapa: FoapaStuff;
  view_only_mode: boolean;
}>();

defineEmits(["deleteFoapa", "editFoapa"]);
</script>

<style scoped>
@import url("../../assets/styles/add-reimbursement-page.css");

.disabled-icons {
  filter: brightness(300) invert(0) saturate(0) !important;
}
</style>
