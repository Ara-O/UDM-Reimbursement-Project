<template>
  <div class="foapa relative" v-if="foapa">
    <h3
      class="overflow-hidden text-ellipsis whitespace-nowrap"
      :title="assignFoapaNumber(foapa.foapa_id)"
    >
      {{ assignFoapaName(foapa.foapa_id) }} -
      {{ assignFoapaNumber(foapa.foapa_id) }}
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
      @click="() => $emit('deleteFoapa', foapa.foapa_id)"
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
      @click="() => $emit('editFoapa', foapa.foapa_id)"
    >
      <img
        src="../../assets/edit-icon.png"
        alt="Trash icon"
        class="trash-icon w-4 invert"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FoapaInput, FoapaStuff } from "../../types/types";

type FoapaDetails = FoapaStuff & { _id: string };

const props = defineProps<{
  foapa: FoapaInput;
  filteredUserFoapas: FoapaDetails[];
}>();

// const toast = new Toast();

function formatUserFoapa(foapa) {
  console.log(foapa);
  return `${foapa.fund}-${foapa.organization || "XXXX"}-${
    foapa.account.slice(0, 4) || "XXXX"
  }-${foapa.program || "XXXX"}-${foapa.activity || "XXXX"}`;
}

const assignFoapaName = (event) => {
  const selectedFoapaId = event;

  //Loops through the users foapa and finds which id matches, from there, it
  //returns the name
  const selectedFoapa = props.filteredUserFoapas.find(
    (foapa) => foapa._id === selectedFoapaId
  );

  if (selectedFoapa === undefined) {
    // toast;
    return "ERROR";
  }

  return selectedFoapa?.foapaName;
  // assignedFoapa.value.foapa_id = selectedFoapaId;
};

const assignFoapaNumber = (event) => {
  const selectedFoapaId = event;
  console.log(event);
  //returns the name
  const selectedFoapa = props.filteredUserFoapas.find(
    (foapa) => foapa._id === selectedFoapaId
  );

  if (selectedFoapa === undefined) {
    // toast;
    return "ERROR";
  }
  return formatUserFoapa(selectedFoapa);
};

defineEmits(["deleteFoapa", "editFoapa"]);
</script>

<style scoped>
@import url("../../assets/styles/add-reimbursement-page.css");
</style>
