<template>
  <div class="activity">
    <img
      src="../../assets/exclamation-mark.png"
      alt="Error"
      class="activity-error"
      v-if="activityHasError"
      title="Deleted FOAPA number is in use. Please reassign a FOAPA number"
    />
    <h3>{{ activity.activityName }}</h3>
    <h4>
      Date: {{ parseDate(activity.activityDate) }} || Cost:
      {{ activity.cost }}
    </h4>
    <h4>Foapa Number: {{ activity.foapaNumber }}</h4>
    <div class="activity-options-wrapper">
      <div
        class="activity-option"
        @click="$emit('deleteActivity', activity.activityId)"
      >
        <img
          src="../../assets/trash-icon-white.png"
          alt="Trash icon"
          class="trash-icon"
          style="width: 13px"
        />
      </div>
      <div
        @click="$emit('editActivity', activity.activityId)"
        class="activity-option"
      >
        <img
          src="../../assets/edit-icon.png"
          class="edit-icon-button"
          alt="Edit icon"
          style="filter: invert(); width: 20px"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Activity, FoapaStuff } from "../../types/types";
import { onMounted, watch, ref } from "vue";

let activityHasError = ref<boolean>(false);
const props = defineProps<{
  activity: Activity;
  foapaDetails: FoapaStuff[] | undefined;
}>();

function formatUserFoapa(foapa: FoapaStuff) {
  return `${foapa.fund}-${foapa.organization || "XXXX"}-${foapa.account}-${
    foapa.program || "XXXX"
  }-${foapa.activity || "XXXX"}`;
}

watch(
  () => props.foapaDetails,
  (details) => {
    if (details && details.length > 0) {
      const formattedFoapa = details?.map((foapa) => formatUserFoapa(foapa));
      if (!formattedFoapa.includes(props.activity.foapaNumber)) {
        console.log("mismatch");
      }
    }
  }
);

function parseDate(dateString: string) {
  const dateParsed = new Date(dateString);
  const formattedDate = dateParsed.toISOString().slice(0, 10);
  return formattedDate;
}

defineEmits(["deleteActivity", "editActivity"]);

onMounted(() => {
  if (props.foapaDetails && props.foapaDetails.length > 0) {
    const formattedFoapa = props.foapaDetails?.map((foapa) =>
      formatUserFoapa(foapa)
    );
    if (!formattedFoapa.includes(props.activity.foapaNumber)) {
      activityHasError.value = true;
    }
  }
});
</script>

<style scoped>
@import url("../../assets/styles/add-reimbursement-page.css");
</style>
