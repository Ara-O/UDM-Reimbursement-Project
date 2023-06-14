<template>
  <div class="activity">
    <h3>{{ activity.activityName }}</h3>
    <h4>
      Date: {{ parseDate(activity.activityDate) }} || Cost:
      {{ activity.cost }}
    </h4>
    <h4>Foapa Number: {{ activity.foapaNumber }}</h4>
    <div class="activity-options-wrapper">
      <div
        class="activity-option"
        @click="$emit('deleteActivity', activity._id)"
      >
        <img
          src="../../assets/trash-icon-white.png"
          alt="Trash icon"
          class="trash-icon"
          style="width: 13px"
        />
      </div>
      <div @click="$emit('editActivity', activity._id)" class="activity-option">
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
import { Activity } from "../../types/types";
defineProps<{
  activity: Activity;
}>();

function parseDate(dateString: string) {
  const dateParsed = new Date(dateString);
  const formattedDate = dateParsed.toISOString().slice(0, 10);
  return formattedDate;
}

defineEmits(["deleteActivity", "editActivity"]);
</script>

<style scoped>
@import url("../../assets/styles/add-reimbursement-page.css");
</style>
