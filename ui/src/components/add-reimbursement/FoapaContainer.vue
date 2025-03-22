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
    <div
      title="Delete FOAPA"
      class="activity-option absolute right-10 bottom-5"
      @click="() => $emit('deleteFoapa', foapa._id)"
    >
      <img
        src="../../assets/trash-icon-white.png"
        alt="Trash icon"
        class="trash-icon w-3"
      />
    </div>
    <div
      title="Edit FOAPA"
      class="activity-option absolute right-24 bottom-5"
      @click="() => $emit('editFoapa', foapa._id)"
      style="background-color: white"
    >
      <img
        src="../../assets/blue-pencil.png"
        alt="Edit Foapa"
        class="trash-icon w-4"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FoapaStuff } from "../../types/types";
import { formatFoapaDeails } from "../../utils/formatFoapaDetails";

type FoapaDetails = FoapaStuff & { _id: string };

const props = defineProps<{
  foapa: FoapaStuff;
}>();

defineEmits(["deleteFoapa", "editFoapa"]);
</script>

<style scoped>
@import url("../../assets/styles/add-reimbursement-page.css");
</style>
